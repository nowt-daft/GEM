import GenericError from "./generic.js";

export default class MetaTypeError extends GenericError {
	/**
	 * @param {string} meta_name
	 */
	constructor(
		meta_name
	) {
		super(
			`"${meta_name}" Meta Type Constructor Error`,
			`WRONG SYNTAX. Cannot use *new* keyword on Meta Types. ` +
			`MetaType constructs functions/constructors, not Object instances.`
		);
	}
}
