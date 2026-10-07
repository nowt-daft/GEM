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
