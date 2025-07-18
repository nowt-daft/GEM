/**
 * @template T
 * @class    AttributeEvent
 * @extends  StateChangeEvent<T>
 */
export default class VarEvent<T> extends StateChangeEvent<T> {
    static NAME: string;
    /**
     * @param {string}      key
     * @param {new => T}    type
     * @param {T}           from
     * @param {T}           to
     */
    constructor(key: string, type: new () => T, from: T, to: T);
}
import StateChangeEvent from "./state-change.js";
