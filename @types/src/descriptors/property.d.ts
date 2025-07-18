/**
 * @template T
 */
export default class Property<T> extends Descriptor {
    /**
     * @param   {T}        value
     * @param   {boolean}  enumerable
     * @param   {boolean}  configurable
     *
     * @returns {FixedProperty} Property whose value CANNOT be changed.
     */
    static fixed(value: T, enumerable: boolean, configurable?: boolean): FixedProperty<any>;
    /**
     * @param   {T}        value
     * @param   {boolean}  enumerable
     * @param   {boolean}  configurable
     *
     * @returns {VariableProperty} Property whose value is rewritable.
     */
    static variable(value: T, enumerable: boolean, configurable?: boolean): VariableProperty<any>;
    /**
     * @param  {T}        value  The value the property has
     * @param  {boolean}  writable
     * @param  {boolean}  enumerable
     * @param  {boolean}  configurable
     */
    constructor(value: T, writable: boolean, enumerable: boolean, configurable?: boolean);
    /** @type {boolean} */
    writable: boolean;
    /** @type {T} */
    value: T;
}
/**
 * @template T
 * @extends Property<T>
 */
export class FixedProperty<T> extends Property<T> {
    /**
     * @param  {T}        value
     * @param  {boolean}  enumerable
     * @param  {boolean}  configurable
     *
     */
    constructor(value: T, enumerable: boolean, configurable?: boolean);
}
/**
 * @template T
 * @extends Property<T>
 */
export class VariableProperty<T> extends Property<T> {
    /**
     * @param  {T}        value
     * @param  {boolean}  enumerable
     * @param  {boolean}  configurable
     */
    constructor(value: T, enumerable: boolean, configurable?: boolean);
}
import Descriptor from "./descriptor.js";
