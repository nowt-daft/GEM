import { tag } from "../utils/tagify.js";
import GenericError from "./generic.js";

/**
 * @template T
 */
export default class RequiredPropertyError extends GenericError {
	/**
	 * @param    {new T}  type
	 * @param    {string|symbol}  key
	 * @param    {class}  property_type
	 */
	constructor(
		type,
		key,
		property_type
	) {
		super(
			"Required Property Error",
			tag`Missing value on ${
				type
			} -> property ${
				key
			} of ${
				property_type
			} is required.`
		)
	}
}

