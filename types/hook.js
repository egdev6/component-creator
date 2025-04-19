import path from "node:path";
import { kebabCase } from "../utils/helpers.js";

export const addHookActions = (actions, data, srcRoot, config) => {
	if (data?.type === "hook") {
		const basePath = path.join(srcRoot, `${config.hooks}/use-{{kebabName}}/`);
		const extension = config.config.extension || "ts";
		if (extension === "ts") {
			actions.push({
				type: "add",
				path: path.join(basePath, `types.${extension}`),
				templateFile: `../plop-templates/hook/types.${extension}.hbs`,
			});
		}
		actions.push(
			{
				type: "add",
				path: path.join(basePath, `hook.${extension}`),
				templateFile: `../plop-templates/hook/hook.${extension}.hbs`,
			},
			{
				type: "add",
				path: path.join(basePath, `store.${extension}`),
				templateFile: `../plop-templates/hook/store.${extension}.hbs`,
			},
			{
				type: "add",
				path: path.join(basePath, `index.${extension}`),
				templateFile: `../plop-templates/hook/index.${extension}.hbs`,
			},
			() => {
				console.log("------------------------------------------");
				console.log(`🔧 Generating hook use-${kebabCase(data.name)}\n`);
				console.log(
					`🔗 added: ${config.hooks}/use-${kebabCase(data.name)}/hook.${extension}`,
				);
				console.log(
					`🔗 added: ${config.hooks}/use-${kebabCase(data.name)}/store.${extension}`,
				);
				if (extension === "ts") {
					console.log(
						`🔗 added: ${config.hooks}/use-${kebabCase(data.name)}/types.${extension}`,
					);
				}
				console.log(
					`🔗 added: ${config.hooks}/use-${kebabCase(data.name)}/index.${extension}\n`,
				);
			},
		);
	}
	return actions;
};
