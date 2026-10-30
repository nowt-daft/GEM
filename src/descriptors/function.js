import MetaDescriptor from "./meta.js";

export default class FunctionDescriptor extends MetaDescriptor {
	params;
	returns;

	constructor(

	) {
		super(
			Function,
			// GET RETRIEVES THE WRAPPER FUNCTION
			() => {},
			// SETTER WRAPS THE FUNCTION THAT IS PASSED
			() => {}
		);
	}

	parse() {
		// MAYBE DO NOTHING?
	}


	init() {
		// THIS MIGHT NEED INTERCEPTED.
	}
}
