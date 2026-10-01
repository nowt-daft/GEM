import { MetaType, Constructor } from "../gem.js";

export default MetaType(
	"T[]",
	(
		_,
		{ parents: [{ name }] }
	) => Constructor.Abstract(
		`${ name }[]`
	),
	{
		defines(instance) {
			const { parents: [T] } = this;
			return instance?.every?.(
				item => item instanceof T
			) ?? false;
		}
	}
);
