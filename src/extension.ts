// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { fetchShellCommand } from './services/cockpit';

require('dotenv').config();

const terminal = vscode.window.createTerminal();

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	require('dotenv').config();
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "cockpit" is now active yay!');

	let disposables: Array<vscode.Disposable> = [];
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	disposables.push(vscode.commands.registerCommand('cockpit.welcome', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Welcome to your Cockpit!');
	}));

	disposables.push(vscode.commands.registerCommand('cockpit.execute', async () => {
		// The code you place here will be executed every time your command is executed
		// Execute command string in shell
		terminal.sendText('echo Finding shell command');
		// const answer = await fetchShellCommand('Check working directory');
		const answer = await fetchShellCommand('List all files in the directory with permissions');
		console.log(answer);
		terminal.sendText(answer); // Uncomment this if you want the shell command to be run in terminal as-is
	}));

	context.subscriptions.concat(disposables);
}

// This method is called when your extension is deactivated
export function deactivate() {
	terminal.dispose();
}
