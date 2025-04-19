import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const loadConfig = () => {
	const DEFAULT_CONFIG = path.resolve(__dirname, "./default-folders.json");
	const USER_CONFIG = path.resolve(
		process.cwd(),
		"component-creator.config.json",
	);

	const defaultConfig = JSON.parse(fs.readFileSync(DEFAULT_CONFIG, "utf-8"));

	if (fs.existsSync(USER_CONFIG)) {
		const userConfig = JSON.parse(fs.readFileSync(USER_CONFIG, "utf-8"));
		return { ...defaultConfig, ...userConfig };
	}

	return defaultConfig;
};

export default loadConfig;
