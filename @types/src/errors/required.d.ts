export default class RequiredPropertyError extends GenericError {
    /**
     * @param    {class} type
     * @param    {string|symbol} key
     * @param    {class} property_type
     */
    constructor(type: class, key: string | symbol, property_type: class);
}
import GenericError from "./generic.js";
