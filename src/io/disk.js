//import { stringify, parse } from "./serialise.js";
import { Broadcaster } from "../types/broadcaster.js";

// const DIR = process.env.DATA_DIR ?? 'data';
// const CHANGE = 'change';
const NEWLINE = '\n';

/**
 * @param    {string|URL}        path
 * @returns  {Promise.<string>}  Contents of the file
 */
export const open = async path => await Bun.file(path).text();

/**
 * @param    {string}            path
 * @returns  {void}
 */
export const save = (path, contents) => void Bun.write(path, contents);

export const list =
	path =>
		Bun.spawnSync({ cmd: ["ls", "-p", path] })
			.stdout
			.toString()
			.split(NEWLINE)
			.filter(x => x);

export class Store extends Broadcaster {
	
}
