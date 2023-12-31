import * as assert from 'assert';
import { ExtensionContext, extensions } from 'vscode';
import { STORE_KEY_ANYTHING_SEARCH, STORE_KEY_SHELL_SEARCH } from '../../../services/constants';
import { getPastSearches } from '../../../utils/storeUtils';

suite('vscode extension - globalState API', () => {

    let extensionContext: ExtensionContext;
    suiteSetup(async () => {
        // Trigger extension activation and grab the context as some tests depend on it
        await extensions.getExtension('playground-lgb.cockpit')?.activate(); // Publisher.extension-name - 'playground-lgb.cockpit'
    });

    test('Store util test', async () => {
        // Grab context here
        extensionContext = (global as any).testExtensionContext;
        const store = extensionContext.globalState;
        assert(store);
        const shellCmdSearchHistory = getPastSearches(STORE_KEY_SHELL_SEARCH, store);
        const anythingSearchHistory = getPastSearches(STORE_KEY_ANYTHING_SEARCH, store);
        assert(shellCmdSearchHistory);
        assert(anythingSearchHistory);
    });

});