/**
 * @template T
 * @callback TypedGetter
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
 * @callback TypedSetter
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
 */
export default class TypedAccessor<T> extends GetSet {
    /**
     * @param   {string}         key       Key of the property.
     * @param   {new T}          type      A class or function which returns type <T>.
     *
     * @param   {TypedGetter<T>} get       Function which returns value.
     * @param   {TypedSetter<T>} set       Function which sets a value.
     *
     * @param   {T}              value     Predefined value of type specified earlier.
     * @param   {boolean}        nullable  Is the value nullable?
     * @param   {boolean}        required  Is the value required when constructing?
     *
     * @param   {boolean}        enumerable
     */
    constructor(key: string, type: new () => T, get: TypedGetter<T>, set: TypedSetter<T>, value?: T, nullable?: boolean, required?: boolean, enumerable?: boolean);
}
export type TypedGetter<T> = (data: {
    target: object;
    key: string;
    type: new () => T;
}) => T;
export type TypedSetter<T> = (data: {
    target: object;
    key: string;
    type: new () => T;
    from: T;
    to: T;
}) => T;
import { GetSet } from "./accessor.js";
