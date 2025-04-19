import fs from "node:fs";
import path from "node:path";
import { formatPath, kebabCase, pascalCase } from "../utils/helpers.js";

export const addPageActions = (actions, data, srcRoot, config) => {
	if (data?.type === "page") {
		const basePath = path.join(srcRoot, `${config.pages.base}/`);
		const extension = config.config.extension || "ts";
		data.basePath = config.pages.base;
		data.routePath = formatPath(data.folder, kebabCase);

		actions.push(
			{
				type: "add",
				path: path.join(
					basePath,
					`{{routePath}}/{{pascalName}}Page.${extension}x`,
				),
				templateFile: `../plop-templates/page/logic.${extension}x.hbs`,
			},
			{
				type: "add",
				path: path.join(
					basePath,
					`{{routePath}}/{{pascalName}}PageView.${extension}x`,
				),
				templateFile: `../plop-templates/page/view.${extension}x.hbs`,
			},
			{
				type: "add",
				path: path.join(basePath, `{{routePath}}/index.${extension}x`),
				templateFile: `../plop-templates/page/index.${extension}.hbs`,
			},
		);

		if (config.config.extension === "ts") {
			actions.push({
				type: "add",
				path: path.join(basePath, `{{routePath}}/types.${extension}`),
				templateFile: `../plop-templates/page/types.${extension}.hbs`,
			});
		}

		const routesFilePath = path.join(srcRoot, config.pages.routes);

		actions.push(() => {
			console.log("------------------------------------------");
			console.log(`🔧 Generating page ${pascalCase(data.name)}Page\n`);
			console.log(
				`🔗 added: ${config.pages.base}/${data.routePath}/${pascalCase(data.name)}Page.${extension}x`,
			);
			console.log(
				`🔗 added: ${config.pages.base}/${data.routePath}/${pascalCase(data.name)}PageView.${extension}x`,
			);
			console.log(
				`🔗 added: ${config.pages.base}/${data.routePath}/index.${extension}x`,
			);
			if (config.config.extension === "ts") {
				console.log(
					`🔗 added: ${config.pages.base}/${data.routePath}/types.${extension}\n`,
				);
			}
			if (fs.existsSync(routesFilePath)) {
				const fileContent = fs.readFileSync(routesFilePath, "utf-8");

				const importPattern = /(\/\/\s-- plop hook for import --\s\/\/)/;
				const routePattern = /{\/\* -- plop hook for route -- \*\/}/;

				const hasImportPattern = importPattern.test(fileContent);
				const hasRoutePattern = routePattern.test(fileContent);

				if (hasImportPattern && hasRoutePattern) {
					actions.push(
						{
							type: "append",
							path: routesFilePath,
							pattern: importPattern,
							templateFile: "../plop-templates/page/import.txt.hbs",
						},
						{
							type: "append",
							path: routesFilePath,
							pattern: routePattern,
							templateFile: "../plop-templates/page/route.txt.hbs",
						},
					);

					console.log(
						`🔗 modified: ${config.pages.routes} con el nuevo import`,
					);
					console.log(
						`🔗 modified: ${config.pages.routes} con la nueva ruta\n`,
					);
				} else {
					if (!hasImportPattern)
						console.warn(`⚠️  Import pattern not found in ${routesFilePath}`);
					if (!hasRoutePattern)
						console.warn(`⚠️  Route pattern not found in ${routesFilePath}`);
				}
			} else {
				console.warn(
					`⚠️  Warning: Routes file not found at ${routesFilePath}. Skipping route modifications.\n`,
				);
			}
		});
	}
	return actions;
};
