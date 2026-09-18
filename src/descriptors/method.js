import is from "../utils/is.js";
import { forEach } from "../types/object.js";

import { Field } from "./field.js";
import Fields from "./fields.js";

import ArgumentError from "../errors/argument.js";
import MissingArgumentError from "../errors/argument_missing.js";
import RestArgumentError from "../errors/argument_rest.js";

import ReturnError from "../errors/return.js";
import Properties from "./properties.js";

const REST = "...";

/**
 * @typedef {class} Type
 */

/**
 * @function  Method
 * @param     {string}               name
 * @param     {object}               definition
 * @param     {Record<string,Type>}  [definition.params]
 * @param     {Function}             definition.method
 * @param     {Type}                 [definition.returns=undefined]
 * @returns   {Function}
 */
export default function Method(
	name,
	{ params = {}, method, returns = undefined }
) {
	const fields = Fields.create(params);
	return Object.defineProperties(
		function(...args) {
			const _type = this.constructor;
			const given = [...args];

			forEach(
				fields,
				(
					_,
					/** @type {Field} */
					{ key, is_nullable, type }
				) => {
					if (given.length === 0) {
						if (!is_nullable)
							throw new MissingArgumentError(
								_type,
								name,
								key,
								type,
							);

						return;
					}
					
					if (
						key.startsWith(REST)
					) {
						const rest = given.splice(0, given.length);

						if (
							!(rest instanceof type)
						)
							throw new RestArgumentError(
								_type,
								name,
								key,
								type,
								rest
							);

						return;
					}

					const arg = given.shift();

					if (
						!(arg instanceof type) &&
						(
							is.defined(arg) ||
							!is_nullable
						)
					)
						throw new ArgumentError(
							_type,
							name,
							key,
							type,
							arg?.constructor
						);
				}
			);

			const rtrn = method.call(
				this,
				...args
			);
			if (!(rtrn instanceof returns))
				throw new ReturnError(
					_type,
					name,
					returns,
					rtrn?.constructor
				);
			return rtrn;
		},
		Properties.fixed(
			{
				params,
				returns
			},
			false
		)
	);
}
