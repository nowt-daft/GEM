export default class Int extends Number {
    static expression: RegExp;
    static defines(num: any): boolean;
    static parse(string: any): number;
    constructor(...args: any[]);
}
