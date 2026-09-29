/*
 * 💎 GEM -> /@types/src/element.gem.d.ts
 * 📜 ExampleElement::Component::HTMLElement
 * 💾 Generated on 9/29/2026@15:32:00 from /src/element.gem.js
 */

import { Component } from "./gui.js";

declare class ExampleElement extends HTMLElement  {
	active: Boolean;
	loaded: Boolean;

	attr(key: undefined, value: undefined?): String;
	var(name: undefined, value: undefined?): String;
	attach(...elements): unknown;
	detach(...elements): unknown;
	listen(channel = "", listener = (e = new Event) => {
    return;
  }, captures = !1): unknown;
	unlisten(channel = "", listener = (e = new Event) => {
    return;
  }, captures = !1): unknown;
	dispatch(event, data = {}): unknown;
}
export default ExampleElement;