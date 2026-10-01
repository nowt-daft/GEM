/**
 * @template T
 * @callback Parser
 * @param   {string}  str
 * @returns {T}       value of type <T> parsed from str: string.
 */
/**
 * @template T
 * @callback Stringify
 * @param   {T}  instance
 * @returns {string}
 */
/**
 * @template T
 * @class    Variable
 * @extends  MetaDescriptor<T>
 */
export class Variable<T> extends MetaDescriptor<T> {
    /**
     * Create a var from a given type.
     *
     * @param    {new => T}  type
     * @returns  {Variable<T>}  this
     */
    static type(type: new () => T): Variable<T>;
    /**
     * Create a var by inferring type from a given value.
     *
     * @param    {T}  value
     * @returns  {Variable<T>}  this
     */
    static from(value: T): Variable<T>;
    /**
     * Create a required var from a given type.
     *
     * @param    {new => T}  type
     * @returns  {Variable<T>}  this
     */
    static required(type: new () => T): Variable<T>;
    /**
     * @param {new => T}     type
     * @param {Parser<T>}    parse
     * @param {Stringify<T>} stringify
     */
    constructor(type: new () => T, parse?: Parser<T>, stringify?: Stringify<T>);
}
declare function _default<T>(type: new () => T, parse?: Parser<T>, stringify?: Stringify<T>): Var<T>;
export default _default;
export type Parser<T_1> = (str: string) => T_1;
export type Stringify<T_1> = (instance: T_1) => string;
import MetaDescriptor from "../meta.js";
