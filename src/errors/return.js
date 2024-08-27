import GenericError from "./generic.js";

export default class ReturnError extends GenericError {
	constructor(
		type,
		method_name,
		expected_type,
		received_type
	) {
		super(
			"Return Type Error",
			`The method ${
				type.name
			}.${
				method_name
			}(...) should return a ${
				expected_type.name
			} but returned a ${
				received_type.name
			}`
		);
	}
}
