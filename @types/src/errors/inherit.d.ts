/**
 * @template T
 * @template U
 */
export default class InheritError<T, U> extends GenericError {
    /**
     * @param  {new T}  type
     * @param  {new U}  parent
     */
    constructor(type: new () => T, parent: new () => U);
}
import GenericError from "./generic.js";
