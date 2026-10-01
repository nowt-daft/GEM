declare const _default: {
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
    (name: string | import("../gem.js").Name, parents: (new () => any)[], definition: object): new () => any;
    /**
     * @overload
     * @param    {string|Name}  name  Name for the constructor to have
     * @param    {object}       definition  Properties, methods, listeners, etc.
     * @returns  {new *}  Defined constructor/class.
     */
    (name: string | import("../gem.js").Name, definition: object): new () => any;
    /**
     * @overload
     * @param    {string|Name}  name  Name for the constructor to have
     * @param    {(new *)[]}    parents Any parent types to extend/inherit.
     * @returns  {new *}  Defined constructor/class.
     */
    (name: string | import("../gem.js").Name, parents: (new () => any)[]): new () => any;
    /**
     * @overload
     * @param    {(new *)[]}  parents Any parent types to extend/inherit.
     * @param    {object}     definition  Properties, methods, listeners, etc.
     * @returns  {new *}  Defined constructor/class.
     */
    (parents: (new () => any)[], definition: object): new () => any;
    /**
     * @overload
     * @param    {(new *)[]}  parents Any parent types to extend/inherit.
     * @returns  {new *}  Defined constructor/class.
     */
    (parents: (new () => any)[]): new () => any;
    /**
     * @overload
     * @param    {object}  definition  Properties, methods, listeners, etc.
     * @returns  {new *}  Defined constructor/class.
     */
    (definition: object): new () => any;
    /**
     * @overload
     * @returns  {new *}  Generic Constructor/class.
     */
    (): new () => any;
};
export default _default;
