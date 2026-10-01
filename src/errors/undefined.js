import { tag } from "../utils/tagify.js";
import GenericError from "./generic.js";

/**
 * @template T
 */
export default class UndefinedPropertyError extends GenericError {
	/**
	 * @param    {new T}  type         type/class or some sort of constructable
	 * @param    {string|symbol}  key  the property that is not defined on given type
	 */
	constructor(
		type,
		key
	) {
		super(
			"Undefined Property Error",
			tag`Property with key ${ key } is not defined by ${ type }.`
		);
	}
}
