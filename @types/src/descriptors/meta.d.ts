/**
 * @template T
 * @callback Getter
 *
 * @param    {Object}  data
 * @param    {object}  data.target  Object on which the property's value changed.
 * @param    {string}  data.key     The key of the property.
 * @param    {new T}   data.type    The type <T> of the property.
 *
 * @returns  {T}       A value which is an instance of type <T>.
 */
/**
 * @template T
 * @callback Setter
 *
 * @param    {Object}  data
 * @param    {object}  data.target  Object on which the property's value changed.
 * @param    {string}  data.key     The key of the property.
 * @param    {new T}   data.type    The type <T> of the property.
 * @param    {T}       data.from    The previous value of the property.
 * @param    {T}       data.to      The new value of the property.
 *
 * @returns  {T}       Pass or override { to: type } value back from function.
 */
/**
 * @template T
 * @callback OnChange
 *
 * @param    {object} data
 * @param    {object} data.target  Object on which the property's value changed.
 * @param    {string} data.key     The key of the property.
 * @param    {new T}  data.type    The type <T> of the property.
 * @param    {T}      data.from    The previous value of the property.
 * @param    {T}      data.to      The new value of the property.
 *
 * @returns  {void}
 */
/**
 * @template T
 * @class    MetaDescriptor
 * @extends  Broadcaster<OnChange<T>>
 */
export default class MetaDescriptor<T> extends Broadcaster<OnChange<T>> {
    /**
     * @param    {new => T}     type
     * @param    {Getter<T>}    get
     * @param    {Setter<T>}    set
     * @param    {OnChange<T>}  [onchange]
     */
    constructor(type: new () => T, get: Getter<T>, set: Setter<T>, onchange?: OnChange<T> | undefined);
    /** @type {string} Key of the property. */
    key: string;
    /** @type {new T} A class or function which returns a type. */
    type: new () => T;
    /** @type {Getter<T>} Function which returns a value of type <T>. */
    get: Getter<T>;
    /** @type {Setter<T>} Function which sets value: T on property. */
    set: Setter<T>;
    /** @type {T} The value of the property */
    value: T;
    is_nullable: boolean;
    is_required: boolean;
    is_private: boolean;
    /**
     * Sets the property to be nullable.
     * @returns {MetaDescriptor<T>}  this
     */
    get nullable(): MetaDescriptor<T>;
    /**
     * Sets the property to be required upon object instantiation.
     * @returns {MetaDescriptor<T>}  this
     */
    get required(): MetaDescriptor<T>;
    /**
     * Determines whether the property is enumerable (public) or not (private)
     * @returns {MetaDescriptor<T>}  this
     */
    get private(): MetaDescriptor<T>;
    /**
     * Assign a default/existing value to the property.
     * @param   {T}  value  Instance of this descriptor's set type <T>
     * @returns {MetaDescriptor<T>}  this
     */
    assign(value: T): MetaDescriptor<T>;
    /**
     * Parse and mofify the given key and associate it with the property.
     * Also modfifies property depending on what decorations (eg. *, ?, _)
     * that the key has before being parsed and modified.
     *
     * MUST run before init.
     *
     * @param   {string}  key  The key of this property.
     * @returns {MetaDescriptor<T>}  this
     */
    parse(key: string): MetaDescriptor<T>;
    /**
     * Create the TRUE typed-descriptor to be attached to an object instance.
     *
     * @param    {string}  [key]  Only pass key if .parse() has yet to run.
     * @returns  {TypedAccessor<T>}  The propety descriptor for an object.
     */
    init(key?: string | undefined): TypedAccessor<T>;
}
export type Getter<T> = (data: {
    target: object;
    key: string;
    type: new () => T;
}) => T;
export type Setter<T> = (data: {
    target: object;
    key: string;
    type: new () => T;
    from: T;
    to: T;
}) => T;
export type OnChange<T> = (data: {
    target: object;
    key: string;
    type: new () => T;
    from: T;
    to: T;
}) => void;
import { Broadcaster } from "../types/broadcaster.js";
import TypedAccessor from "./typed.js";
