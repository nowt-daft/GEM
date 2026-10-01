/**
 * @template T
 * @template U
 */
export default class RestArgumentError<T, U> extends GenericError {
    /**
     * @param  {new T}       type
     * @param  {string}      method_name
     * @param  {string}      param_name
     * @param  {new U}       param_type
     * @param  {Array<any>}  rest_args
     */
    constructor(type: new () => T, method_name: string, param_name: string, param_type: new () => U, rest_args: Array<any>);
}
import GenericError from "./generic.js";
