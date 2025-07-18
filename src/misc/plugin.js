const DIR = process.env.PWD + '/../..'; // move up to node_modules then up again
const TS_CONFIG_PATH = `${ DIR }/tsconfig.json`;
const CONFIG_CONTENT =
	(
		await Bun.file(
			TS_CONFIG_PATH
		)
		.text()
	)
	.split('\n')
	.filter(
		line => !line.trim().startsWith('//')
	)
	.join('\n');

const TS_CONFIG = JSON.parse(
	CONFIG_CONTENT
);

TS_CONFIG.compilerOptions.plugins = [
	{ name: "gem-lsp" }
];

await Bun.write(
	TS_CONFIG_PATH,
	JSON.stringify(
		TS_CONFIG,
		null,
		2
	)
);


