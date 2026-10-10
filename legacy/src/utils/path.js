const SLASH = '/';
const EMPTY = '';

const DBL_SLASH = /\/\//gi;
const UP = /[a-z0-9_-]+\/\.\.\//gi;
const HERE = /\.\//gi;

const URI = /^\/|\/\/|(\/[\w-]+)+$/i;

export const is_valid =
	path =>
		URI.test(path);

export const normalise =
	path =>
		path.endsWith(SLASH) ?
			path.slice(0, -1) :
			path;

export const join =
	(...paths) => {
		return paths
			.map(normalise)
			.join(SLASH)
			.replace(DBL_SLASH, SLASH)
			.replace(UP, EMPTY)
			.replace(HERE, EMPTY);
	};
