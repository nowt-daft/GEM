/**
 * @template T
 * @callback AttributeChange
 *
 * @param    {object}   data
 * @param    {object}   data.target  Object on which the property's value changed.
 * @param    {string}   data.key     The key of the property.
 * @param    {new => T} data.type    The type <T> of the property.
 * @param    {T}        data.from    The previous value of the property.
 * @param    {T}        data.to      The new value of the property.
 *
 * @returns  {T}        Pass or override { to: type } value back from function.
 */
/**
 * @template T
 * @class Attribute
 * @extends MetaDescriptor<T>
 */
export class Attribute<T> extends MetaDescriptor<T> {
    /**
     * @param  {class}              type
     * @param  {AttributeChange<T>} [onchange]
     */
    constructor(type: class, onchange?: AttributeChange<T> | undefined);
}
declare function _default<T>(type: new () => T, onchange: AttributeChange<T>): Attribute<T>;
export default _default;
export type AttributeChange<T_1> = (data: {
    target: object;
    key: string;
    type: new () => T_1;
    from: T_1;
    to: T_1;
}) => T_1;
import MetaDescriptor from "../meta.js";
