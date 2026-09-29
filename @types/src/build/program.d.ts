declare function _default(project_dir: string | undefined, emit_hook: EmitHook): ts.WatchCompilerHostOfConfigFile<ts.EmitAndSemanticDiagnosticsBuilderProgram>;
export default _default;
export type EmitHook = (path: string, dts: string) => void;
