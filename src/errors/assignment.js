import { tag } from "../utils/tagify.js";
import GenericError from "./generic.js";

const STAR = '*';
const MAYBE = '?';
const EMPTY = '';

/**
 * @template T
 * @template U
 */
export default class AssignmentError extends GenericError {
	/**
	 * @param {new T} type
	 * @param {string|symbol} key
	 * @param {any} value
	 * @param {new U} property_type
	 * @param {boolean} required
	 * @param {boolean} nullable
	 */
	constructor(
		type,
		key,
		value,
		property_type,
		required,
		nullable
	) {
		super(
			"Assignment Error",
			tag`${ type } @ ${ key }:${ property_type }` +
			(required ? STAR : nullable ? MAYBE : EMPTY) +
			tag` cannot accept ${ value } of ${ value?.constructor }`
		);
	}
}
