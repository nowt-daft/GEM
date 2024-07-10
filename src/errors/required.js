import { tag } from "../utils/tagify.js";
import GenericError from "./generic.js";

export default class RequiredPropertyError extends GenericError {
	/**
	 * @param    {class} type
	 * @param    {string|symbol} key
	 * @param    {class} property_type
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

