import GenericError from "./generic.js";
import tagify, { tag } from "../utils/tagify.js";

/**
 * @template T
 * @template U
 * @template V
 */
export default class ArgumentError extends GenericError {
	/**
	 * @param  {new T}   type
	 * @param  {string}  method_name
	 * @param  {string}  param_name
	 * @param  {new U}   param_type
	 * @param  {new V}   arg_type
	 */
	constructor(
		type,
		method_name,
		param_name,
		param_type,
		arg_type
	) {
		super(
			`Argument Error [${ tagify(type) } :: ${ method_name }]`,
			tag`Parameter ${
				param_name
			} expects a ${
				param_type
			} but received a ${
				arg_type
			}`
		);
	}
}
