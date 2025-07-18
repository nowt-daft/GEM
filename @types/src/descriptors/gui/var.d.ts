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
 * @class Var
 * @extends MetaDescriptor<T>
 */
export class Var<T> extends MetaDescriptor<T> {
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
