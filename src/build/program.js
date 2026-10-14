import * as ts from "typescript";

const COMPILER_OPTIONS = {
	allowJs: true,
	declaration: true,
	emitDeclarationOnly: true,
};

const WATCH_INFO_FORMAT = {
	getNewLine: () => ts.sys.newLine,
	getCurrentDirectory: () => ts.getCurrentDirectory(),
	getCanonicalFileName: p => p
}


/**
 * @callback EmitHook
 * @param    {Record<string,any>}  config
 * @param    {string}  path
 * @param    {string}  dts
 * @returns  {void}
 *
 */

/**
 * @callback DeleteHook
 * @param    {Record<string,any>}  config
 * @returns  {void}
 *
 */

/**
 * @param   {string}  project_dir
 * @param   {EmitHook} emit_hook
 * @param   {DeleteHook} del_hook
 * @returns {ts.WatchCompilerHostOfConfigFile<ts.EmitAndSemanticDiagnosticsBuilderProgram>}
 */
export default async (
	project_dir = ts.sys.getCurrentDirectory(),
	emit_hook,
	del_hook
) => {
	const config_file = ts.findConfigFile(
		project_dir,
		ts.sys.fileExists,
		"tsconfig.json"
	);
	const config = await Bun.file(config_file).json();

	const host = ts.createWatchCompilerHost(
		config_file,
		COMPILER_OPTIONS,
		ts.sys,
		ts.createEmitAndSemanticDiagnosticsBuilderProgram,
		({
			code,
			category,
			messageText,
			file = {}
		}) => {
			if (!file.fileName) {
				console.error(`[DELETED] ${ code }`);
				del_hook(config);
				return;
			}
			console.error(
				`RUH ROH<${ code } :: ${ category }> @ ${ file.fileName }`,
				ts.flattenDiagnosticMessageText(
					messageText,
					WATCH_INFO_FORMAT.getNewLine()
				)
			);
		},
		() => void 0
	);
	
	host.writeFile = (
		path,
		dts
	) => emit_hook(
		config,
		path,
		dts
	);

	ts.createWatchProgram(host);

	return host;
}

