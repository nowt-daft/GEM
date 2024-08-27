import MetaDescriptor from "./meta.js";

/**
 * @template T
 * @callback OnChange
 *
 * @param    {object} data
 * @param    {object} data.target  Object on which the property's value changed.
 * @param    {string} data.key     The key of the property.
 * @param    {new T}  data.type    The type <T> of the property.
 * @param    {T}      data.from    The previous value of the property.
 * @param    {T}      data.to      The new value of the property.
 *
 * @returns  {T}      Pass or override { to: type } value back from function.
 */

/**
 * @template T
 * @class    Field
 * @extends  MetaDescriptor<T>
 */
export class Field extends MetaDescriptor {
	/**
	 * @param  {new => T}     type
	 * @param  {OnChange<T>}  onchange
	 */
	constructor(
		type,
		onchange
	) {
		super(
			type,
			() => this.value,
			({ to }) => to,
			onchange
		);
	}

	/**
	 * Create a field from a given type.
	 *
	 * @param    {new => T}  type
	 * @returns  {Field<T>}  this
	 */
	static type(type) {
		return new Field(type);
	}

	/**
	 * Create a field by inferring type from a given value.
	 *
	 * @param    {T}         value
	 * @returns  {Field<T>}  this
	 */
	static from(value) {
		return new Field(value.constructor).assign(value);
	}

	/**
	 * Create a required Field from a given type.
	 *
	 * @param    {new => T}  type
	 * @returns  {Field<T>}  this
	 */
	static required(type) {
		return new Field(type).required;
	}

	/**
	 * Create a private Field from a given type.
	 *
	 * @param    {new => T}  type
	 * @returns  {Field<T>}  this
	 */
	static private() {
		return new Field(type).private;
	}
}

/**
 * @template T
 * @param    {new => T}  type
 * @returns  {Field<T>}  new Field
 */
export default type => new Field(type);

