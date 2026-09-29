export default class ComponentDefinitionError extends GenericError {
    /**
     * @param  {string}  tag  The HTML tag of the Component.
     */
    constructor(tag: string);
}
import GenericError from "./generic.js";
