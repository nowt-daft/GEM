/**
 * @template T
 * @template U
 */
export default class AssignmentError<T, U> extends GenericError {
    /**
     * @param {new T} type
     * @param {string|symbol} key
     * @param {any} value
     * @param {new U} property_type
     * @param {boolean} required
     * @param {boolean} nullable
     */
    constructor(type: new () => T, key: string | symbol, value: any, property_type: new () => U, required: boolean, nullable: boolean);
}
import GenericError from "./generic.js";
