export default class ArgumentError extends GenericError {
    /**
     * @param  {class}   type
     * @param  {string}  method_name
     * @param  {string}  param_name
     * @param  {class}   param_type
     * @param  {class}   arg_type
     */
    constructor(param_name: string, param_type: class, arg_type: class);
}
import GenericError from "./generic.js";
