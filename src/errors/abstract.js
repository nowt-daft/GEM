import GenericError from "./generic.js";

export default class AbstractError extends GenericError {
	/**
	 * @param {string} name
	 */
	constructor(
		name
	) {
		super(
			"Abstract Class Construct Error",
			`Cannot construct abstract ${ name } directly.  Must be inherited.`
		);
	}
}
