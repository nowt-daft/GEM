import MetaDescriptor from "../meta.js";
import VarEvent from "../../types/events/var.js";

/**
 * @template T
 * @callback Parser
 * @param   {string}  str
 * @returns {T}       value of type <T> parsed from str: string.
 */

/**
 * @template T
 * @callback Stringify
 * @param   {T}  instance
 * @returns {string}
 */

/**
 * @template T
 * @class    Variable
 * @extends  MetaDescriptor<T>
 */
export class Variable extends MetaDescriptor {
	/**
	 * @param {new => T}     type
	 * @param {Parser<T>}    parse
	 * @param {Stringify<T>} stringify
	 */
	constructor(
		type,
		parse = type.parse,
		stringify = type.stringify
	) {
		super(
			type,
			({ target, key }) => {
				/** @type {string} */
				const value = target.var(key);
				if (!value)
					return this.value;

				return parse?.call(type, value) ?? this.value;
			},
			({ target, key, to }) => {
				target.var(
					key,
					stringify.call(type, to)
				);
				return to;
			},
			({ target, key, type, from, to }) => {
				target.dispatch(
					new VarEvent(
						target,
						key,
						type,
						from,
						to
					)
				);
			}
		);
		this.required;
	}

	/**
	 * Create a var from a given type.
	 *
	 * @param    {new => T}  type
	 * @returns  {Variable<T>}  this
	 */
	static type(type) {
		return new Variable(type);
	}

	/**
	 * Create a var by inferring type from a given value.
	 *
	 * @param    {T}  value
	 * @returns  {Variable<T>}  this
	 */
	static from(value) {
		return new Variable(
			value.constructor
		).assign(value);
	}

	/**
	 * Create a required var from a given type.
	 *
	 * @param    {new => T}  type
	 * @returns  {Variable<T>}  this
	 */
	static required(type) {
		return new Variable(type).required;
	}
}

/**
 * @template T
 * @param    {new => T}      type
 * @param    {Parser<T>}     parse
 * @param    {Stringify<T>}  stringify
 * @returns  {Var<T>}  new Var
 */
export default (
	type,
	parse = type.parse,
	stringify = type.stringify
) => new Var(
	type,
	parse,
	stringify
);

