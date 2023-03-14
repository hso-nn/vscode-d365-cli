// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

async function runTerminalCommand(command: any) {
	const terminals = vscode.window.terminals;
	if (!terminals.length) {
		let terminal = await vscode.window.createTerminal(`HSO D365 CLI Extension`);
		terminal.show();
		terminal.sendText(`${command}`)
	} else {
		terminals.map((a) => {
			if (a.name == 'HSO D365 CLI Extension') {
				a.show();
				a.sendText(`${command}`)
				return true;
			} else {
				a.show();
				a.sendText(`${command}`)
			}
		})
	}
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "hso-d365" is now active!');

	context.subscriptions.push(vscode.commands.registerCommand('hso-d365.install', async function () {

		const preferences = await vscode.window.showInformationMessage(
			"Which manager do you want to use?",
			"NPM",
			"Yarn",
		);
		if (preferences === "NPM") {

			await runTerminalCommand(`npm install -g @hso/d365-cli`);

		}
		if (preferences === "Yarn") {

			await runTerminalCommand(`yarn global add @hso/d365-cli`);
		}
		if (preferences == null) return;
	}));

	context.subscriptions.push(vscode.commands.registerCommand('hso-d365.updateCLI', async function () {

		const preferences = await vscode.window.showInformationMessage(
			"Which manager do you want to use?",
			"NPM",
			"Yarn",
		);
		if (preferences === "NPM") {

			await runTerminalCommand(`npm install -g @hso/d365-cli@latest`);

		}
		if (preferences === "Yarn") {

			await runTerminalCommand(`yarn global add @hso/d365-cli@latest`);
		}
		if (preferences == null) return;
	}));

	context.subscriptions.push(vscode.commands.registerCommand('hso-d365.version', async function () {

		await runTerminalCommand('hso-d365 -V');

	}));

	context.subscriptions.push(vscode.commands.registerCommand('hso-d365.newProject', async function () {
		const options: vscode.InputBoxOptions = {
			
			title: 'Whats is the name of the new project?'
		}
		const input: string | undefined = await vscode.window.showInputBox(options);
		
		if(input !== undefined) {
			await runTerminalCommand('hso-d365 new ' + input);
		}
	}));

	context.subscriptions.push(vscode.commands.registerCommand('hso-d365.generateEntity', async function () {
		let command = undefined;

		const options: vscode.InputBoxOptions = {
			
			title: 'Whats is the name of the new Entity?'
		}
		const input: string | undefined = await vscode.window.showInputBox(options);
		
		if(input !== undefined) {
			const answer = await vscode.window.showInformationMessage("Do you want to skip forms?", "Yes", "No");
			if(answer === "Yes"){
				command = 'hso-d365 generate Entity '+input+' --skipForms';
			}
			if(answer === "No"){
				command = 'hso-d365 generate Entity ' +input;
			}
			if(command !== undefined) {
				await runTerminalCommand(command);
			}
		}
	}));

	context.subscriptions.push(vscode.commands.registerCommand('hso-d365.generateWebresource', async function () {
		const options: vscode.InputBoxOptions = {
			
			title: 'Whats is the name of the new Webresource?'
		}
		const input: string | undefined = await vscode.window.showInputBox(options);
		
		if(input !== undefined) {
			await runTerminalCommand('hso-d365 generate Webresource ' + input);
		}
	}));

	context.subscriptions.push(vscode.commands.registerCommand('hso-d365.generateModel', async function () {
		const options: vscode.InputBoxOptions = {
			
			title: 'Whats is the name of the new Model?'
		}
		const input: string | undefined = await vscode.window.showInputBox(options);
		
		if(input !== undefined) {
			await runTerminalCommand('hso-d365 generate Model ' + input);
		}
	}));

	context.subscriptions.push(vscode.commands.registerCommand('hso-d365.generateGlobalOptionSets', async function () {
			await runTerminalCommand('hso-d365 generate GlobalOptionSets');
	}));

	context.subscriptions.push(vscode.commands.registerCommand('hso-d365.generateCustomApis', async function () {
		await runTerminalCommand('hso-d365 generate CustomApis');
	}));

	context.subscriptions.push(vscode.commands.registerCommand('hso-d365.generateLicenseValidator', async function () {
		await runTerminalCommand('hso-d365 generate LicenseValidator');
	}));


	context.subscriptions.push(vscode.commands.registerCommand('hso-d365.generateEnvironmentVariable', async function () {
		await runTerminalCommand('hso-d365 generate EnvironmentVariable');
	}));

	context.subscriptions.push(vscode.commands.registerCommand('hso-d365.regenerate', async function () {

		await runTerminalCommand('hso-d365 regenerate');

	}));

	context.subscriptions.push(vscode.commands.registerCommand('hso-d365.extractTranslations', async function () {

		await runTerminalCommand('hso-d365 extractTranslations');

	}));

	context.subscriptions.push(vscode.commands.registerCommand('hso-d365.lint', async function () {

		await runTerminalCommand('hso-d365 lint');

	}));

	context.subscriptions.push(vscode.commands.registerCommand('hso-d365.build', async function () {
		let command = undefined;

		const answer = await vscode.window.showInformationMessage("What mode do you want to build?", "DEV", "PRD");
		if(answer === "DEV"){
			command = 'hso-d365 build';

		}
		if(answer === "PRD"){
			command = 'hso-d365 build:prod';
		}

		if(command !== undefined) {
			await runTerminalCommand(command);
		}
	}));

	context.subscriptions.push(vscode.commands.registerCommand('hso-d365.deploy', async function () {
		let command = undefined;

		const answer = await vscode.window.showInformationMessage("Do you want to force update?", "Yes", "No");
		if(answer === "Yes"){
			command = 'hso-d365 deploy --force';

		}
		if(answer === "No"){
			command = 'hso-d365 deploy';
		}

		if(command !== undefined) {
			await runTerminalCommand(command);
		}
	}));

	context.subscriptions.push(vscode.commands.registerCommand('hso-d365.update', async function () {

		await runTerminalCommand('hso-d365 update');

	}));

	context.subscriptions.push(vscode.commands.registerCommand('hso-d365.setFormCustomizable', async function () {
		let command = undefined;

		const answer = await vscode.window.showInformationMessage("Set form customizable", "True", "False");
		if(answer === "True"){
			command = 'hso-d365 setFormCustomizable true';

		}
		if(answer === "False"){
			command = 'hso-d365 setFormCustomizable false';
		}

		if(command !== undefined) {
			await runTerminalCommand(command);
		}
	}));


	// // The command has been defined in the package.json file
	// // Now provide the implementation of the command with registerCommand
	// // The commandId parameter must match the command field in package.json
	// let disposable = vscode.commands.registerCommand('hso-d365.helloWorld', () => {
	// 	// The code you place here will be executed every time your command is executed
	// 	// Display a message box to the user
	// 	vscode.window.showInformationMessage('Hello World from hso-d365!');
	// });

	// context.subscriptions.push(installCLI, version, newProject);
} 

// This method is called when your extension is deactivated
export function deactivate() {}
