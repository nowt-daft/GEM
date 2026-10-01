/**
 * @template T
 */
export default class RequiredPropertyError<T> extends GenericError {
    /**
     * @param    {new T}  type
     * @param    {string|symbol}  key
     * @param    {class}  property_type
     */
    constructor(type: new () => T, key: string | symbol, property_type: class);
}
import GenericError from "./generic.js";
