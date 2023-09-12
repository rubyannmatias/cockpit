import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';

suite('Extension Test Suite', () => {

	test('Can find extension registered commands', async () => {
		// Trigger extension activation
		await vscode.extensions.getExtension('playground-lgb.cockpit')?.activate();  // Publisher.extension-name - 'playground-lgb.cockpit'
		const cmds = await vscode.commands.getCommands(true);
		const expectCommands = [
			'cockpit.welcome',
			'cockpit.execute',
			'cockpit.ask',
			'cockpit.history',
		];
		const findExtensionCommands = cmds.filter((command) => { return command.startsWith('cockpit'); });
		assert.deepEqual(findExtensionCommands, expectCommands);
	});

});