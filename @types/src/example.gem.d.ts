/*
 * 💎 GEM -> /@types/src/example.gem.d.ts
 * 📜 UiExample::Component::HTMLElement
 * 💾 Generated on 10/5/2026@17:13:05 from /src/example.gem.js
 */

import { Attr, Var, Component } from "./gui.js";

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
	 */
	static parse(string): unknown;
	/**
	 * @method stringify
	 */
	static stringify(instance): unknown;
	/**
	 * @method serialise
	 */
	static serialise(instance): unknown;
}
export default UiExample;