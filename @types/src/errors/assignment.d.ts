export default class AssignmentError extends GenericError {
    /**
     * @param {class} type
     * @param {string|symbol} key
     * @param {any} value
     * @param {class} property_type
     * @param {boolean} required
     * @param {boolean} nullable
     */
    constructor(type: class, key: string | symbol, value: any, property_type: class, required: boolean, nullable: boolean);
}
import GenericError from "./generic.js";
