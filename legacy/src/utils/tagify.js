import is from './is.js';

const EMPTY = '';
const SPACE = ' ';
const COMMA = ',';
const ELIPSES = '...';
const SEPARATOR = ':';

const MAX_SIZE = 3;

const taggers = {
	boolean: x => x ? 'TRUE' : 'FALSE',
	string: x => `"${ x }"`,
	number: x => `${ x }`,
	bigint: x => `${x}n`,

	entries: (
		...keyvaluepairs
	) => {
		return (
			keyvaluepairs
				.slice(0, MAX_SIZE)
				.map(
					([key, value]) =>
						`[${
							tagify(key)
						}]${
							SEPARATOR
						}${
							tagify(value)
						}`
				)
				.join(COMMA) +
			(
				keyvaluepairs.length > MAX_SIZE ?
					COMMA + ELIPSES :
					EMPTY
			)
		);
	},
	
	object: x =>
		x === null ?
			taggers.null() :
			x.constructor.name + SPACE +
			(
				String.defines(x) ?
					taggers.string(x) :
					Number.defines(x) ?
						`(${taggers.number(x)})` :
						Array.defines(x) ?
							taggers.array(x) :
							`{}`
			),
	array: rry =>
		`[${
			rry.slice(0, MAX_SIZE)
				.map(
					value => tagify(value)
				)
				.join(COMMA) +
				(
					rry.length > MAX_SIZE ?
						COMMA + ELIPSES :
						EMPTY
				)
		}]`,
	
	symbol: x => `Symbol (${ x.description })`,

	undefined: () => 'UNDEFINED',
	null: () => 'NULL',

	function: x =>
		is.constructable(x) ?
			`type ${ x.name }`:
			`Function()`, // TODO: we need to as something for our procedures
}

const tagify = value => taggers?.[typeof value](value) ?? 'N/A';
export default tagify; 
