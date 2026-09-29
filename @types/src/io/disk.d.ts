export function open(path: string | URL): Promise<string>;
export function watch(path: string, onchange: (date_modified_ms: number) => void): void;
export function save(path: string, contents: any): void;
export function list(path: any): string[];
