import { tag } from "../utils/tagify.js";
import GenericError from "./generic.js";

/**
 * @template T
 */
export default class ReadOnlyError extends GenericError {
	/**
	 * @param    {new T}  type
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
