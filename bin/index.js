#!/usr/bin/env node
import inquirer from "inquirer";
import nodePlop from "node-plop";
import { kebabCase, pascalCase } from "../utils/helpers.js";
import loadConfig from "../utils/load-config.js";

const main = async () => {
	console.log(
		"-----------------------------------------------------------------------------------",
	);
	console.log("                           ⚛️  Egdev Component Creator ⚛️");
	const config = loadConfig();
	const extension = config.extension || "ts";

	const plop = await nodePlop("./bin/component-creator.js");
	const generator = plop.getGenerator("crear");
	let repeat = true;

	const getFolderByType = (answers) => {
		const type = answers.type;
		switch (type) {
			case "page":
				return `${config.pages.base}/${kebabCase(answers.name)}`;
			case "hook":
				return `${config.hooks}/use-${kebabCase(answers.name)}`;
			case "component":
				return `${config.components}/${answers.folder}/${kebabCase(answers.name)}`;
			case "service":
				return `${config.services.base}/${pascalCase(answers.name)}`;
			default:
				return "";
		}
	};

	const getNameByType = (answers) => {
		const type = answers.type;
		switch (type) {
			case "page":
				return `${pascalCase(answers.name)}Page.${extension}x`;
			case "hook":
				return `hook.${extension}`;
			default:
				return `${pascalCase(answers.name)}.${extension}x`;
		}
	};

	const openInEditor = async (folderPath) => {
		const editorPath = "code"; // Adjust for your editor
		const absolutePath = path.resolve(folderPath);

		try {
			console.log(`Opening editor at: ${absolutePath}`);
			const { execSync } = await import("node:child_process");
			execSync(`${editorPath} ${absolutePath}`, {
				stdio: "inherit",
				env: { ...process.env, PATH: process.env.PATH },
			});
		} catch (error) {
			console.error("Error opening editor:", error.message);
		}
	};

	while (repeat) {
		const answers = await generator.runPrompts();

		try {
			const result = await generator.runActions(answers);

			if (result.failures && result.failures.length > 0) {
				console.error("❌ Error generating component.");
				for (const failure of result.failures) {
					console.error(failure.error || failure.message);
				}
				console.log("----------------------------------------------------");
				repeat = true;
			}
		} catch (error) {
			console.error("Unexpected error:", error);
			repeat = true;
		} finally {
			console.log("✅ Component created successfully");
		}
		console.log("----------------------------------------------------");

		const { next } = await inquirer.prompt([
			{
				type: "list",
				name: "next",
				message: "What would you like to do next?",
				choices: [
					{ name: "🔁 Create another", value: "again" },
					{ name: "✏️  Edit the created file", value: "edit" },
					{ name: "🚪 Exit", value: "exit" },
				],
			},
		]);

		console.log(
			"-----------------------------------------------------------------------------------",
		);

		if (next === "edit") {
			console.log("Opening editor...");
			const folder = getFolderByType(answers);
			const fileName = getNameByType(answers);
			const path = `${folder}/${fileName}`;
			console.log(`Opening ${path}...`);
			openInEditor(path);
			repeat = true;
		} else if (next === "again") {
			repeat = true;
		} else {
			repeat = false;
		}
	}
};

main();
