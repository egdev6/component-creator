import path from "node:path";
import { promptsGenerator } from "../prompts/promptsGenerator.js";
import { addComponentActions } from "../types/component.js";
import { addHookActions } from "../types/hook.js";
import { addPageActions } from "../types/page.js";
import { addServiceActions } from "../types/service.js";
import loadConfig from "../utils/load-config.js";

const srcRoot = path.resolve(process.cwd());

export default function (plop) {
	const config = loadConfig();

	plop.setHelper("pascalCase", (text) =>
		text
			.replace(/([a-z0-9])([A-Z])/g, "$1-$2")
			.replace(/[\s_]+/g, "-")
			.toLowerCase()
			.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match) => match.toUpperCase())
			.replace(/-/g, ""),
	);
	plop.setHelper("kebabCase", (text) =>
		text
			.replace(/([a-z0-9])([A-Z])/g, "$1-$2")
			.replace(/[\s_]+/g, "-")
			.toLowerCase(),
	);
	plop.setHelper("camelCase", (text) =>
		text
			.replace(/(^\w|-\w)/g, (match) => match.replace("-", "").toUpperCase())
			.replace(/\s+/g, ""),
	);
	console.log(
		"-----------------------------------------------------------------------------------\n",
	);

	plop.setGenerator("crear", {
		description: "Create component, page, hook or service",
		prompts: promptsGenerator,
		actions: (data) => {
			const actions = [];
			data.pascalName = plop.getHelper("pascalCase")(data.name);
			data.kebabName = plop.getHelper("kebabCase")(data.name);
			data.camelName = plop.getHelper("camelCase")(data.name);

			addComponentActions(actions, data, srcRoot, config);
			addPageActions(actions, data, srcRoot, config);
			addHookActions(actions, data, srcRoot, config);
			addServiceActions(actions, data, srcRoot, config);

			return actions;
		},
	});
}
