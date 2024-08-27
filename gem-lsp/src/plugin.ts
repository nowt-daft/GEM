import * as ts from 'typescript/lib/tsserverlibrary';

type Setup = (
	plugin: Plugin,
	prior: ts.LanguageService
) => ts.LanguageService | void;

export default class Plugin {
	#host?: ts.server.ServerHost;
	#project?: ts.server.Project;
	#service?: ts.LanguageService;
	#setup?: Setup;

	get project(): ts.server.Project {
		return this.#project!;
	}

	get host(): ts.server.ServerHost {
		return this.#host!;
	}

	get service(): ts.LanguageService {
		return this.#service!;
	}

	constructor(
		setup: Setup
	) {
		this.#setup = setup;
	}

	log(...msgs: string[]): Plugin {
		for (const msg of msgs) {
			this.project.projectService.logger.info(
				`${ this.constructor.name } :: ${ msg }`
			);
		}

		return this;
	}

	create(info: ts.server.PluginCreateInfo): ts.LanguageService {
		this.#host = info.serverHost;
		this.#project = info.project;
		this.#service = Object.create(null);

		for (
			const [key, func] of
				Object.entries(info.languageService) as
					[keyof ts.LanguageService, Function][]
		)
			// @ts-expect-error
			this.service[key] =
				(...args: object[]) =>
					func?.apply(info.languageService, args);

		this.#service =
			this.#setup?.(this, info.languageService) ?? this.#service;
		
		this.log("PLUGIN HAS BEEN CREATED.");
		return this.service;
	}
}
