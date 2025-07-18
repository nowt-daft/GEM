export default class ParseError extends GenericError {
    /**
     * @param {class}  type
     * @param {any}    value
     */
    constructor(type: class, value: any);
}
import GenericError from "./generic.js";
