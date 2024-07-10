import Descriptor from "./descriptor.js";
import Property from "./property.js";

import ReadOnlyError from "../errors/readonly.js";

/**
 * @callback DescriptorGetter
 *
 * @returns  {any} Value for the property to return.
 */

/**
 * @callback DescriptorSetter
 *
 * @param    {any|void} value Value being assigned to the property.
 *
 * @returns  {any|void} Inconsequential but returning passed value is good practice.
 */

/**
 * @callback Getter
 *
 * @param     {object} data
 *   @param   {object} data.target Instance to which property descriptor is attached.
 *   @param   {string|symbol} data.key Key where property exists.
 *
 * @returns {any} Whatever value you wish the getter to return.
 */

/**
 * @callback Setter
 *
 * @param     {object} data
 *   @param   {object} data.target Instance to which property descriptor is attached.
 *   @param   {string|symbol} data.key Key where property exists.
 *   @param   {any} data.to Value being assigned to the property.
 *   @param   {any} data.from Previous value of the property.
 *
 * @returns {any|void} Inconsequential but returning passed value is good practice.
 */


/**
 * @property  {DescriptorGetter}  get;
 * @property  {DescriptorSetter}  set;
 */
export default class Accessor extends Descriptor {
	get;
	set;

	/**
	 * @param  {object}    descriptor  Get/Set Object
	 * @param  {DescriptorGetter}  descriptor.get
	 * @param  {DescriptorSetter}  [descriptor.set]
	 * @param  {boolean}   [enumerable=true]
	 */
	constructor(
		descriptor,
		enumerable = true
	) {
		super(enumerable);

		Object.assign(
			this,
			descriptor
		);
	}
	
	/**
	 * @param    {Getter}  get
	 * @param    {boolean} [enumerable=true]
	 *
	 * @returns  {Get}  Getter Accessor Descriptor object
	 */
	static Get(
		get,
		enumerable = true
	) {
		return new Get(
			undefined,
			get,
			enumerable
		);
	}

	/**
	 * @param    {Getter}  get
	 * @param    {Setter}  set
	 * @param    {boolean} [enumerable=true]
	 *
	 * @returns  {Get}  Getter Accessor Descriptor object
	 */
	static GetSet(
		get,
		set,
		enumerable = true
	) {
		return new GetSet(
			undefined,
			get,
			set,
			enumerable
		);
	}
}

export class Get extends Accessor {
	/**
	 * @param {string|symbol}  key
	 * @param {Getter}  get
	 * @param {boolean} [enumerable=true]
	 */
	constructor(
		key,
		get,
		enumerable = true
	) {
		super(
			{
				get() {
					return get({ target: this, key });
				},
				set() {
					throw new ReadOnlyError(this.constructor, key);
				}
			},
			enumerable
		);
	}
}

export class GetSet extends Accessor {
	/**
	 * @param {string} key
	 * @param {Getter} get
	 * @param {Setter} set
	 *
	 * @param {boolean} [enumerable=true]
	 */
	constructor(
		key,
		get,
		set,

		enumerable = true
	) {
		const hidden_key = Symbol(key);
		super(
			{
				get() {
					return this[hidden_key] ??
						Object.defineProperty(
							this,
							hidden_key,
							Property.variable(
								get({ target: this, key }),
								false
							)
						)[hidden_key]
				},
				set(to) {
					const from = this[key];
					return from === to ?
						from :
						this[hidden_key] = set({ target: this, key, to, from });
				}
			},
			enumerable
		);
	}
}

