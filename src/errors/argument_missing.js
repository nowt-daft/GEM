import GenericError from "./generic.js";
import tagify, { tag } from "../utils/tagify.js";

/**
 * @template T
 * @template U
 */
export default class MissingArgumentError extends GenericError {
	/**
	 * @param  {new T}   type
	 * @param  {string}  method_name
	 * @param  {string}  param_name
	 * @param  {new U}   param_type
	 */
	constructor(
		type,
		method_name,
		param_name,
		param_type
	) {
		super(
			`Missing Argument Error [${ tagify(type) } :: ${ method_name }]`,
			tag`Parameter ${
				param_name
			} expects a ${
				param_type
			} but is missing/undefined.`
		);
	}
}

