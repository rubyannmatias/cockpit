// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { fetchShellCommand, fetchAnswers } from './services/cockpit';
import { STORE_KEY_SHELL_SEARCH, STORE_KEY_ANYTHING_SEARCH, OPENAI_API_KEY_STORE_KEY } from './services/constants';
import { getPastSearches } from './utils/storeUtils';

require('dotenv').config();

const terminal = vscode.window.createTerminal();

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// Set context as a global as some tests depend on it
	(global as any).testExtensionContext = context;
	const store = context.globalState;
	const secretStorage = context.secrets;
	let shellCmdSearchHistory = getPastSearches(STORE_KEY_SHELL_SEARCH, store);
	let anythingSearchHistory = getPastSearches(STORE_KEY_ANYTHING_SEARCH, store);

	console.log(shellCmdSearchHistory);
	console.log(anythingSearchHistory);

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log(vscode.l10n.t('Congratulations, your extension "cockpit" is now active yay!'));

	let disposables: Array<vscode.Disposable> = [];
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	disposables.push(vscode.commands.registerCommand('cockpit.welcome', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage(vscode.l10n.t('Welcome to your Cockpit!'));
	}));

	disposables.push(vscode.commands.registerCommand('cockpit.configure', async () => {
		// The code you place here will be executed every time your command is executed
		const apiKey = await vscode.window.showInputBox({
			placeHolder: vscode.l10n.t('Enter your OpenAI API key for secret storage here'),
			prompt: vscode.l10n.t('A valid OpenAI API key is required for the extension to use the AI'),
			value: ''
		});

		if (apiKey === '') {
			vscode.window.showErrorMessage(vscode.l10n.t('A valid OpenAI API key is required for the extension to use the AI'));
		} else if (apiKey !== undefined) {
			await secretStorage.store(OPENAI_API_KEY_STORE_KEY, apiKey);
			vscode.window.showInformationMessage(vscode.l10n.t('Your OpenAI API key has been stored safely'));
			// secretStorage.get(OPENAI_API_KEY_STORE_KEY).then((value) => console.log(value));
		}
	}));

	disposables.push(vscode.commands.registerCommand('cockpit.execute', async () => {
		// The code you place here will be executed every time your command is executed
		const query = await vscode.window.showInputBox({
			placeHolder: vscode.l10n.t('Find Shell Command'),
			prompt: vscode.l10n.t('Enter context or intended use of shell command to find'),
			value: ''
		});

		if (query === '') {
			vscode.window.showErrorMessage(vscode.l10n.t('A search query is mandatory to execute this action'));
		} else if (query !== undefined) {
			vscode.window.withProgress(
				{
					location: vscode.ProgressLocation.Notification,
					title: vscode.l10n.t('Finding shell command for you...'),
					cancellable: false,
				},
				async (progress, token) => {
					token.onCancellationRequested(() => {
						console.log(vscode.l10n.t('User canceled the long running operation'));
					});

					// Execute command string in shell
					const answer = await fetchShellCommand(query, secretStorage);
					console.log(answer);
					vscode.window.showInformationMessage(vscode.l10n.t('Click to run the shell command "{0}"', answer), answer, 'Copy to clipboard', vscode.l10n.t('Cancel'))
						.then((value) => {
							if (value === answer) {
								// Execute command string in shell
								terminal.show();
								terminal.sendText(answer);
							} else if (value === vscode.l10n.t('Copy to clipboard')) {
								terminal.sendText(`echo '${answer}' | pbcopy`);
							}
						});
					
						
					// Add search to previous searches
					shellCmdSearchHistory.push(query);
					await store.update(
						STORE_KEY_SHELL_SEARCH,
						JSON.stringify(shellCmdSearchHistory.length > 5 ? shellCmdSearchHistory.splice(-5) : shellCmdSearchHistory)
					);
					shellCmdSearchHistory = getPastSearches(STORE_KEY_SHELL_SEARCH, store);
					// store.update(STORE_KEY_SHELL_SEARCH, undefined); // Uncomment this in case you need to clean store
				},
			);
		}
	}));

	disposables.push(vscode.commands.registerCommand('cockpit.ask', async () => {
		terminal.sendText('rm temp.txt;');
		// The code you place here will be executed every time your command is executed
		const query = await vscode.window.showInputBox({
			placeHolder: vscode.l10n.t('Ask Anything'),
			prompt: vscode.l10n.t('Enter question'),
			value: ''
		});

		if (query === '') {
			console.log(query);
			vscode.window.showErrorMessage(vscode.l10n.t('A search query is mandatory to execute this action'));
		} else if (query !== undefined) {
			vscode.window.withProgress(
				{
					location: vscode.ProgressLocation.Notification,
					title: vscode.l10n.t('Finding answers for you...'),
					cancellable: false,
				},
				async (progress, token) => {
					token.onCancellationRequested(() => {
						console.log(vscode.l10n.t('User canceled the long running operation'));
					});

					// Execute command string in shell
					const answer = await fetchAnswers(query, secretStorage);
					console.log(answer);
					terminal.sendText(`echo "${answer}" >> temp.txt`);
					terminal.sendText('open temp.txt');
					anythingSearchHistory.push(query);
					await store.update(
						STORE_KEY_ANYTHING_SEARCH,
						JSON.stringify(anythingSearchHistory.length > 5 ? anythingSearchHistory.splice(-5) : anythingSearchHistory)
					);
					anythingSearchHistory = getPastSearches(STORE_KEY_ANYTHING_SEARCH, store);
					// store.update(STORE_KEY_ANYTHING_SEARCH, undefined); // Uncomment this in case you need to clean store
				},
			);
		}
	}));

	disposables.push(vscode.commands.registerCommand('cockpit.history', async () => {
		terminal.sendText('rm temp.txt;');
		// The code you place here will be executed every time your command is executed
		const selection = await vscode.window.showQuickPick(['shell', 'anything'], {
			placeHolder: vscode.l10n.t('Show history for which type'),
		});

		console.log(selection);

		if (selection) {
			const showForShell = selection === 'shell';
			// The code you place here will be executed every time your command is executed
			const query = await vscode.window.showQuickPick(showForShell ? [  ...shellCmdSearchHistory ] : [ ...anythingSearchHistory ], {
				placeHolder: `${vscode.l10n.t('Pick from previous {0} searches', showForShell ? 'shell command' : 'anything')}`,
			});

			console.log(query);

			if (query === undefined) {
				vscode.window.showErrorMessage(vscode.l10n.t('A search query is mandatory to execute this action'));
			} else if (query.length > 0) {
				vscode.window.withProgress(
					{
						location: vscode.ProgressLocation.Notification,
						title: showForShell ? vscode.l10n.t('Finding shell command for you...') : vscode.l10n.t('Finding answers for you...'),
						cancellable: false,
					},
					async (progress, token) => {
						token.onCancellationRequested(() => {
							console.log(vscode.l10n.t('User canceled the long running operation'));
						});

						const answer = showForShell ? await fetchShellCommand(query, secretStorage) : await fetchAnswers(query, secretStorage);
						console.log(answer);

						if (answer.length) {
							if (showForShell) {
								vscode.window.showInformationMessage(vscode.l10n.t('Click to run the shell command "{0}"', answer), answer, vscode.l10n.t('Copy to clipboard'), vscode.l10n.t('Cancel'))
									.then((value) => {
										console.log(value);
										console.log(vscode.l10n.t('Copy to clipboard'));
										if (value === answer) {
											// Execute command string in shell
											terminal.show();
											terminal.sendText(answer);
										} else if (value === vscode.l10n.t('Copy to clipboard')) {
											terminal.sendText(`echo '${answer}' | pbcopy`);
										}
									});
							} else {
								terminal.sendText(`echo "${answer}" >> temp.txt`);
								terminal.sendText('open temp.txt');
							}
						}
					},
				);
			}
		}
	}));

	context.subscriptions.concat(disposables);
}

// This method is called when your extension is deactivated
export function deactivate() {
	terminal.dispose();
}
