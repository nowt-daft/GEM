import MetaDescriptor from "../meta.js";
import AttributeEvent from "../../types/events/attribute.js";

/**
 * @template T
 * @callback AttributeChange
 *
 * @param    {object}   data
 * @param    {object}   data.target  Object on which the property's value changed.
 * @param    {string}   data.key     The key of the property.
 * @param    {new => T} data.type    The type <T> of the property.
 * @param    {T}        data.from    The previous value of the property.
 * @param    {T}        data.to      The new value of the property.
 *
 * @returns  {T}        Pass or override { to: type } value back from function.
 */

/**
 * @template T
 * @class Attribute
 * @extends MetaDescriptor<T>
 */
export class Attribute extends MetaDescriptor {
	/**
	 * @param  {class}              type
	 * @param  {AttributeChange<T>} [onchange]
	 */
	constructor(
		type,
		onchange
	) {
		super(
			type,
			({ target, key, type }) => {
				/** @type {string} */
				const value = target.attr(key);
				if (!value)
					return this.value;

				return type.parse?.(value) ?? this.value;
			},
			({ target, key, type, to }) => {
				target.attr(key, type.stringify?.(to) ?? `${ to }`);
				return to;
			},
			({ target, key, type, from, to }) => {
				onchange?.({ target, key, type, from, to });
				target.dispatch(
					new AttributeEvent(
						target,
						key,
						type,
						from,
						to
					)
				);
			}
		);
	}
}

/**
 * @template T
 * @param    {new => T}            type
 * @param    {AttributeChange<T>}  onchange
 * @returns  {Attribute<T>}  new Attribute
 */
export default (type, onchange) => new Attribute(type, onchange);
