/**
 * @typedef {class} Type
 */
/**
 * @function  Method
 * @param     {string}               name
 * @param     {object}               definition
 * @param     {Record<string,Type>}  [definition.params]
 * @param     {Function}             definition.method
 * @param     {Type}                 [definition.returns=undefined]
 * @returns   {Function}
 */
export default function Method(name: string, { params, method, returns }: {
    params?: Record<string, class> | undefined;
    method: Function;
    returns?: any;
}): Function;
export type Type = class;
