import { Broadcaster } from "../types/broadcaster.js";
import delay from "../utils/delay.js";
import TypedAccessor from "./typed.js";

const MAYBE = '?';
const PRIVATE = '_';
const REQUIRED = '*';

/**
 * @template T
 * @callback Getter
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
 * @callback Setter
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
 * @callback OnChange
 *
 * @param    {object} data
 * @param    {object} data.target  Object on which the property's value changed.
 * @param    {string} data.key     The key of the property.
 * @param    {new T}  data.type    The type <T> of the property.
 * @param    {T}      data.from    The previous value of the property.
 * @param    {T}      data.to      The new value of the property.
 *
 * @returns  {void}
 */

/**
 * @template T
 * @class    MetaDescriptor
 * @extends  Broadcaster<OnChange<T>>
 */
export default class MetaDescriptor extends Broadcaster {
	/** @type {string} Key of the property. */
	key;
	/** @type {new T} A class or function which returns a type. */
	type;
	
	/** @type {Getter<T>} Function which returns a value of type <T>. */
	get;
	/** @type {Setter<T>} Function which sets value: T on property. */
	set;

	/** @type {T} The value of the property */
	value = null;

	is_nullable = false;
	is_required = false;
	is_private = false;

	/**
	 * Sets the property to be nullable.
	 * @returns {MetaDescriptor<T>}  this
	 */
	get nullable() {
		this.is_nullable = true;
		return this;
	}

	/**
	 * Sets the property to be required upon object instantiation.
	 * @returns {MetaDescriptor<T>}  this
	 */
	get required() {
		this.is_required = true;
		return this;
	}

	/**
	 * Determines whether the property is enumerable (public) or not (private)
	 * @returns {MetaDescriptor<T>}  this
	 */
	get private() {
		this.is_private = true;
		return this;
	}

	/**
	 * Assign a default/existing value to the property.
	 * @param   {T}  value  Instance of this descriptor's set type <T>
	 * @returns {MetaDescriptor<T>}  this
	 */
	assign(
		value
	) {
		this.value = value;
		return this;
	}

	/**
	 * @param    {new => T}     type
	 * @param    {Getter<T>}    get
	 * @param    {Setter<T>}    set
	 * @param    {OnChange<T>}  [onchange]
	 */
	constructor(
		type,
		get,
		set,
		onchange
	) {
		if (onchange)
			super(onchange);
		else
			super();

		Object.assign(
			this,
			{
				type,
				get,
				set
			}
		);
	}

	/**
	 * Parse and mofify the given key and associate it with the property.
	 * Also modfifies property depending on what decorations (eg. *, ?, _)
	 * that the key has before being parsed and modified.
	 *
	 * MUST run before init.
	 *
	 * @param   {string}  key  The key of this property.
	 * @returns {MetaDescriptor<T>}  this
	 */
	parse(key) {
		if (key.startsWith?.(PRIVATE))
			this.private;

		if (key.endsWith?.(MAYBE))
			return (this.nullable.key = key.slice(0, -1)), this;
		
		if (key.endsWith?.(REQUIRED))
			return (this.required.key = key.slice(0, -1)), this;

		return this.key = key, this;
	}

	/**
	 * Create the TRUE typed-descriptor to be attached to an object instance.
	 *
	 * @param    {string}  [key]  Only pass key if .parse() has yet to run.
	 * @returns  {TypedAccessor<T>}  The propety descriptor for an object.
	 */
	init(key) {
		if (key)
			this.parse(key);

		return new TypedAccessor(
			this.key,
			this.type,

			({ target, key, type }) => {
				this.type = type;
				return this.get({ type, target, key });
			},

			({ target, key, type, to, from }) => {
				delay(
					() => this.dispatch({ target, key, type, to, from }),
				);
				return this.set({ target, key, type, to, from });
			},
			
			this.value,

			this.is_nullable,
			this.is_required,

			!this.is_private
		);
	}
}

