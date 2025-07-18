export default class ReadOnlyError extends GenericError {
    /**
     * @param    {class}  type
     * @param    {string|symbol}  key
     */
    constructor(type: class, key: string | symbol);
}
import GenericError from "./generic.js";
