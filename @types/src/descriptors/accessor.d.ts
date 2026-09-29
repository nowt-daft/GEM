/**
 * @callback DescriptorGetter
 * @returns  {any} Value for the property to return.
 */
/**
 * @callback DescriptorSetter
 * @param    {any|void} value Value being assigned to the property.
 * @returns  {any|void} Inconsequential but returning passed value is good practice.
 */
/**
 * @callback Getter
 * @param   {object} data
 * @param   {object} data.target Instance to which property descriptor is attached.
 * @param   {string|symbol} data.key Key where property exists.
 * @returns {any} Whatever value you wish the getter to return.
 */
/**
 * @callback Setter
 * @param   {object} data
 * @param   {object} data.target Instance to which property descriptor is attached.
 * @param   {string|symbol} data.key Key where property exists.
 * @param   {any} data.to Value being assigned to the property.
 * @param   {any} data.from Previous value of the property.
 * @returns {any|void} Inconsequential but returning passed value is good practice.
 */
export default class Accessor extends Descriptor {
    /**
     * @param    {Getter}   get
     * @param    {boolean}  enumerable
     *
     * @returns  {Get}  Getter Accessor Descriptor object
     */
    static Get(get: Getter, enumerable?: boolean): Get;
    /**
     * A Getter which caches the value returned by the Getter callback.
     * Useful for mutable objects (ie. HTMLNodeList, CSSStyleDeclaration, etc.)
     *
     * @param    {Getter}  get
     * @returns  {Get}  Getter Descriptor object.
     */
    static Cache(get: Getter): Get;
    /**
     * @param    {Getter}  get
     * @param    {Setter}  set
     * @param    {boolean} enumerable
     *
     * @returns  {Get}  Getter Accessor Descriptor object
     */
    static GetSet(get: Getter, set: Setter, enumerable?: boolean): Get;
    /**
     * @param  {object}  descriptor  Get/Set Object
     * @param      {DescriptorGetter}  descriptor.get
     * @param      {DescriptorSetter}  [descriptor.set]
     * @param  {boolean}  enumerable
     */
    constructor(descriptor: {
        get: DescriptorGetter;
        set?: DescriptorSetter | undefined;
    }, enumerable?: boolean);
    /** @type {DescriptorGetter} */
    get: DescriptorGetter;
    /** @type {DescriptorSetter} */
    set: DescriptorSetter;
}
export class Get extends Accessor {
    /**
     * @param  {string|symbol}  key
     * @param  {Getter}         get
     * @param  {boolean}        enumerable
     */
    constructor(key: string | symbol, get: Getter, enumerable?: boolean);
}
export class GetSet extends Accessor {
    /**
     * @param  {string}  key
     * @param  {Getter}  get
     * @param  {Setter}  set
     *
     * @param  {boolean} enumerable
     */
    constructor(key: string, get: Getter, set: Setter, enumerable?: boolean);
}
export type DescriptorGetter = () => any;
export type DescriptorSetter = (value: any | void) => any | void;
export type Getter = (data: {
    target: object;
    key: string | symbol;
}) => any;
export type Setter = (data: {
    target: object;
    key: string | symbol;
    to: any;
    from: any;
}) => any | void;
import Descriptor from "./descriptor.js";
