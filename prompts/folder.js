import { kebabCase } from "../utils/helpers.js";
import loadConfig from "../utils/load-config.js";

const config = loadConfig();

export const promptFolder = {
	type: "input",
	name: "folder",
	message: (answers) => {
		console.log("------------------------------------------");
		if (answers.type === "page") {
			console.log(`The base path will be '${config.pages.base}'`);
			console.log(
				`Example 1: if you name it 'home', it will be created in '${config.pages.base}/home'`,
			);
			console.log(
				`Example 2: if you name it 'home/user', it will be created in '${config.pages.base}/home/user'`,
			);
		}
		if (answers.type === "component") {
			console.log(`The base path will be "${config.components}"`);

			if (config.config.atomic) {
				console.log("Select a category:");
				console.log("atoms, molecules, organisms, templates");
			}
		}
		console.log("------------------------------------------");
		return "📁 [Folder Path]:";
	},
	when: (answers) =>
		(config.config.atomic && answers.type === "component") ||
		answers.type === "page",
	choices: (answers) => {
		if (answers.type === "component" && config.config.atomic) {
			return ["atoms", "molecules", "organisms", "templates"];
		}
		return [];
	},
	default: (answers) => {
		if (answers.type === "page") {
			return kebabCase(answers.name);
		}
		if (answers.type === "component" && config.config.atomic) {
			return "atoms";
		}
		return "";
	},
	validate: (value, answers) => {
		if (config.config.atomic && answers.type === "component") {
			if (
				value !== "atoms" &&
				value !== "molecules" &&
				value !== "organisms" &&
				value !== "templates"
			) {
				return "The folder must be atoms, molecules, organisms, or templates";
			}
		}
		return value !== "" ? true : "The folder is required";
	},
};
