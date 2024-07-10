import is from "../utils/is.js";
import { GetSet } from "./accessor.js";
import AssignmentError from "../errors/assignment.js";

/**
 * @template T
 * @callback TypedGetter
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
 * @callback TypedSetter
 *
 * @param    {Object}  data
 * @param    {object}  data.target  Object on which the property's value changed.
 * @param    {string}  data.key     The key of the property.
 * @param    {new T}   data.type    The type <T> of the property.
 * @param    {T}       data.from    The previous value of the property.
 * @param    {T}       data.to      The new value of the property.
 *
 * @returns  {T}       Pass or override { to: type } value back from function.
 */

/**
 * @template T
 */
export default class TypedAccessor extends GetSet {
	/**
	 * @param   {string}         key       Key of the property.
	 * @param   {new T}          type      A class or function which returns type <T>.
	 *
	 * @param   {TypedGetter<T>} get       Function which returns value.
	 * @param   {TypedSetter<T>} set       Function which sets a value.
	 *
	 * @param   {T}              value     Predefined value of type specified earlier.
	 * @param   {boolean}        nullable  Is the value nullable?
	 * @param   {boolean}        required  Is the value required when constructing?
	 *
	 * @param   {boolean}        enumerable
	 */
	constructor(
		key,
		type,

		get,
		set,

		value = null,
		nullable = false,

		required = false,
		enumerable = true
	) {
		super(
			key,
			({ target, key }) => {
				if (!is.class(type))
					type = type();
				return value ?? get({ target, key, type });
			},
			({ target, key, to, from }) => {
				if (
					!(is.of_type(to, type)) &&
					!(nullable && to === null)
				)
					throw new AssignmentError(
						this.constructor,
						key,
						to,
						type,
						required,
						nullable
					);

				if (
					is.string(to) &&
					type !== String
				) to = type.parse(to);

				return set({
					target,
					key,
					type,
					to,
					from
				});
			},
			enumerable
		);
	}
}
