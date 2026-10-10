export default [
	[
		String
	],
	[
		Number,
		{
			expression: /^(\+|-)?[0-9]+\.([0-9]+)?$/,

			parse(string) {
				const num = parseFloat(string);
				if (num === NaN)
					throw new SyntaxError(
						`${
							this.name.toLocaleUpperCase()
						} PARSE ERROR: "${
							string
						}" is not a Number.`
					)
				return num;
			},

			Range(a, b) {
				const number = this;
				const id = `Range<${number.name}>`;
				return {
					[id]: class extends number {
						static defines(instance) {
							return number.defines(instance) && instance >= a && instance <= b;
						}
					}
				}[id];
			}
		}
	],
	[
		Boolean,
		{
			validate(string) {
				return /^(true|false)$/.test(string);
			},
			parse(string) {
				return string === "true";
			}
		}
	],
	[
		BigInt,
		{
			validate(string) {
				return /^-?[0-9]+n$/.test(string);
			},
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
				return tagify(bigint);
			}
		}
	],
	[
		Function,
		{
			parse(string) {
				try {
					return eval(`(${string})`);
				} catch(e) {
					throw new SyntaxError(
						`FUNCTION PARSE ERROR: The string passed is not valid source code.`
					);
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
			stringify(array) {
				return JSON.stringify(array);
			}
		}
	],
	[
		Date,
		{
			validate(string) {
				return /[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}\.[0-9]{3}Z/.test(string);
			},
			parse(string) {
				const d = new Date(string);
				if (isNaN(d))
					throw new SyntaxError(
						`DATE PARSE ERROR: "${string}" is not a valid date format.`
					);
				return d;
			},
			stringify(date) {
				return new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toJSON();
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
];