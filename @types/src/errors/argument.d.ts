/**
 * @template T
 * @template U
 * @template V
 */
export default class ArgumentError<T, U, V> extends GenericError {
    /**
     * @param  {new T}   type
     * @param  {string}  method_name
     * @param  {string}  param_name
     * @param  {new U}   param_type
     * @param  {new V}   arg_type
     */
    constructor(type: new () => T, method_name: string, param_name: string, param_type: new () => U, arg_type: new () => V);
}
import GenericError from "./generic.js";
