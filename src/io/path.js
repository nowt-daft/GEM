const SLASH = '/';
const EMPTY = '';

const DBL_SLASH = /\/\//gi;
const UP = /[a-z0-9_-]+\/\.\.\//gi;
const HERE = /\.\//gi;

const URI = /^\/|\/\/|(\/[\w-]+)+$/i;

/**
 * @param    {string}  path
 * @returns  {boolean} Is the path a valid URI?
 */
export const is_valid =
	path =>
		URI.test(path);

/**
 * If the path has a trailing slash, the slash is removed.
 *
 * @param    {string}  path
 * @returns  {string}  The given path without any trailing slashes.
 *
 * TODO: Is there any issue with the ROOT?
 */
export const normalise =
	path =>
		path.endsWith(SLASH) ?
			path.slice(0, -1) :
			path;

export const join = (
	...paths
) => paths
		.map(normalise)
		.join(SLASH)
		.replace(DBL_SLASH, SLASH)
		.replace(UP, EMPTY)
		.replace(HERE, EMPTY);

/**
 * @param    {string}  root_path  The "higher-up" or "containing" directory path.
 * @param    {string}  sub_path   The full path that represents a location BELOW the higher path.
 */
export const diff = (
	root_path,
	sub_path
) => sub_path.slice(
	Math.max(
		0,
		root_path.length
	)
);
