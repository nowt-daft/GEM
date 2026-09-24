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
 * @param    {string}  path
 * @param    {string}  dts
 * @returns  {void}
 *
 */

/**
 * @param   {string}  project_dir
 * @param   {EmitHook} emit_hook
 * @returns {ts.WatchCompilerHostOfConfigFile<ts.EmitAndSemanticDiagnosticsBuilderProgram>}
 */
export default (
	project_dir = ts.sys.getCurrentDirectory(),
	emit_hook
) => {
	const host = ts.createWatchCompilerHost(
		ts.findConfigFile(
			project_dir,
			ts.sys.fileExists,
			"tsconfig.json"
		),
		COMPILER_OPTIONS,
		ts.sys,
		ts.createEmitAndSemanticDiagnosticsBuilderProgram,
		({
			code,
			category,
			messageText,
			file: { fileName }
		}) => console.error(
			`RUH ROH<${ code } :: ${ category }> @ ${ fileName }`,
			ts.flattenDiagnosticMessageText(
				messageText,
				WATCH_INFO_FORMAT.getNewLine()
			)
		),
		() => void 0
		// d => console.info(
			// ts.formatDiagnostic(d, WATCH_INFO_FORMAT)
		// )
	);
	
	host.writeFile = (
		path,
		dts
	) => emit_hook(
		path,
		dts
	);

	ts.createWatchProgram(host);

	return host;
}

