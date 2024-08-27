import is from "../utils/is.js";
import { forEach } from "../types/object.js";

import { Field } from "./field.js";
import Fields from "./fields.js";

import ArgumentError from "../errors/argument.js";
import ReturnError from "../errors/return.js";
import Properties from "./properties.js";

/**
 * @typedef {class} Type
 */

/**
 * @function  Method
 * @param     {object}               definition
 * @param     {Record<string,Type>}  [definition.params]
 * @param     {Function}             definition.method
 * @param     {Type}                 [definition.returns=undefined]
 * @returns   {Function}
 */
export default function Method(
	{ params = {}, method, returns = undefined }
) {
	// we need to APPEND details onto this function...
	// that's actually not too bad.  We can do that easily.
	const fields = Fields.create(params);
	return Object.defineProperties(
		function(...args) {
			const given = [...args];
			forEach(
				fields,
				(
					_,
					/** @type {Field} */
					field
				) => {
					const arg = given.shift();
					if (
						!(arg instanceof field.type) &&
						is.defined(arg) &&
						!field.is_nullable
					)
						throw new ArgumentError(
							field.key,
							field.type,
							arg?.constructor
						);
				}
			);

			const rtrn = method(...args);
			if (!(rtrn instanceof returns))
				throw new ReturnError(
					this.constructor,
					"",
					returns,
					rtrn?.constructor
				);
			return rtrn;
		},
		Properties.fixed({
			params, returns
		}, false)
	);
}
