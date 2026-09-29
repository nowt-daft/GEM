export default class UndefinedPropertyError extends GenericError {
    /**
     * @param    {class} type  type/class or some sort of constructable
     * @param    {string|symbol} key  the property that is not defined on given type
     */
    constructor(type: class, key: string | symbol);
}
import GenericError from "./generic.js";
