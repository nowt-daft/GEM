export function create(tag: string, attributes?: Record<string, any>, dataset?: Record<string, string>): HTMLElement;
/**
 * @callback HTMLListener
 * @param    {Event}
 */
/**
 * @class HTMLComponent
 * @extends HTMLElement
 */
export class HTMLComponent extends HTMLElement {
    /**
     * @param   {Record<string><any>}    attributes
     * @param   {Record<string><string>} dataset
     * @returns {HTMLComponent}          new HTMLComponent
     */
    static create(attributes: any, dataset: any): HTMLComponent;
    /** @returns {CSSStyleDeclaration} */
    get styles(): CSSStyleDeclaration;
    /** @type {DOMRect} */
    bounds: DOMRect;
    /**
     * @param    {string}  key
     * @param    {string}  [value=undefined]
     * @returns  {string}  The existing or new Attribute value.
     */
    attr(key: string, value?: string | undefined): string;
    /**
     * @param    {string}  name
     * @param    {string}  [value=undefined]
     * @returns  {string}  The existing or new CSS variable value.
     */
    var(name: string, value?: string | undefined): string;
    /**
     * Attach elements as children to this element.
     *
     * @param   {...HTMLComponent} elements
     * @returns {HTMLComponent}    this
     */
    attach(...elements: HTMLComponent[]): HTMLComponent;
    /**
     * Remove elements from being children of this element.
     *
     * @param   {...HTMLComponent} elements
     * @returns {HTMLComponent}    this
     */
    detach(...elements: HTMLComponent[]): HTMLComponent;
    /**
     * Alias for addEventListener.
     *
     * @param   {string}        channel
     * @param   {HTMLListener}  listener
     * @param   {boolean}       captures
     * @returns {HTMLComponent} this
     */
    listen(channel: string, listener: HTMLListener, captures?: boolean): HTMLComponent;
    /**
     * Alias for removeEventListener.
     *
     * @param   {string}        channel
     * @param   {HTMLListener}  listener
     * @param   {boolean}       captures
     * @returns {HTMLComponent} this
     */
    unlisten(channel: string, listener: HTMLListener, captures?: boolean): HTMLComponent;
    /**
     * Convenience for dispatchEvent
     *
     * @example
     * element.dispatch("pinch", { x: 0, y: 42 });
     *
     * @example
     * element.dispatchEvent(new ResizeEvent(element.getBoundingClientRect()))
     *
     * @param   {string|GenericEvent}  event
     * @param   {object}               data
     * @returns {HTMLComponent}        this
     */
    dispatch(event: string | GenericEvent, data?: object): HTMLComponent;
}
/**
 * @callback DefineComponent
 *
 * @param   {string}              tag      HTML tag
 * @param   {...Function}         parents  Parent classes
 * @param   {Record<string><any>} defintiion  Fields, methods, listeners
 *
 * @returns {HTMLComponent}
 */
/** @type {DefineComponent} */
export const Component: DefineComponent;
export type HTMLListener = (: Event) => any;
export type DefineComponent = (tag: string, ...parents: Function[], : Record<string>) => HTMLComponent;
import GenericEvent from './types/events/generic.js';
