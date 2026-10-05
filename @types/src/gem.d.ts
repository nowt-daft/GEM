/**
 * @template T
 *
 * GEMify your existing types!
 * Adds some static properties for:
 *     + validation
 *     + parsing
 *     + serialising
 *     + type-checking
 *     + etc.
 *
 * @param    {T}  type
 * @returns  {T}  Modified class "type"
 */
export function Gemify<T>(type: T): T;
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
export { default as Getter } from "./descriptors/getter.js";
export { default as Field } from "./descriptors/field.js";
/**
 * @mixin STATIC
 */
export const STATIC: {
    expression: RegExp;
    validate: {
        description: string;
        params: {
            str: StringConstructor;
        };
        method(str: any): any;
        returns: BooleanConstructor;
    };
    parse: {
        description: string;
        params: {
            str: StringConstructor;
        };
        method(str: any): any;
        returns: ObjectConstructor;
    };
    stringify: {
        description: string;
        params: {
            instance: ObjectConstructor;
        };
        method(instance: any): string;
        returns: StringConstructor;
    };
    serialise: {
        description: string;
        example: string;
        params: {
            instance: ObjectConstructor;
        };
        method(instance: any): any;
        returns: ObjectConstructor;
    };
    /**
     * @param   {object}   properties
     * @param   {boolean}  enumerable
     * @returns {object}   this
     */
    static(properties: object, enumerable?: boolean): object;
    defines: {
        description: string;
        params: {};
        method(instance: any): boolean;
        returns: BooleanConstructor;
    };
    /**
     * Metaprogramming -> hooks into "instanceof" keyword
     * @example
     * 43 instanceof Number
     *
     * @returns  {boolean}
     */
    [Symbol.hasInstance](instance: any): boolean;
};
export class Constructor {
    /**
     * @param    {string}  name  Name for the object constructor.
     * @returns  {new *}   Constructor for building objects.
     */
    static Object(name: string): new () => any;
    /**
     * @param    {string}  name  Name for the class to have.
     * @returns  {new *}   Class for building objects.
     */
    static Class(name: string): new () => any;
    /**
     * @param    {new *}   base   Base class to directly extend.
     * @param    {string}  name   Name for the child class to have.
     * @returns  {new *}  Class for building objects.
     */
    static Extend(base: new () => any, name: string): new () => any;
    /**
     * @param    {string}  name  Name for the abstract to have.
     * @returns  {new *}  The abstract class..
     */
    static Abstract(name: string): new () => any;
}
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
export class Void {
    static defines(instance: any): boolean;
}
export class Any {
    static defines(): boolean;
}
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
 * @param    {string|Name}  name  Name for the constructor to have
 * @param    {(new *)[]}    parents  Any parent types to extend/inherit.
 * @param    {object}       definition  Properties, methods, listeners, etc.
 * @returns  {new *}  Defined constructor/class.
 */
export function List(name: string | Name, parents: (new () => any)[], definition: object): new () => any;
/**
 * @overload
 * @param    {string|Name}  name  Name for the constructor to have
 * @param    {object}       definition  Properties, methods, listeners, etc.
 * @returns  {new *}  Defined constructor/class.
 */
export function List(name: string | Name, definition: object): new () => any;
/**
 * @overload
 * @param    {string|Name}  name  Name for the constructor to have
 * @param    {(new *)[]}    parents Any parent types to extend/inherit.
 * @returns  {new *}  Defined constructor/class.
 */
export function List(name: string | Name, parents: (new () => any)[]): new () => any;
/**
 * @overload
 * @param    {(new *)[]}  parents Any parent types to extend/inherit.
 * @param    {object}     definition  Properties, methods, listeners, etc.
 * @returns  {new *}  Defined constructor/class.
 */
export function List(parents: (new () => any)[], definition: object): new () => any;
/**
 * @overload
 * @param    {(new *)[]}  parents Any parent types to extend/inherit.
 * @returns  {new *}  Defined constructor/class.
 */
export function List(parents: (new () => any)[]): new () => any;
/**
 * @overload
 * @param    {object}  definition  Properties, methods, listeners, etc.
 * @returns  {new *}  Defined constructor/class.
 */
export function List(definition: object): new () => any;
/**
 * @overload
 * @returns  {new *}  Generic Constructor/class.
 */
export function List(): new () => any;
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
 * @param    {string|Name}  name  Name for the constructor to have
 * @param    {(new *)[]}    parents  Any parent types to extend/inherit.
 * @param    {object}       definition  Properties, methods, listeners, etc.
 * @returns  {new *}  Defined constructor/class.
 */
export function Either(name: string | Name, parents: (new () => any)[], definition: object): new () => any;
/**
 * @overload
 * @param    {string|Name}  name  Name for the constructor to have
 * @param    {object}       definition  Properties, methods, listeners, etc.
 * @returns  {new *}  Defined constructor/class.
 */
export function Either(name: string | Name, definition: object): new () => any;
/**
 * @overload
 * @param    {string|Name}  name  Name for the constructor to have
 * @param    {(new *)[]}    parents Any parent types to extend/inherit.
 * @returns  {new *}  Defined constructor/class.
 */
export function Either(name: string | Name, parents: (new () => any)[]): new () => any;
/**
 * @overload
 * @param    {(new *)[]}  parents Any parent types to extend/inherit.
 * @param    {object}     definition  Properties, methods, listeners, etc.
 * @returns  {new *}  Defined constructor/class.
 */
export function Either(parents: (new () => any)[], definition: object): new () => any;
/**
 * @overload
 * @param    {(new *)[]}  parents Any parent types to extend/inherit.
 * @returns  {new *}  Defined constructor/class.
 */
export function Either(parents: (new () => any)[]): new () => any;
/**
 * @overload
 * @param    {object}  definition  Properties, methods, listeners, etc.
 * @returns  {new *}  Defined constructor/class.
 */
export function Either(definition: object): new () => any;
/**
 * @overload
 * @returns  {new *}  Generic Constructor/class.
 */
export function Either(): new () => any;
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
 * @param    {string|Name}  name  Name for the constructor to have
 * @param    {(new *)[]}    parents  Any parent types to extend/inherit.
 * @param    {object}       definition  Properties, methods, listeners, etc.
 * @returns  {new *}  Defined constructor/class.
 */
export function Tuple(name: string | Name, parents: (new () => any)[], definition: object): new () => any;
/**
 * @overload
 * @param    {string|Name}  name  Name for the constructor to have
 * @param    {object}       definition  Properties, methods, listeners, etc.
 * @returns  {new *}  Defined constructor/class.
 */
export function Tuple(name: string | Name, definition: object): new () => any;
/**
 * @overload
 * @param    {string|Name}  name  Name for the constructor to have
 * @param    {(new *)[]}    parents Any parent types to extend/inherit.
 * @returns  {new *}  Defined constructor/class.
 */
export function Tuple(name: string | Name, parents: (new () => any)[]): new () => any;
/**
 * @overload
 * @param    {(new *)[]}  parents Any parent types to extend/inherit.
 * @param    {object}     definition  Properties, methods, listeners, etc.
 * @returns  {new *}  Defined constructor/class.
 */
export function Tuple(parents: (new () => any)[], definition: object): new () => any;
/**
 * @overload
 * @param    {(new *)[]}  parents Any parent types to extend/inherit.
 * @returns  {new *}  Defined constructor/class.
 */
export function Tuple(parents: (new () => any)[]): new () => any;
/**
 * @overload
 * @param    {object}  definition  Properties, methods, listeners, etc.
 * @returns  {new *}  Defined constructor/class.
 */
export function Tuple(definition: object): new () => any;
/**
 * @overload
 * @returns  {new *}  Generic Constructor/class.
 */
export function Tuple(): new () => any;
export function Options(...values: any[]): {
    new (): {};
    defines(instance: any): boolean;
};
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
 * @param    {string|Name}  name  Name for the constructor to have
 * @param    {(new *)[]}    parents  Any parent types to extend/inherit.
 * @param    {object}       definition  Properties, methods, listeners, etc.
 * @returns  {new *}  Defined constructor/class.
 */
export function Scalar(name: string | Name, parents: (new () => any)[], definition: object): new () => any;
/**
 * @overload
 * @param    {string|Name}  name  Name for the constructor to have
 * @param    {object}       definition  Properties, methods, listeners, etc.
 * @returns  {new *}  Defined constructor/class.
 */
export function Scalar(name: string | Name, definition: object): new () => any;
/**
 * @overload
 * @param    {string|Name}  name  Name for the constructor to have
 * @param    {(new *)[]}    parents Any parent types to extend/inherit.
 * @returns  {new *}  Defined constructor/class.
 */
export function Scalar(name: string | Name, parents: (new () => any)[]): new () => any;
/**
 * @overload
 * @param    {(new *)[]}  parents Any parent types to extend/inherit.
 * @param    {object}     definition  Properties, methods, listeners, etc.
 * @returns  {new *}  Defined constructor/class.
 */
export function Scalar(parents: (new () => any)[], definition: object): new () => any;
/**
 * @overload
 * @param    {(new *)[]}  parents Any parent types to extend/inherit.
 * @returns  {new *}  Defined constructor/class.
 */
export function Scalar(parents: (new () => any)[]): new () => any;
/**
 * @overload
 * @param    {object}  definition  Properties, methods, listeners, etc.
 * @returns  {new *}  Defined constructor/class.
 */
export function Scalar(definition: object): new () => any;
/**
 * @overload
 * @returns  {new *}  Generic Constructor/class.
 */
export function Scalar(): new () => any;
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
 * @param    {string|Name}  name  Name for the constructor to have
 * @param    {(new *)[]}    parents  Any parent types to extend/inherit.
 * @param    {object}       definition  Properties, methods, listeners, etc.
 * @returns  {new *}  Defined constructor/class.
 */
export function Vector(name: string | Name, parents: (new () => any)[], definition: object): new () => any;
/**
 * @overload
 * @param    {string|Name}  name  Name for the constructor to have
 * @param    {object}       definition  Properties, methods, listeners, etc.
 * @returns  {new *}  Defined constructor/class.
 */
export function Vector(name: string | Name, definition: object): new () => any;
/**
 * @overload
 * @param    {string|Name}  name  Name for the constructor to have
 * @param    {(new *)[]}    parents Any parent types to extend/inherit.
 * @returns  {new *}  Defined constructor/class.
 */
export function Vector(name: string | Name, parents: (new () => any)[]): new () => any;
/**
 * @overload
 * @param    {(new *)[]}  parents Any parent types to extend/inherit.
 * @param    {object}     definition  Properties, methods, listeners, etc.
 * @returns  {new *}  Defined constructor/class.
 */
export function Vector(parents: (new () => any)[], definition: object): new () => any;
/**
 * @overload
 * @param    {(new *)[]}  parents Any parent types to extend/inherit.
 * @returns  {new *}  Defined constructor/class.
 */
export function Vector(parents: (new () => any)[]): new () => any;
/**
 * @overload
 * @param    {object}  definition  Properties, methods, listeners, etc.
 * @returns  {new *}  Defined constructor/class.
 */
export function Vector(definition: object): new () => any;
/**
 * @overload
 * @returns  {new *}  Generic Constructor/class.
 */
export function Vector(): new () => any;
export type ConstructorFormatter = (name: string, descriptor: ClassDescriptor) => new () => any;
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
 * @param    {string|Name}  name  Name for the constructor to have
 * @param    {(new *)[]}    parents  Any parent types to extend/inherit.
 * @param    {object}       definition  Properties, methods, listeners, etc.
 * @returns  {new *}  Defined constructor/class.
 */
declare function TypeConstructor(name: string | Name, parents: (new () => any)[], definition: object): new () => any;
/**
 * @overload
 * @param    {string|Name}  name  Name for the constructor to have
 * @param    {object}       definition  Properties, methods, listeners, etc.
 * @returns  {new *}  Defined constructor/class.
 */
declare function TypeConstructor(name: string | Name, definition: object): new () => any;
/**
 * @overload
 * @param    {string|Name}  name  Name for the constructor to have
 * @param    {(new *)[]}    parents Any parent types to extend/inherit.
 * @returns  {new *}  Defined constructor/class.
 */
declare function TypeConstructor(name: string | Name, parents: (new () => any)[]): new () => any;
/**
 * @overload
 * @param    {(new *)[]}  parents Any parent types to extend/inherit.
 * @param    {object}     definition  Properties, methods, listeners, etc.
 * @returns  {new *}  Defined constructor/class.
 */
declare function TypeConstructor(parents: (new () => any)[], definition: object): new () => any;
/**
 * @overload
 * @param    {(new *)[]}  parents Any parent types to extend/inherit.
 * @returns  {new *}  Defined constructor/class.
 */
declare function TypeConstructor(parents: (new () => any)[]): new () => any;
/**
 * @overload
 * @param    {object}  definition  Properties, methods, listeners, etc.
 * @returns  {new *}  Defined constructor/class.
 */
declare function TypeConstructor(definition: object): new () => any;
/**
 * @overload
 * @returns  {new *}  Generic Constructor/class.
 */
declare function TypeConstructor(): new () => any;
import ClassDescriptor from "./descriptors/class.js";
