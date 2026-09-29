export default class MissingArgumentError extends GenericError {
    /**
     * @param  {class}   type
     * @param  {string}  method_name
     * @param  {string}  param_name
     * @param  {class}   param_type
     */
    constructor(type: class, method_name: string, param_name: string, param_type: class);
}
import GenericError from "./generic.js";
