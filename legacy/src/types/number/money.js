import { UInt } from "./uint.js";

// This needs some thought... 
// I don't think it should extends UInt,
// instead, it should be a Model that is
// able to parse numbers.  The type of currency
// Is another part that is specific to the isntance?
// Hmmmmmm food for thought!
export default class Money extends UInt {
	constructor(
		symbol = '£' // default is pound sterling, get over it.
	) {

	}
}