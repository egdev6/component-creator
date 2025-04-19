import fs from "node:fs";
import path from "node:path";
import { camelCase } from "../utils/helpers.js";

export const addServiceActions = (actions, data, srcRoot, config) => {
	const serviceBasePath = path.join(srcRoot, `${config.services.base}/`);
	const typesBasePath = path.join(srcRoot, `${config.services.types}`);
	const pathToApi = config.services.axios;
	const mocksDataBasePath = path.join(
		srcRoot,
		`${config.services.mocks.data}/`,
	);
	const mocksServerBasePath = path.join(
		srcRoot,
		`${config.services.mocks.server}`,
	);
	const extension = config.config.extension || "ts";
	data.pathToApi = pathToApi;

	if (data?.type === "service") {
		actions.push(
			{
				type: "add",
				path: path.join(serviceBasePath, `/{{camelName}}Service.${extension}`),
				templateFile: `../plop-templates/service/service.${extension}.hbs`,
			},

			{
				type: "add",
				path: path.join(mocksDataBasePath, "/{{kebabName}}.json"),
				templateFile: "../plop-templates/service/data.json.hbs",
			},
		);

		if (extension === "ts") {
			actions.push({
				type: "add",
				path: path.join(
					typesBasePath,
					`/{{camelName}}ServiceTypes.${extension}`,
				),
				templateFile: `../plop-templates/service/types.${extension}.hbs`,
			});
		}

		actions.push(() => {
			console.log("------------------------------------------");
			console.log(`🔧 Generating service ${camelCase(data.name)}Service\n`);
			console.log(
				`🔗 added: ${config.services.base}/${camelCase(data.name)}Service.${extension}`,
			);
			console.log(
				`🔗 added: ${config.services.mocks.data}/${camelCase(data.name)}.json`,
			);
			if (extension === "ts") {
				console.log(
					`🔗 added: ${config.services.type}/${camelCase(data.name)}Service.${extension}`,
				);
			}
			if (fs.existsSync(mocksServerBasePath)) {
				const fileContent = fs.readFileSync(mocksServerBasePath, "utf-8");

				const mockPattern = /(\/\/ -- plop hook for mocks --\s\/\/)/;

				const hasMockPattern = mockPattern.test(fileContent);

				if (hasMockPattern) {
					actions.push({
						type: "append",
						path: mocksServerBasePath,
						pattern: mockPattern,
						templateFile: "../plop-templates/service/mock.txt.hbs",
					});

					console.log(
						`🔗 modified: ${config.services.mocks.server} with new mock\n`,
					);
				} else {
					if (!hasMockPattern)
						console.warn(
							`⚠️  Mock pattern not found in ${mocksServerBasePath}\n`,
						);
				}
			} else {
				console.warn(
					`⚠️  Warning: Mock server file not found at ${mocksServerBasePath}. Skipping mock server modifications.\n`,
				);
			}
		});
	}

	return actions;
};
