/**
 * @template T
 */
export default class ReadOnlyError<T> extends GenericError {
    /**
     * @param    {new T}  type
     * @param    {string|symbol}  key
     */
    constructor(type: new () => T, key: string | symbol);
}
import GenericError from "./generic.js";
