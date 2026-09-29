declare const _default: (StringConstructor[] | (NumberConstructor | {
    expression: RegExp;
    parse(string: any): number;
})[] | (BooleanConstructor | {
    expression: RegExp;
    parse(string: any): boolean;
})[] | (BigIntConstructor | {
    expression: RegExp;
    parse(string: any): bigint;
    stringify(bigint: any): string;
})[] | (FunctionConstructor | {
    parse(string: any): any;
    stringify(func: any): any;
})[] | (ObjectConstructor | {
    parse(string: any): any;
    stringify(object: any): string;
})[] | (ArrayConstructor | {
    parse(string: any): any;
    stringify(array: any): string;
})[] | (DateConstructor | {
    expression: RegExp;
    parse(string: any): Date;
    stringify(date: any): string;
    serialise(date: any): any;
})[] | (SetConstructor | {
    parse(string: any): Set<any>;
    stringify(set: any): string;
    serialise(set: any): any[];
})[] | (MapConstructor | {
    parse(string: any): Map<any, any>;
    stringify(map: any): string;
    serialise(map: any): any[];
})[])[];
export default _default;
