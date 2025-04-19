export const promptName = {
	type: "input",
	name: "name",
	message: (answers) => {
		console.log(
			"-----------------------------------------------------------------------------------",
		);
		console.log("Name without extension.");
		if (answers.type === "page") {
			console.log("Generator adds 'Page' at the end of the name");
			console.log(
				"Example: if you name it 'home', it will generate 'homePage.*'",
			);
		}
		if (answers.type === "hook") {
			console.log("Generator adds 'use' at the beginning of the name");
			console.log(
				"Example: if you name it 'loading', it will generate 'use-loading'",
			);
		}
		if (answers.type === "service") {
			console.log(
				"Only provide the base name, the rest will be generated automatically",
			);
			console.log(
				"Example: if you name it 'user', it will generate 'userService.*'",
			);
		}
		console.log("-------------------------------------------");
		return "💬 [Name]:";
	},
	validate: (value) => (value ? true : "The name is required"),
};
