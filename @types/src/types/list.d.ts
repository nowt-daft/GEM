/**
 * @callback MetaList
 * @param    {class}  T
 * @returns  {class}  List<T>
 */
/**
 * @description Creates a class of type T[], where T is the class passed to List.
 * @type  {MetaList}
 */
export const List: MetaList;
export default List;
export type MetaList = (T: class) => class;
