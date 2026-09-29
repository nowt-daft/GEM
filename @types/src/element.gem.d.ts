/*
 * 💎 GEM -> /@types/src/element.gem.d.ts
 * 📜 ExampleElement::Component::HTMLElement
 * 💾 Generated on 9/28/2026@17:49:52 from /src/element.gem.js
 */

import { Component } from "./gui.js";

declare class ExampleElement extends HTMLElement  {
	active: Boolean;
	loaded: Boolean;

	attr(key*: String, value?: String): String;
	var(name: undefined, value?: String): String;
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