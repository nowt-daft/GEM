import MetaDescriptor from "./meta.js";
import ReadOnlyError from "../errors/readonly.js";

/**
 * @template T
 * @callback Gett
 *
 * @param    {Object}  data
 * @param    {object}  data.target  Object on which the property's value changed.
 * @param    {string}  data.key     The key of the property.
 * @param    {new T}   data.type    The type <T> of the property.
 *
 * @returns  {T}       A value which is an instance of type <T>.
 */

/**
 * @template T
 * @class GetDescriptor extends MetaDescriptor<T>
 */
export class GetDescriptor extends MetaDescriptor {
	/**
	 * @param    {new T}    type
	 * @param    {Gett<T>}  getter
	 */
	constructor(
		type,
		getter
	) {
		super(
			type,
			getter,
			({ key, type }) => {
				throw new ReadOnlyError(type, key);
			}
		);
	}
}

/**
 * @template T
 * @param    {new T}    type
 * @param    {Gett<T>}  getter
 * @returns  {MetaDescriptor<T>}
 */
export default function Getter(
	type,
	getter
) {
	return new GetDescriptor(
		type,
		getter,
	);
}
