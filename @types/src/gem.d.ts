/**
 * A factory for producing Meta-Types/Super-Classes (types of types)
 *
 * @function MetaType
 *
 * @param   {string}                meta_name
 * @param   {ConstructorFormatter}  constructor_format
 * @param   {object}                statics
 *
 * @returns {TypeConstructor}  Type Constuctor --> a CLASS that constructs TYPES.
 */
export function MetaType(meta_name: string, constructor_format: ConstructorFormatter, statics?: object): typeof TypeConstructor;
export { default as Field } from "./descriptors/field.js";
/**
 * @mixin
 */
export const STATIC: {
    expression: RegExp;
    /**
     * @param    {string}  string
     * @returns  {boolean}
     */
    validate(string: string): boolean;
    /**
     * @param    {string}  string
     * @returns  {object}  Constructed instance of type based-on string
     */
    parse(string: string): object;
    /**
     * @param    {object}  instance
     * @returns  {string}  string representation of the instance
     */
    stringify(instance: object): string;
    /**
     * How do we serialise the instance into JSON? By default,
     * We leave it untouched.
     *
     * @param   {object}  instance
     * @returns {any}
     */
    serialise(instance: object): any;
    /**
     * @param   {object}   properties
     * @param   {boolean}  enumerable
     * @returns {object}   this
     */
    static(properties: object, enumerable?: boolean): object;
    /**
     * @param    {any}     value
     * @returns  {boolean} Is the value an instance or descendent of this class?
     */
    defines(value: any): boolean;
    /**
     * Metaprogramming -> hooks into "instanceof" keyword
     * @example
     * 43 instanceof Number
     *
     * @returns  {boolean}
     */
    [Symbol.hasInstance](instance: any): boolean;
};
/**
 * Generate a GENERIC Type. Creates a class that can
 * inherit multiple parents via *composition*.
 *
 * @example
 * class C extends Compose(A, B) {
 *     constructor() {
 *         super(
 *             ["args", "for", "class", "A"],
 *             ["other", "args", "for", "class", "B"]
 *         );
 *         // THE REST OF THE CODE GOES HERE...
 *     }
 * }
 * @type {TypeConstructor}
 */
export const Compose: typeof TypeConstructor;
/**
 * Create an Abstract.  Not to be constructed directly but inherited by a
 * child class or defined/exported as a inheritable class.
 *
 * @example
 * export default Abstract(
 *     "IEventDispatcher",
 *     {
 *         listen(listener) {
 *             // ...
 *         },
 *         dispatch(msg) {
 *             // ...
 *         }
 *     }
 * );
 * @type {TypeConstructor}
 */
export const Abstract: typeof TypeConstructor;
/**
 * Create a basic Model type.  a Model Type, once made, can construct
 * instance with or without the NEW keyword.  The constructor, by default,
 * accepts objects to use as a collection of key-value pairs to assign to the
 * object instance.
 *
 * @example
 * const Student = Model(
 *     Person,
 *     Customer,
 *     {
 *         date_enrolled: Date,
 *         classes: Array,
 *         gpa: Number
 *     }
 * );
 *
 * const student = Student({
 *     name: "John Doe",
 *     customer_id: "x7B42AB00C8",
 *     date_enrolled: "2019-09-14", // <- will be parsed by Date
 *     gpa: 3.2
 * });
 * @type {TypeConstructor}
 */
export const Model: typeof TypeConstructor;
/**
 * Generate a Class Type. Directly extends the first parent
 * and then inherits through composition from the rest.
 *
 * @example
 * class C extends Source(
 *     SuperClassA, // <-- inherits DIRECTLY from this class
 *     SuperClassB, // <-- others types to extend.
 *     {
 *         property: 42,
 *         value: Boolean
 *     }
 * ) {
 *     constructor() {
 *         super(...arguments_to_pass_to_A);
 *         this.inherit(SuperClassB, ...args_to_pass_to_b);
 *     }
 *     // ...rest of code here
 * }
 * @type {TypeConstructor}
 */
export const Source: typeof TypeConstructor;
/**
 * Create an Interface to be used for real-time data validation.
 *
 * @example
 * const Person = Interface({
 *     "name*": String,
 *     "age*": Number,
 *     "address?": String
 * });
 *
 * { name: "Jack", age: 32 } instanceof Person // -> TRUE
 * @type {TypeConstructor}
 */
export const Interface: typeof TypeConstructor;
export type ConstructorFormatter = (name: string, descriptor: ClassDescriptor) => class;
export type Name = (descriptor: ClassDescriptor) => string;
/**
 * A Type Factory helps us define Types ad generate them.  This
 * means we can call this as a function and it will return a
 * kind of CONSTRUCTOR (be it a class or otherwise).
 * It can also be extended directly by a class OR called with the
 * NEW keyword to skip the creation of the specific type and straight
 * to the desired instance of the Type.
 *
 * If name is absent, there must be:
 *     at least TWO parents; OR
 *     at least ONE parent and ONE definition; OR
 *     ONE definition.
 * If parents are absent, there must be:
 *     ONE definition.
 *     name is optional.
 * If definition is absent, there must be:
 *     at least TWO parents.
 *
 * @overload
 * @param    {string|Name}    name  Name for the constructor to have
 * @param    {...new object}  parents  Any parent types to extend/inherit.
 * @param    {object}         definition  Properties, methods, listeners, etc.
 * @returns  {class}          Defined constructor/class.
 */
declare function TypeConstructor(name: string | Name, ...parents: (new () => object)[], definition: object): class;
/**
 * @overload
 * @param    {string|Name}    name  Name for the constructor to have
 * @param    {object}         definition  Properties, methods, listeners, etc.
 * @returns  {class}          Defined constructor/class.
 */
declare function TypeConstructor(name: string | Name, definition: object): class;
/**
 * @overload
 * @param    {string|Name}    name  Name for the constructor to have
 * @param    {...new object}  parents Any parent types to extend/inherit.
 * @returns  {class}          Defined constructor/class.
 */
declare function TypeConstructor(name: string | Name, ...parents: (new () => object)[]): class;
/**
 * @overload
 * @param    {...new object}  parents Any parent types to extend/inherit.
 * @param    {object}         definition  Properties, methods, listeners, etc.
 * @returns  {class}          Defined constructor/class.
 */
declare function TypeConstructor(...parents: (new () => object)[], definition: object): class;
/**
 * @overload
 * @param    {...new object}  parents Any parent types to extend/inherit.
 * @returns  {class}          Defined constructor/class.
 */
declare function TypeConstructor(...parents: (new () => object)[]): class;
/**
 * @overload
 * @param    {object}         definition  Properties, methods, listeners, etc.
 * @returns  {class}          Defined constructor/class.
 */
declare function TypeConstructor(definition: object): class;
/**
 * @overload
 * @returns  {class}          Generic Constructor/class.
 */
declare function TypeConstructor(): class;
import ClassDescriptor from "./descriptors/class.js";
