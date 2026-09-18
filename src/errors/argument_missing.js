import GenericError from "./generic.js";
import tagify, { tag } from "../utils/tagify.js";

export default class MissingArgumentError extends GenericError {
	/**
	 * @param  {class}   type
	 * @param  {string}  method_name
	 * @param  {string}  param_name
	 * @param  {class}   param_type
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

