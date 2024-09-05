/*
 💎 GEM :: DEFINITION FILE
 🗐 This file was generated on Thu Sep 05 2024 12:11:35 GMT+0100 (British Summer Time).
 ⚠ DO NOT TAMPER WITH THIS FILE AS CHANGES WILL BE LOST.
*/
import Accessor from "./descriptors/accessor.js";
import Getter from "./descriptors/getter.js";
import { Model } from "./gem.js";

declare class Model {
	poop: Number;
	private _state: String;
	private _is_thingied: Boolean;
	property: Number;
	/** 👀 Getter (readonly) */
	get value(): any;
	/** 👀 Getter (readonly) */
	get other_val(): Date;

	older_method(text = ""): unknown;
}
export default class Thing extends Model {
    get val(): string;
    some_method(num?: number): void;
    property: number;
}
