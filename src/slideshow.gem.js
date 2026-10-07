import { Attr, Component } from "./gui.js";

export default Component(
	"ui-slideshow",
	{
		index: Attr(Number).assign(0),
		total: 0,
		next: {
			params: {},
			method() {
				if (++this.index >= this.total)
					return (this.index = 0);
				return this.index;
			},
			returns: Number
		},
		prev() {

		},
		play: {
			params: {},
			method() {
				return true;
			},
			returns: Boolean // TODO: how do I return the self?
		},
		stop() {

		},
		// ["@connected"]() {
		// 	console.log('CONECTED.');
		// }
	}
);
