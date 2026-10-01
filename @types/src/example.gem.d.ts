/*
 * 💎 GEM -> /@types/src/example.gem.d.ts
 * 📜 UiExample::Component::HTMLElement
 * 💾 Generated on 10/1/2026@16:14:03 from /src/example.gem.js
 */

import { Attr, Var, Component } from "./gui.js";

declare class UiExample extends HTMLElement  {
	private get src(): String;
	private get loaded(): Boolean;

	inherit(parent, ...args): unknown;
	super(...arg_collection): unknown;
	load(a: string): boolean;
	attr(key: string, value?: string): string;
	var(name: string, value?: string): string;
	attach(...elements: HTMLElement[]): HTMLElement;
	detach(...elements: HTMLElement[]): HTMLElement;
	listen(channel: string, listener: Function, captures?: boolean): HTMLElement;
	unlisten(channel: string, listener: Function, captures?: boolean): HTMLElement;
	dispatch(event: any, data?: object): HTMLElement;

	static readonly expression: RegExp;
	static validate(string): unknown;
	static parse(string): unknown;
	static stringify(instance): unknown;
	static serialise(instance): unknown;
}
export default UiExample;