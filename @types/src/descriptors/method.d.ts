/**
 * @function  Method
 * @param     {string}                  name
 * @param     {object}                  definition
 * @param     {string}                  definition.description
 * @param     {string}                  definition.example
 * @param     {Record<string,new => *}  definition.params
 * @param     {Function}                definition.method
 * @param     {new => *}                definition.returns
 * @param     {boolean}                 [ignore_return_check]
 * @returns   {Function}
 */
export default function Method(name: string, { description, example, params, method, returns }: {
    description: string;
    example: string;
    params: Record<string, new () => any>;
    method: Function;
    returns: new () => any;
}, ignore_return_check?: boolean | undefined): Function;
