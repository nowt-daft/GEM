/**
 * @template T
 * @param    {new T}    type
 * @param    {Gett<T>}  getter
 * @returns  {MetaDescriptor<T>}
 */
export default function Getter<T>(type: new () => T, getter: Gett<T>): MetaDescriptor<T>;
/**
 * @template T
 * @callback Gett
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
 * @class GetDescriptor extends MetaDescriptor<T>
 */
export class GetDescriptor<T> extends MetaDescriptor<any> {
    /**
     * @param    {new T}    type
     * @param    {Gett<T>}  getter
     */
    constructor(type: new () => T, getter: Gett<T>);
}
export type Gett<T> = (data: {
    target: object;
    key: string;
    type: new () => T;
}) => T;
import MetaDescriptor from "./meta.js";
