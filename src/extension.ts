// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { fetchShellCommand, fetchAnswers } from './services/cockpit';
import { STORE_KEY_SHELL_SEARCH, STORE_KEY_ANYTHING_SEARCH } from './services/constants';
import { getPastSearches } from './utils/storeUtils';

require('dotenv').config();

const terminal = vscode.window.createTerminal();

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	const store = context.globalState;
	const shellCmdSearchHistory = getPastSearches(STORE_KEY_SHELL_SEARCH, store);
	const anythingSearchHistory = getPastSearches(STORE_KEY_ANYTHING_SEARCH, store);

	console.log(shellCmdSearchHistory);
	console.log(anythingSearchHistory);

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
		const query = await vscode.window.showInputBox({
			placeHolder: 'Find Shell Command',
			prompt: 'Enter context or intended use of shell command to find',
			value: ''
		});

		if (query === '') {
			console.log(query);
			vscode.window.showErrorMessage('A search query is mandatory to execute this action');
		} else if (query !== undefined) {
			// Execute command string in shell
			terminal.show();
			terminal.sendText('echo Finding shell command...');
			const answer = await fetchShellCommand(query);
			console.log(answer);
			// terminal.sendText(`echo "${answer}"`);
			terminal.sendText(answer); // Uncomment this if you want the shell command to be run in terminal as-is
			shellCmdSearchHistory.push(query);
			store.update(
				STORE_KEY_SHELL_SEARCH,
				JSON.stringify(shellCmdSearchHistory.length > 5 ? shellCmdSearchHistory.splice(-5) : shellCmdSearchHistory)
			);
			// store.update(STORE_KEY_SHELL_SEARCH, undefined); // Uncomment this in case you need to clean store
		}
	}));

	disposables.push(vscode.commands.registerCommand('cockpit.ask', async () => {
		// The code you place here will be executed every time your command is executed
		const query = await vscode.window.showInputBox({
			placeHolder: 'Ask Anything',
			prompt: 'Enter question',
			value: ''
		});

		if (query === '') {
			console.log(query);
			vscode.window.showErrorMessage('A search query is mandatory to execute this action');
		} else if (query !== undefined) {
			// Execute command string in shell
			terminal.show();
			terminal.sendText('echo Finding answers for you...');
			const answer = await fetchAnswers(query);
			console.log(answer);
			terminal.sendText(`echo "${answer}" >> temp.txt`);
			terminal.sendText('open temp.txt');
			anythingSearchHistory.push(query);
			store.update(
				STORE_KEY_ANYTHING_SEARCH,
				JSON.stringify(anythingSearchHistory.length > 5 ? anythingSearchHistory.splice(-5) : anythingSearchHistory)
			);
			// store.update(STORE_KEY_ANYTHING_SEARCH, undefined); // Uncomment this in case you need to clean store
		}
	}));

	disposables.push(vscode.commands.registerCommand('cockpit.history', async () => {
		// The code you place here will be executed every time your command is executed
		const selection = await vscode.window.showQuickPick(['shell', 'anything'], {
			placeHolder: 'Show history for which type',
		});

		console.log(selection);

		if (selection) {
			const showForShell = selection === 'shell';
			// The code you place here will be executed every time your command is executed
			const query = await vscode.window.showQuickPick(showForShell ? [  ...shellCmdSearchHistory ] : [ ...anythingSearchHistory ], {
				placeHolder: `Pick from previous ${showForShell ? 'shell command' : 'anything'} searches`,
			});

			console.log(query);

			if (query === undefined) {
				vscode.window.showErrorMessage('A search query is mandatory to execute this action');
			} else if (query.length > 0) {
				// Execute command string in shell
				terminal.show();
				terminal.sendText(showForShell ? 'echo Finding shell command...' : 'echo Finding answers for you...');
				const answer = showForShell ? await fetchShellCommand(query) : await fetchAnswers(query);
				console.log(answer);
				// terminal.sendText(`echo "${answer}"`);
				if (showForShell) {
					// terminal.sendText(`echo "${answer}"`);
					terminal.sendText(answer); // Uncomment this if you want the shell command to be run in terminal as-is
				} else {
					terminal.sendText(`echo "${answer}" >> temp.txt`);
					terminal.sendText('open temp.txt');
				}
			}
		}
	}));

	context.subscriptions.concat(disposables);
}

// This method is called when your extension is deactivated
export function deactivate() {
	terminal.dispose();
}
