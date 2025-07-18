declare const _default: {
    /**
     * @param    {any}      value
     * @returns  {boolean}  Returns true if NOT undefined AND NOT null.
     */
    defined(value: any): boolean;
    /**
     * @param    {any}      num
     * @returns  {boolean}  Returns true if argument is an integer.
     */
    integer(num: any): boolean;
    /**
     * @param    {any}      value
     * @returns  {boolean}  Value must not be an object nor a function.
     */
    literal(value: any): boolean;
    /**
     * @param    {any}      obj
     * @returns  {boolean}  Does the argument descend DIRECTLY from Object?
     */
    object_literal(obj: any): boolean;
    /**
     * @param    {any}      rry
     * @returns  {boolean}  Argument must descend from Array.
     */
    array(rry: any): boolean;
    /**
     * @example
     * function example(param) {
     *     // source code here...
     * }
     *
     * @param    {function} func
     * @returns  {boolean}  Returns true if function uses the "function" keyword.
     */
    function_literal(func: Function): boolean;
    /**
     * @example
     * const example = x => x ** x;
     *
     * @param    {function} func
     * @returns  {boolean}  Returns true if function is an arrow function.
     */
    lamda(func: Function): boolean;
    /**
     * @example
     * const object = {
     *     some_method() {
     *       // method source code here...
     *     }
     * };
     *
     * @returns  {function} func
     * @returns  {boolean}  Returns true if function exists on an Object as a method.
     */
    method(func: any): Function;
    /**
     * @param    {class|function} type
     * @returns  {boolean}  Type can be a function or a class.
     */
    constructable(type: class | Function): boolean;
    /**
     * @param    {class}    type
     * @returns  {boolean}  Type is a class and not just a function.
     */
    class(type: class): boolean;
    /**
     * Check if type1 is the same type or a derivative type of type2.  In other
     * words, is type2 the same or a parent type of type1.
     *
     * @param    {function}  type1
     * @param    {function}  type2
     * @returns  {boolean}   Is type1 the same as type2 or a child of type2
     */
    type(type1: Function, type2: Function): boolean;
    /**
     * @param    {any}       value  Value to check
     * @param    {function}  type   Expected type of value
     * @returns  {boolean}   Is value of type?
     */
    of_type(value: any, type: Function): boolean;
    /**
     * @param    {any}     that
     * @returns  {boolean} Is argument the global object (eg. window)
     */
    global(that: any): boolean;
    /**
     * @param    {any}      value
     * @returns  {boolean}  True if function. False otherwise.
     */
    function(value: any): boolean;
    /**
     * @param    {any}      value
     * @returns  {boolean}  True if string. False otherwise.
     */
    string(value: any): boolean;
    /**
     * @param    {any}      value
     * @returns  {boolean}  True if boolean. False otherwise.
     */
    boolean(value: any): boolean;
    /**
     * @param    {any}      value
     * @returns  {boolean}  True if number. False otherwise.
     */
    number(value: any): boolean;
    /**
     * @param    {any}      value
     * @returns  {boolean}  True if symbol. False otherwise.
     */
    symbol(value: any): boolean;
    /**
     * @param    {any}      value
     * @returns  {boolean}  True if bigint. False otherwise.
     */
    bigint(value: any): boolean;
    /**
     * @param    {any}      value
     * @returns  {boolean}  True if undefined. If null, returns false.
     */
    undefined(value: any): boolean;
    /**
     * @param    {any}      value
     * @returns  {boolean}  True if null. If undefined, returns false.
     */
    null(value: any): boolean;
    /**
     * @param    {any}      value
     * @returns  {boolean}  Anything that inherits from Object that is not null.
     */
    object(value: any): boolean;
};
export default _default;
