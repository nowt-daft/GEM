import is from "../utils/is.js";
import tagify from "../utils/tagify.js";
import UndefinedPropertyError from "../errors/undefined.js";
import RequiredPropertyError from "../errors/required.js";

/**
 * Object concatenation of the form A + B + ... + C = D
 * @param    {...object} objects Dictionary/Objects we wish to amalgamate
 * @returns  {object} The NEW Object.
 */
export const concat = Object.concat =
	(...objects) =>
		Object.assign(
			{},
			...objects
		);


/**
 * Get an Array of Key-Value pairs from an Object's properties/values.
 * This includes both ENUMERABLE and INNUMERABLE properties as well as
 * properties with SYMBOLS as Keys.
 * @param    {object} object
 * @returns  {[string|symbol, any][]} Array of Key-Value pairs
 */
export const all_entries = Object.all_entries =
	object => [
		...Object.getOwnPropertyNames(object),
		...Object.getOwnPropertySymbols(object),
	].map(
		key => [
			key,
			object[key]
		]
	);


/**
 * @callback ModifyCallback
 * @param    {[string|symbol, any][]} entries Array of Key-Value pairs
 * @returns  {[string|symbol, any][]} Array of Key-Value pairs
 */

/**
 * Modify an Object via its entries (Array of Key-Value pairs) and returning
 * a new set of entries from which to construct a NEW Object.
 * @param    {object} object
 * @param    {ModifyCallback} modifier
 * @returns  {object} NEW Object
 */
export const modify = Object.modify =
	(
		object,
		modifier
	) =>
		Object.fromEntries(
			modifier(
				all_entries(object)
			)
		);


/**
 * @callback ForEach
 * @param    {string|symbol} key
 * @param    {any} value
 * @returns  {undefined} VOID
 */
/**
 * Simple Object iterator which leaves target object unmodified.
 * @param    {object} object
 * @param    {ForEach} foreach
 * @returns  {object} NEW Object
 */
export const forEach = Object.forEach =
	(
		object,
		foreach
	) =>
		modify(
			object,
			entries =>
				entries.forEach(
					([key, value]) =>
						foreach(key, value)
				) ?? entries
		);


/**
 * @callback Mapper
 * @param    {string|symbol} key
 * @param    {any} value
 * @returns  {[string|symbol, any]} Key-Value pair
 */
/**
 * Map target object into a NEW Object.
 * @param    {object} object
 * @param    {Mapper} mapper
 * @returns  {object} NEW Object
 */
export const map = Object.map =
	(
		object,
		mapper
	) =>
		modify(
			object,
			entries =>
				entries.map(
					([key, value]) => mapper(key, value)
				)
		);


/**
 * @callback Filter
 * @param    {string|symbol} key
 * @param    {any} value
 * @returns  {boolean} TRUE => keep Key-Value pair; FALSE => discard Key-Value pair
 */
/**
 * Create a NEW Object using a filter callback on each Key-Value pair
 * @param    {object} object
 * @param    {Filter} filterer
 * @returns  {object} NEW Object
 */
export const filter = Object.filter =
	(
		object,
		filterer
	) =>
		modify(
			object,
			entries =>
				entries.filter(
					([key, value]) => filterer(key, value)
				)
		);


/**
 * @callback Sort
 * @param    {string|symbol} key
 * @param    {any} value
 * @returns  {number} index to place Key-Value pair.
 */
/**
 * Sort the Key-Value pairs of an Object into different "buckets" as NEW Objects.
 * The "buckets" container is an Array which contains each "buckets" (and, thus,
 * the sorter argument is a callback which should return an INDEX/NUMBER).
 *
 * @example
 * const some_object = {
 *     property: 42,
 *     a_value: "hello",
 *     print() {
 *         return `"${ this.a_value }": ${ this.property }`;
 *     }
 * };
 * const [
 *     properties, // object with property and a_value
 *     functions   // object with print
 * ] =
 *     Object.sort(
 *         some_object,
 *         (key, value) =>
 *             typeof value === 'function' ? 1 : 0;
 *     );
 *
 * @param    {object} object
 * @param    {Sort} sorter
 * @param    {number|Array} [buckets=[]] Either the number of buckets or an Array
 * @returns  {object[]} Array of Objects organised into their respective "buckets"
 */
export const sort = Object.sort =
	(
		object,
		sorter,
		buckets = []
	) =>
		all_entries(object)
			.reduce(
				(buckets, [key, value]) => {
					const index = sorter(key, value);
					if (index > -1)
						buckets[index] = [
							...(buckets[index] ?? []),
							[key, value]
						];

					return buckets;
				},
				is.array(buckets) ?
					buckets :
					is.integer(buckets) ?
						Array.from({ length: buckets }, _ => []) :
						[]
			)
			.map(
				entries =>
					Object.fromEntries(entries ?? [])
			);


/**
 * View an objects Key-Value pairs as a NEW Object.
 * This is similar to Object.all_entries but adapted for viewing
 * the prototype of types/classes.
 *
 * By default, any properties named 'constructor' or '__proto__'
 * are ignored.
 *
 * @param    {object} object
 * @param    {string[]} [ignore_list=[]]
 * @returns  {object} A view of all object's properties except those in the ignore_list
 */
export const view = Object.view =
	(
		object,
		ignore_list = []
	) =>
		ignore_list = [
			'constructor',
			'__proto__',
			'init', // TODO: Keep?
			...ignore_list
		] &&
		filter(
			object,
			(key) =>
				!ignore_list.includes(key)
		);


/**
 * If the prototype DOES NOT have an init method, we assume each argument in
 * ...args is an Object of Key-Value pairs to assign to the target object.
 *
 * @param    {object}  target
 * @param    {class}   type  The type from which the target Initialises.
 * @param    {...any}  args  Any arguments or Key-Value objects to assign.
 * @returns  {object}  The target object intitialised by the type.
 */
export const init = Object.init =
	(
		target,
		type,
		...args
	) => {
		const {
			prototype: { init }
		} = type;

		if (is.function(init))
			return init.apply(target, args), target;

		return Object.assign(
			target,
			...args.filter(
				args => is.object(args)
			)
		);
	};

/**
 * Ensure all values set on an Object are defined, valid, and exist if required.
 * If true, the target object is returned.  Otherwise, TypeErrors are thrown.
 *
 * Necessary properties on types for performing validation are implemented by GEM.
 *
 * Pass a second argument (type) to verify a raw object against that type.
 *
 * @param    {object} target Instance to validate
 * @param    {class}      type   Type, class, or other constructable
 * @returns  {object}        Target object if all tests pass.
 *
 * @throws   {UndefinedPropertyError}
 * @throws   {RequiredPropertyError}
 */
export const verify = Object.verify =
	(
		target,
		type = target.constructor
	) => {
		if (is.type(type, Array))
			return target;

		for (
			const [key, value] of
			Object.entries(target)
		) {
			const field = type.prescriptor?.[key];

			if (!field)
				throw new UndefinedPropertyError(
					type,
					key
				);

			if (
				field.is_required &&
				(
					is.undefined(value) ||
					(
						!field.is_nullable &&
						is.null(value)
					)
				)
			)
				throw new RequiredPropertyError(
					type,
					key,
					field.type
				);
		}

		return target;
	};

/**
 * Initialise a target object through its constructor's properties, defaults,
 * and passed arguments (args).
 *
 * If target's constructor's prototype does not have an init method,
 * arguments will be treated as a list of Key-Value objects.
 *
 * @param    {object} target
 * @param    {...any} args
 * @returns  {object}  The modified target object
 */
export const construct = Object.construct =
	(
		target,
		...args
	) => {
		const type = target.constructor ?? {};

		const {
			properties = {},
			defaults = {}
		} = type;

		return (
			verify(
				init(
					Object.assign(
						Object.defineProperties(
							target,
							properties
						),
						defaults
					),
					type,
					...args
				)
			)
		);
	};



Object.assign(
	Object.prototype,
	{
		toString() {
			return (
				(this[Symbol.toStringTag] ?? 'Object') + ' {\n' +
				Object
					.entries(this)
					.map(
						([
							key,
							value
						]) =>
							`  ${ tagify(key) }: ${ tagify(value) }`
					)
					.join(',\n') +
				'\n}'
			);
		}
	}
);

export default Object;
