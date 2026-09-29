export default class RestArgumentError extends GenericError {
    /**
     * @param  {class}       type
     * @param  {string}      method_name
     * @param  {string}      param_name
     * @param  {class}       param_type
     * @param  {Array<any>}  rest_args
     */
    constructor(type: class, method_name: string, param_name: string, param_type: class, rest_args: Array<any>);
}
import GenericError from "./generic.js";
