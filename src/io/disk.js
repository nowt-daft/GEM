import { watch as _watch } from "fs";

const NEWLINE = '\n';
const CHANGE = 'change';

/**
 * @param    {string|URL}       path
 * @returns  {Promise<string>}  Contents of the file (empty if file D.N.E.)
 */
export const open = async path => {
	const file = Bun.file(path);
	return await file.exists() ? await file.text() : "";
}

/**
 * @param    {string}  path  Path of file to watch.
 * @param    {(date_modified_ms: Number) => void}  onchange
 * @returns  {void}
 */
export const watch = async (
	path,
	onchange
) => {
	let _modified = 0;
	_watch(
		path,
		event => {
			// TODO: What if store is deleted? We should account for this...
			if (event === CHANGE) {
				const modified = Bun.file(path).lastModified;
				if (_modified < modified)
					onchange(_modified = modified);
			}
		}
	)
}

/**
 * @param    {string}  path
 * @returns  {void}
 */
export const save = (path, contents) => void Bun.write(path, contents);

/**
 * Creates an Array of files and directories paths.  All directories
 * will end in the '/' character such that it can be filtered.
 *
 * @param    {string}    Directory to view
 * @returns  {string[]}  List of all dirs/ and files.
 */
export const list =
	path =>
		Bun.spawnSync({ cmd: ["ls", "-p", path] })
			.stdout
			.toString()
			.split(NEWLINE)
			.filter(x => x);

