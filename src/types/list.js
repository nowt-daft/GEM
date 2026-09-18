import { MetaType, Constructor } from "../gem.js";

/**
 * @callback MetaList
 * @param    {class}  T
 * @returns  {class}  List<T>
 */

/**
 * @description Creates a class of type T[], where T is the class passed to List.
 * @type  {MetaList}
 */
export const List = MetaType(
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

export default List;
