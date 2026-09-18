/*
 💎 GEM :: DEFINITION FILE
 🗐 This file was generated on Tue Aug 04 2026 21:12:34 GMT+0100 (British Summer Time).
 ⚠ DO NOT TAMPER WITH THIS FILE AS CHANGES WILL BE LOST.
*/
import { Component } from "./gui.js";

declare class ExampleElement extends HTMLElement {
	active: Boolean;
	loaded: Boolean;

	attr(key*: String, value?: String): String;
	var(name = "", value = ""): undefined;
	attach(...elements): undefined;
	detach(...elements): undefined;
	listen(channel = "", listener = (e = new Event) => {
    return;
  }, captures = !1): undefined;
	unlisten(channel = "", listener = (e = new Event) => {
    return;
  }, captures = !1): undefined;
	dispatch(event, data = {}): undefined;
}
export default ExampleElement;
