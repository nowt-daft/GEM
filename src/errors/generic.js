export default class GenericError extends Error {
	/**
	 * @param    {string} name
	 * @param    {string} description
	 * @param    {Error} [cause]  The original source of the error
	 */
	constructor(
		name,
		description,
		cause
	) {
		super(
			`\n\n🥴 ${ name }:\n${ description }\n\n`,
			{ cause }
		);
	}
}
