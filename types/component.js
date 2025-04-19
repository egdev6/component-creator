import path from "node:path";
import { kebabCase, pascalCase } from "../utils/helpers.js";

export const addComponentActions = (actions, data, srcRoot, config) => {
	if (data?.type === "component") {
		const basePath = path.join(
			srcRoot,
			`${config.components}/{{folder}}/{{kebabName}}/`,
		);
		const extension = config.config.extension || "ts";

		if (data?.folder) {
			const folderSegments = data.folder.split("/");
			const groupIndex = folderSegments.indexOf("components") + 1;
			const groupName = config.config.atomic
				? folderSegments[groupIndex]
				: undefined;

			if (groupName) {
				data.storyGroup =
					groupName.charAt(0).toUpperCase() + groupName.slice(1);
			}
		}
		if (config.config.extension === "ts") {
			actions.push({
				type: "add",
				path: path.join(basePath, `types.${extension}`),
				templateFile: `../plop-templates/component/types.${extension}.hbs`,
			});
		}
		actions.push(
			{
				type: "add",
				path: path.join(basePath, `{{pascalName}}.${extension}x`),
				templateFile: `../plop-templates/component/component.${extension}x.hbs`,
			},
			{
				type: "add",
				path: path.join(basePath, `{{pascalName}}.stories.${extension}x`),
				templateFile: `../plop-templates/component/stories.${extension}x.hbs`,
			},
			{
				type: "add",
				path: path.join(basePath, `index.${extension}`),
				templateFile: `../plop-templates/component/index.${extension}.hbs`,
			},
			() => {
				console.log("------------------------------------------");
				console.log(`🔧 Gnerating component ${pascalCase(data.name)}\n`);
				console.log(
					`🔗 added: ${config.components}/${data.folder}/${kebabCase(data.name)}/${pascalCase(data.name)}.${extension}x`,
				);
				console.log(
					`🔗 added: ${config.components}/${data.folder}/${kebabCase(data.name)}/${pascalCase(data.name)}.stories.${extension}x`,
				);
				if (config.config.extension === "ts") {
					console.log(
						`🔗 added: ${config.components}/${data.folder}/${kebabCase(data.name)}/types.${extension}\n`,
					);
				}
				console.log(
					`🔗 added: ${config.components}/${data.folder}/${kebabCase(data.name)}/index.${extension}\n`,
				);
			},
		);
	}

	return actions;
};
