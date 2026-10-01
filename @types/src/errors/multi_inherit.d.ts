/**
 * @template T
 */
export default class MultiInheritError<T> extends GenericError {
    /**
     * @param  {new T}  type
     * @param  {(new *)[]}  parents
     * @param  {any[]}  arg_collection
     */
    constructor(type: new () => T, parents: (new () => any)[], arg_collection: any[]);
}
import GenericError from "./generic.js";
