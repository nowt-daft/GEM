/**
 * @function  Method
 * @param     {string}                  name
 * @param     {object}                  definition
 * @param     {Record<string,new => *}  definition.params
 * @param     {Function}                definition.method
 * @param     {new => *}                definition.returns
 * @returns   {Function}
 */
export default function Method(name: string, { params, method, returns }: {
    params: Record<string, new () => any>;
    method: Function;
    returns: new () => any;
}): Function;
