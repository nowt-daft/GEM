/**
 * @template T
 */
export default class StateChangeEvent<T> extends GenericEvent {
    /**
     * @param {string}      name
     * @param {HTMLElement} target
     * @param {string}      key
     * @param {new => T}    type
     * @param {T}           from
     * @param {T}           to
     */
    constructor(name: string, key: string, type: new () => T, from: T, to: T);
    /** @type {string} */
    key: string;
    /** @type {T} */
    from: T;
    /** @type {T} */
    to: T;
    /** @type {new => T} */
    class: new () => T;
}
import GenericEvent from "./generic.js";
