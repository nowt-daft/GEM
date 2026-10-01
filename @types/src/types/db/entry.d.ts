declare const Entry_base: new () => any;
export default class Entry extends Entry_base {
    [x: string]: any;
    /**
     * @param  {object}  data  Any object instance will do.
     */
    constructor(data: object);
    /**
     * Like patch in a RESTful API. Pass the data you wish
     * to change.
     *
     * @param    {object}  data  Data to update on the Entry.
     * @returns  {Entry}   this
     */
    update(data: object): Entry;
    /**
     * This method allows Entries to be SOFT COMPARED.
     *
     * @example
     * console.log(entryA == otherEntry);
     * // TRUE if their IDs match and belong to the same "table"/schema
     *
     * console.log(+entry);
     * // This will print the entry's ID.
     *
     * console.log(`${ entry }`);
     * // => "User[43]"
     *
     * @returns  {string}
     */
    valueOf(): string;
    [Symbol.toPrimitive](hint: any): any;
}
export {};
