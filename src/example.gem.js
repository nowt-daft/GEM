import { Attr, Var, Component } from "./gui.js";

export default Component(
	"ui-example",
	{
		src: Attr(String, ({ target, to }) => target.load(to)),
		loaded: false,
		
		load: {
			params: {
				a: "Boobs"
			},
			method(a = "Boobs") {
				return a == "Boobs";
			},
			returns: Boolean
		}
	}
);
