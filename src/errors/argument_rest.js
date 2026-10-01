import GenericError from "./generic.js";
import { tag, tagify } from "../utils/tagify.js";

/**
 * @template T
 * @template U
 */
export default class RestArgumentError extends GenericError {
	/**
	 * @param  {new T}       type
	 * @param  {string}      method_name
	 * @param  {string}      param_name
	 * @param  {new U}       param_type
	 * @param  {Array<any>}  rest_args
	 */
	constructor(
		type,
		method_name,
		param_name,
		param_type,
		rest_args
	) {
		super(
			`Argument Error [${ tagify(type) } :: ${ method_name }]`,
			tag`Rest parameter ${
				param_name
			} expects a ${
				param_type
			} but received ` +
			`[${
				rest_args.map(
					({ constructor }) =>
						tagify(constructor)
				).join(', ')
			}]`
		);
	}
}

