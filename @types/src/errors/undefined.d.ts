/**
 * @template T
 */
export default class UndefinedPropertyError<T> extends GenericError {
    /**
     * @param    {new T}  type         type/class or some sort of constructable
     * @param    {string|symbol}  key  the property that is not defined on given type
     */
    constructor(type: new () => T, key: string | symbol);
}
import GenericError from "./generic.js";
