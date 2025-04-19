export const promptHttp = {
	type: "list",
	name: "http",
	message: (answers) => {
		console.log("-------------------------------------------");
		console.log("GET, POST, PUT, PATCH, DELETE");
		console.log("-------------------------------------------");
		return "🖥️  [http Method]:";
	},
	when: (answers) => answers.type === "service",
	choices: ["GET", "POST", "PUT", "PATCH", "DELETE"],
	default: "GET",
	validate: (value, answers) => {
		if (
			answers.type === "service" &&
			!["GET", "POST", "PUT", "PATCH", "DELETE"].includes(value)
		) {
			return "The http method must be GET, POST, PUT, PATCH or DELETE (uppercase)";
		}
		return value !== "" ? true : "The http method is required";
	},
};
