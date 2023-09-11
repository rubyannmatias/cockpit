import { getDirectoryList, getPlatformInfo, getUserInfo } from "../../../utils/envUtils";
import { platform } from "os";
import assert = require("assert");
import { OperatingSystemsEnum } from "../../../services/constants";

suite('Environment Util Test Suite', () => {
	test('Sample test to check platform', async () => {
		const platform = getPlatformInfo();
		assert(Object.values(OperatingSystemsEnum).includes(platform));
	});

	test('Sample test to check getUserInfo', async () => {
		var userInfo = getUserInfo(getPlatformInfo());
		var userInfoData = userInfo.split('\n');
		assert.equal(userInfoData.length, 4);
		assert(userInfoData[0]);
		assert(userInfoData[1]);
		assert(userInfoData[2]);
		assert.notEqual(userInfoData[0].length, 0);
		assert(userInfoData[0].includes('USER'));
		assert.notEqual(userInfoData[1].length, 0);
		assert(userInfoData[1].includes('HOME'));
		assert.notEqual(userInfoData[2].length, 0);
		assert(userInfoData[2].includes('SHELL'));
		assert.equal(userInfoData[3].length, 0);
	});

	test('Sample test to getDirectoryList', async () => {
		var directory = getDirectoryList(process.cwd());
		assert(directory);
	});
});
