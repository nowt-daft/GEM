import ParseError from "../errors/parse.js";

export default [
	[String],
	[
		Number,
		{
			expression: /^(\+|-)?[0-9]+\.([0-9]+)?$/,
			parse(string) {
				const num = parseFloat(string);
				
				if (Number.isNaN(num))
					throw new ParseError(this, string);

				return num;
			}
		}
	],
	[
		Boolean,
		{
expression: /^(true|false)$/,
			parse(string) {
				return string.toLowerCase() === "true";
			}
		}
	],
	[
		BigInt,
		{
			expression: /^-?[0-9]+n$/,
			parse(string) {
				return BigInt(
					string.slice(
						0,
						string.endsWith('n') ?
							-1 :
							undefined
					)
				);
			},
			stringify(bigint) {
				return `${ bigint }n`;
			}
		}
	],
	[
		Function,
		{
			parse(string) {
				try {
					return eval(`(${ string })`);
				} catch(e) {
					throw new ParseError(this, "invalid source code");
				}
			},
			stringify(func) {
				return func.toString();
			}
		}
	],
	[
		Object,
		{
			parse(string) {
				return JSON.parse(string);
			},
			// TODO: stringify and serialise need to be implemented?
			stringify(object) {
				return JSON.stringify(object);
			}
		}
	],
	[
		Array,
		{
			parse(string) {
				return JSON.parse(string);
			},
			// TODO: stringify and serialise need to be implemented?
			stringify(array) {
				return JSON.stringify(array);
			}
		}
	],
	[
		Date,
		{
			expression:
				/[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}\.[0-9]{3}Z/,
			parse(string) {
				const d = new Date(string);
				
				if (Number.isNaN(d))
					throw new ParseError(this, string);
				
				return d;
			},
			stringify(date) {
				return new Date(
					date.getTime() - (date.getTimezoneOffset() * 60000)
				).toJSON();
			},
			serialise(date) {
				return Date.stringify(date);
			}
		}
	],
	[
		Set,
		{
			parse(string) {
				return new Set(JSON.parse(string));
			},
			stringify(set) {
				return JSON.stringify(Set.serialise(set));
			},
			serialise(set) {
				return [...set];
			}
		}
	],
	[
		Map,
		{
			parse(string) {
				return new Map(JSON.parse(string));
			},
			stringify(map) {
				return JSON.stringify(Map.serialise(map));
			},
			serialise(map) {
				return [...map];
			}
		}
	]
]
