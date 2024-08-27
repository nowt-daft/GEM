import GenericError from "./generic.js";
import { tag } from "../utils/tagify.js";

export default class ArgumentError extends GenericError {
	/**
	 * @param  {class}   type
	 * @param  {string}  method_name
	 * @param  {string}  param_name
	 * @param  {class}   param_type
	 * @param  {class}   arg_type
	 */
	constructor(
		param_name,
		param_type,
		arg_type
	) {
		super(
			`Argument Error`,
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
