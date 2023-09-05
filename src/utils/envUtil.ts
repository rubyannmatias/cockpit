/*
 **************************************************************************
 * Licensed Materials - Property of HCL                                   *
 *                                                                        *
 * Copyright HCL Technologies Ltd. 2023. All Rights Reserved.             *
 *                                                                        *
 * Note to US Government Users Restricted Rights:                         *
 *                                                                        *
 * Use, duplication or disclosure restricted by GSA ADP Schedule          *
 **************************************************************************
 */
import * as os from 'os';
import * as fsPromises from 'fs/promises';
import { ENVIRONMENT_KEYS, OperatingSystemsEnum } from '../services/constants';

export const getUserInfo = (operatingSystem: OperatingSystemsEnum): string => {
  const userInfo = os.userInfo();
  let environmentKeysStr = '';

  Object.keys(userInfo).forEach((key) => {
    if (ENVIRONMENT_KEYS.includes(key)) {
      switch (key) {
        case 'username':
          environmentKeysStr += `USER=${userInfo[key]}\n`;
          break;
        case 'homedir':
          environmentKeysStr += `HOME=${userInfo[key]}\n`;
          break;
        case 'shell':
          if (operatingSystem === OperatingSystemsEnum.windows) {
            environmentKeysStr += `SHELL=cmd\n`;
          } else {
            environmentKeysStr += `SHELL=${userInfo[key]}\n`;
          }
          break;
        default:
          break;
      }
    }
  });

  return environmentKeysStr;
};

export const getPlatformInfo = () => {
  const platform = process.platform.toLowerCase();
  let operatingSystem = OperatingSystemsEnum.other;

  switch (platform) {
    case 'darwin':
      operatingSystem = OperatingSystemsEnum.macOS;
      break;
    case 'linux':
      operatingSystem = OperatingSystemsEnum.linux;
    default:
      if (platform.startsWith('win')) {
        operatingSystem = OperatingSystemsEnum.windows;
      }
      break;
  }

  return operatingSystem;
};

export const getDirectoryList = async (path: string): Promise<string> => {
  let list = '';

  try {
    const files = await fsPromises.readdir(path);
    list = files.join(', ').substring(0, 300);
  } catch (e) {
    console.log(e);
  }
  
  return list;
};