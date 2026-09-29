export function create(tag: string, attributes?: Record<string, any>, dataset?: Record<string, string>): HTMLElement;
/**
 * @callback DefineComponent
 *
 * @param {string}              tag        HTML tag
 * @param {class[]}             parents    Parent classes
 * @param {Record<string,any>} definition
 *
 * @returns {HTMLComponent}
 */
/** @type {DefineComponent} */
export const Component: DefineComponent;
export type HTMLListener = (: Event) => any;
export type DefineComponent = (tag: string, parents: class[], definition: Record<string, any>) => HTMLComponent;
