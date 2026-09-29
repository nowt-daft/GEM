/**
 * @callback Selector
 * @param    {Entry}    entry
 * @param    {number}   index
 * @param    {Entry[]}  entries
 * @returns  {any}
 */
/**
 * @callback Where
 * @param    {Entry}    entry
 * @param    {number}   index
 * @param    {Entry[]}  entries
 * @returns  {boolean}
 */
export default class Query {
    /**
     * @param    {UInt}    id
     * @param    {string}  name
     * @returns  {Where}
     */
    static by_id(id: UInt, name?: string): Where;
    /**
     * @param    {UInt[]}  ids
     * @param    {string}  name
     * @returns  {Where}
     */
    static by_ids(ids: UInt[], name?: string): Where;
    /**
     * @param    {string}  name
     * @param    {any}     value
     * @returns  {Where}
     */
    static by_value(name: string, value: any): Where;
    /**
     * @param    {Record<string,any>}  values
     * @returns  {Where}
     */
    static by_values(values: Record<string, any>): Where;
    /**
     * @param  {Object}          param0
     * @param  {Selector}        param0.select
     * @param  {Where}           param0.where
     * @param  {string|string[]} param0.order_by
     * @param  {boolean}         param0.descending
     * @param  {UInt}            param0.skip
     * @param  {UInt}            param0.take
     */
    constructor({ select, where, order_by, descending, skip, take }?: {
        select: Selector;
        where: Where;
        order_by: string | string[];
        descending: boolean;
        skip: UInt;
        take: UInt;
    });
    /** @type {Selector} */
    select: Selector;
    /** @type {Where} */
    where: Where;
    /** @type {string|string[]} */
    order_by: string | string[];
    /** @type {boolean} */
    descending: boolean;
    /** @type {UInt} */
    skip: UInt;
    /** @type {UInt} */
    take: UInt;
    /**
     * Run the query on a set of entries.
     *
     * @param    {Entry[]}  items
     * @returns  {Entry[]}
     */
    run(items?: Entry[]): Entry[];
}
export type Selector = (entry: Entry, index: number, entries: Entry[]) => any;
export type Where = (entry: Entry, index: number, entries: Entry[]) => boolean;
import UInt from "../number/uint.js";
import Entry from "./entry.js";
