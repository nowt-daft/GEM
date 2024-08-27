import GenericEvent from "./generic.js";

export default class ResizeEvent extends GenericEvent {
	constructor(
		bounds
	) {
		super(
			ResizeEvent.NAME,
			{ bounds }
		);
	}

	static NAME = "resize";
}

