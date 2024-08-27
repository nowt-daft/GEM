const TAB = '\t';

/**
 * @param    {object}  object
 * @returns  {string}  Object stringified for serialisation purposes.
 */
export const stringify = object =>
	JSON.stringify(
		object,
		(_, value) =>
			value?.constructor?.serialise?.(value) ?? value,
		TAB
	);

/**
 * @param    {string}  string
 * @returns  {any}     Value or Object constructured by parsing the string.
 */
export const parse = string => string ? JSON.parse(string) : null;
