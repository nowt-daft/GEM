import { Attr, Var, Component } from "./gui.js";

export default Component(
	"ui-example",
	{
		src: Attr(String, ({ target, to }) => target.load(to)),
		_loaded: false,
		_data: String,
		
		load: {
			params: {
				a: "Boobs"
			},
			method(a = "Boobs") {
				this._data = a;
				return this._loaded = true;
			},
			returns: Boolean
		}
	}
);
