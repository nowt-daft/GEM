/**
 * Capitlise the first letter of a string.
 *
 * @param    {string}  str
 * @returns  {string}
 */
export const capitalise = str => {
	return String.fromCharCode(str.charCodeAt(0) - 32) + str.slice(1);
}

/**
 * @param   {string} char
 * @returns {boolean}
 */
export const is_capital = char => {
	const code = char.charCodeAt(0);
	return 65 <= code && code <= 90;
}

/**
 * @param   {string} char
 * @returns {boolean}
 */
export const is_lower = char => {
	const code = char.charCodeAt(0);
	return 97 <= code && code <= 122;
}
