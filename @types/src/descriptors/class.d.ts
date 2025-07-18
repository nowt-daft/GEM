export namespace PROTOTYPE {
    /**
     * Method for inheriting from some specific parent by passing this
     * instance and any arguments to the parent's init method.
     *
     * @param    {class}       parent
     * @param    {...*}        args
     * @returns  {typeof this} this
     *
     * @throws   {InheritError}
     */
    export function inherit(parent: class, ...args: any[]): typeof this;
    /**
     * Inherit from all parents at once by passing an Array of arguments
     * which corresponds to each parent of the type, in order.
     *
     * @param    {...any[]}    arg_collection
     * @returns  {typeof this} this
     *
     * @throws   {MultiInheritError}
     */
    function _super(...arg_collection: any[][]): typeof this;
    export { _super as super };
}
export default class ClassDescriptor {
    /**
     * @param    {Dictionary} prescriptor
     * @param    {Parents}    parents
     * @returns  {object[]}
     */
    static sort(prescriptor: Dictionary, parents?: Parents): object[];
    /**
     * @param {...object} prescriptors
     */
    constructor(...prescriptors: object[]);
    /** @type {Parents} */
    parents: Parents;
    /** @type {FieldDescriptors} */
    prescriptor: FieldDescriptors;
    /** @type {Descriptors} */
    properties: Descriptors;
    /** @type {Prototype} */
    prototype: Prototype;
    /** @type {Listeners} */
    listeners: Listeners;
    /** @type {Dictionary} */
    defaults: Dictionary;
}
export type Key = import("./fields.js").Key;
export type Parents = class[];
export type Prototype = Record<Key, Function>;
export type Listeners = Record<Key, Function[]>;
export type FieldDescriptors = import("./fields.js").FieldDescriptors;
export type Descriptors = import("./fields.js").Descriptors;
export type Dictionary = import("./fields.js").Dictionary;
