import { tag } from "../utils/tagify.js";
import GenericError from "./generic.js";

export default class ReadOnlyError extends GenericError {
	/**
	 * @param    {class}  type
	 * @param    {string|symbol}  key
	 */
	constructor(
		type,
		key
	) {
		super(
			"Read Only Error",
			tag`Cannot set value of read-only property ${ key } on ${ type }.`
		);
	}
}
