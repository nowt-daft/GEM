import GenericError from "./generic.js";

export default class ComponentDefinitionError extends GenericError {
	/**
	 * @param  {string}  tag  The HTML tag of the Component.
	 */
	constructor(
		tag
	) {
		super(
			"Component Definition Error",
			`Cannot define a component with tag <${ tag }>. ` +
			`Tag must contain at least one hyphen (-) character.`
		);
	}
}
