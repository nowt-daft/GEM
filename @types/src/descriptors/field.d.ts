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
 * @returns  {T}      Pass or override { to: type } value back from function.
 */
/**
 * @template T
 * @class    Field
 * @extends  MetaDescriptor<T>
 */
export class Field<T> extends MetaDescriptor<T> {
    /**
     * Create a field from a given type.
     *
     * @param    {new => T}  type
     * @returns  {Field<T>}  this
     */
    static type(type: new () => T): Field<T>;
    /**
     * Create a field by inferring type from a given value.
     *
     * @param    {T}         value
     * @returns  {Field<T>}  this
     */
    static from(value: T): Field<T>;
    /**
     * Create a required Field from a given type.
     *
     * @param    {new => T}  type
     * @returns  {Field<T>}  this
     */
    static required(type: new () => T): Field<T>;
    /**
     * Create a private Field from a given type.
     *
     * @param    {new => T}  type
     * @returns  {Field<T>}  this
     */
    static private(): Field<T>;
    /**
     * @param  {new => T}     type
     * @param  {OnChange<T>}  onchange
     */
    constructor(type: new () => T, onchange: OnChange<T>);
}
declare function _default<T>(type: new () => T): Field<T>;
export default _default;
export type OnChange<T_1> = (data: {
    target: object;
    key: string;
    type: new () => T_1;
    from: T_1;
    to: T_1;
}) => T_1;
import MetaDescriptor from "./meta.js";
