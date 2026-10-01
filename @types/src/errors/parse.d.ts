/**
 * @template T
 */
export default class ParseError<T> extends GenericError {
    /**
     * @param  {new T}  type
     * @param  {any}    value
     */
    constructor(type: new () => T, value: any);
}
import GenericError from "./generic.js";
