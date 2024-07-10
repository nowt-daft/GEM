import is from "./is.js";

const SPACE = ' ';
const LP = '(';
const RP = ')';
const ARROW = '=>';

/**
 * @param   {function} func
 * @returns {string}
 */
const parse_args = func => {
	const source = func.toString();
	
	let start = source.indexOf(LP);

	if (start < 0)
		return source
				.slice(
					0,
					source.indexOf(ARROW)
				)
				.trim();

	let index = start;
	let count = 1;

	while (count > 0) {
		const char = source.slice(++index)[0];
		count += (
			char === LP ?
				1 :
				char === RP ?
					-1 :
					0
		);
	}

	return source.slice(start + 1, index).trim();
};

const TAGGERS = {
	undefined: () => 'UNDEFINED',
	null:      () => 'NULL',

	boolean:   x => x ? 'TRUE' : 'FALSE',
	string:    x => `"${ x }"`,
	
	number:    x =>
		Number.isNaN(x) ?
			"NaN" :
			`${ x }`,
	bigint:    x => `${ x }n`,
	
	symbol:    x => `symbol ${ x.description ?? "" }`.trim(),

	function:  x =>
		is.class(x) ?
			`${ x.name }` :
			is.method(x) ?
				`method ${ x.name }(${ parse_args(x) }) {}` :
				is.lamda(x) ?
					`(${ parse_args(x) }) => {}` :
					`function ${ x.name || 'anonymous' }(${ parse_args(x) }) {}`,

	object:  x =>
		x === null ?
			TAGGERS.null() :
			(
				x instanceof String ?
					TAGGERS.string(x) :
				x instanceof Boolean ?
					TAGGERS.boolean(x.valueOf()) :
				x instanceof Number ?
					TAGGERS.number(x) :
					x.constructor.name + SPACE +
					(
						x instanceof Array ?
							`[${ x.length }]` :
						x instanceof Set ?
							`[${ x.size }]` :
						x instanceof Map ?
							`{${ x.size }}` :
							'{}'
					)
			),
};

export const tagify = value => TAGGERS?.[typeof value](value) ?? 'UNKNOWN';
export const tag = (parts, ...args) => {
	let output = parts[0];
	args.forEach(
		(arg, index) => {
			output += tagify(arg);
			output += parts[index + 1];
		}
	);
	return output;
}
export default tagify;
