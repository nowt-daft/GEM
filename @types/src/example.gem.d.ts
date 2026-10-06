/*
 * 💎 GEM -> /@types/src/example.gem.d.ts
 * 📜 UiExample::Component::HTMLElement
 * 💾 Generated on 10/6/2026@16:34:06 from /src/example.gem.js
 */

import { Attr, Var, Component } from "./gui.js";

/**
 * @class UiExample
 * @extends HTMLElement
*/
declare class UiExample extends HTMLElement  {
	private get src(): String;
	private get loaded(): Boolean;

	/**
	 * @method inherit
	 */
	inherit(parent, ...args): unknown;
	/**
	 * @method super
	 */
	super(...arg_collection): unknown;
	/**
	 * @method load
	 */
	load(a: string): boolean;
	/**
	 * @method attr
	 */
	attr(key: string, value?: string): string;
	/**
	 * @method var
	 */
	var(name: string, value?: string): string;
	/**
	 * @method attach
	 */
	attach(...elements: HTMLElement[]): HTMLElement;
	/**
	 * @method detach
	 */
	detach(...elements: HTMLElement[]): HTMLElement;
	/**
	 * @method listen
	 */
	listen(channel: string, listener: Function, captures?: boolean): HTMLElement;
	/**
	 * @method unlisten
	 */
	unlisten(channel: string, listener: Function, captures?: boolean): HTMLElement;
	/**
	 * @method dispatch
	 */
	dispatch(event: any, data?: object): HTMLElement;

	static readonly expression: RegExp;
	/**
	 * @method validate
	 * @description 
	 * Validates if the given string can be parsed into this type.
	 */
	static validate(str: string): boolean;
	/**
	 * @method parse
	 * @description 
	 * Uses the given string to construct an instance of this type. By default, the constructor of the type is called.
	 */
	static parse(str: string): object;
	/**
	 * @method stringify
	 * @description 
	 * Converts our instance into a string representation of itself.
	 */
	static stringify(instance: object): string;
	/**
	 * @method serialise
	 * @description 
	 * Intermediary step from instance to string. This is needed for some types.
	 * @example 
	 * [TODO] Please provide a solid example...
	 */
	static serialise(instance: object): object;
	/**
	 * @method defines
	 * @description 
	 * Is this type or one of its parents the constructor for the given instance.
	 */
	static defines(): boolean;
}
export default UiExample;