import { spawn } from "node:child_process";
import { env, exit } from "node:process";
import { readFileSync } from "node:fs";

function parse_env(file) {
	const contents = readFileSync(file, { encoding: "utf-8" });
	const entries = contents.split("\n").filter(x => x).map(
		line => line.split('=')
	);
	return Object.fromEntries(entries);
}

const PWD = env.PWD ?? ".";
const SETTINGS = parse_env(`${ PWD }/.env`);

console.log(PWD);
console.log(SETTINGS);

const child = spawn(
	SETTINGS["BUN_RUNTIME"],
	[
		"run",
		"--no-telemetry",
		"--preload",
		`${ PWD }/src/misc/dom.js`,
		`${ PWD }/src/misc/build.js`,
		"--service"
	],
	{ cwd: PWD, stdio: 'pipe' }
);

child.stdout.on(
	'data',
	chunk => console.log(`${chunk}`)
);
child.stderr.on(
	'data',
	chunk => console.error(`${chunk}`)
);


for await (const line of console) {
	if (line === "exit")
		exit();
	child.stdin.write(line);
}

