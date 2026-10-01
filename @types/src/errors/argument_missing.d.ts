/**
 * @template T
 * @template U
 */
export default class MissingArgumentError<T, U> extends GenericError {
    /**
     * @param  {new T}   type
     * @param  {string}  method_name
     * @param  {string}  param_name
     * @param  {new U}   param_type
     */
    constructor(type: new () => T, method_name: string, param_name: string, param_type: new () => U);
}
import GenericError from "./generic.js";
