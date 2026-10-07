/*
 * 💎 GEM -> /@types/src/example.gem.d.ts
 * 📜 UiExample::Component::HTMLElement
 * 💾 Generated on 10/7/2026@24:28:43 from /src/example.gem.js
 */

import { Attr, Var, Component } from "./gui.js";

/**
 * @class UiExample
 * @extends HTMLElement
 */
declare class UiExample extends HTMLElement  {
	src: String;
	private _loaded: Boolean;
	private _data: String;

	/**
	 * @method inherit
	 */
	inherit(parent, ...args): UiExample;
	/**
	 * @method super
	 */
	super(...arg_collection): UiExample;
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
	attach(...elements: HTMLElement[]): UiExample;
	/**
	 * @method detach
	 */
	detach(...elements: HTMLElement[]): UiExample;
	/**
	 * @method listen
	 */
	listen(channel: string, listener: Function, captures?: boolean): UiExample;
	/**
	 * @method unlisten
	 */
	unlisten(channel: string, listener: Function, captures?: boolean): UiExample;
	/**
	 * @method dispatch
	 */
	dispatch(event: any, data?: object): UiExample;

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
	 * Uses the given string to construct an instance of this type. By default, the constructor of this type is called.
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
	 * Intermediary step from instance to string. This is needed for some types (ie. Date, Set, etc)
	 */
	static serialise(instance: object): object;
}
export default UiExample;