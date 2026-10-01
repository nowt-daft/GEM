export function create(tag: string, attributes?: Record<string, any>, dataset?: Record<string, string>): HTMLElement;
/**
 * @callback DefineComponent
 *
 * @param {string}              tag        HTML tag
 * @param {(new *)[]}           parents    Parent classes
 * @param {Record<string,any>}  definition
 *
 * @returns {HTMLElement}
 */
/** @type {DefineComponent} */
export const Component: DefineComponent;
export type HTMLListener = (: Event) => any;
export type DefineComponent = (tag: string, parents: (new () => any)[], definition: Record<string, any>) => HTMLElement;
import Attr from './descriptors/gui/attribute.js';
import Var from './descriptors/gui/var.js';
export { Attr, Var };
