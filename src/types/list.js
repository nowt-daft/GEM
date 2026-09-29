import { MetaType, Constructor } from "../gem.js";

export default MetaType(
	"List<T>",
	({ parents: [T] }) => Constructor.Abstract(
		`List<${ T.name }>`
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
