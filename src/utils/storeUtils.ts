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
 import * as vscode from 'vscode';

export const getPastSearches = (storeKey: string, store: vscode.Memento) => {
  let history = [];
  try {
		history = JSON.parse(store.get(storeKey) as string) || [];
	} catch (e) {
		history = [];
	}
  return history;
};