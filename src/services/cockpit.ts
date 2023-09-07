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
import * as path from 'path';
import { OpenAI } from 'openai';
import { OpenAIModels, openAIChatCompletionCreateDefaults } from './constants';
import { getUserInfo, getPlatformInfo, getDirectoryList } from '../utils/envUtils';

require('dotenv').config({ path: path.resolve(__dirname, '../..', '.env') });

export const fetchShellCommand = async (strCmd: string): Promise<string> => {
  let response = '';
  const operatingSystem = getPlatformInfo();
  const environmentKeysStr = getUserInfo(operatingSystem);
  const directoryList = await getDirectoryList(process.cwd());
  
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const query = `
    You are an AI Terminal Copilot\n
    Your job is to help users find the right terminal command in a ${os.userInfo()['shell']} on ${operatingSystem}\n
    The user is currently in the following directory: ${process.cwd()}\n
    That directory contains the following files: ${directoryList}\n
    The user has several environment variables set, some of which are: ${environmentKeysStr}\n
    The user is asking for the following command: ${strCmd}\n
    ONLY OUTPUT THE COMMAND. No description, no explanation, no nothing.
    Do not add any text in front of it and do not add any text after it.
  `;

  try {
    const chatCompletion = await openai.chat.completions.create({
      ...openAIChatCompletionCreateDefaults,
      model: OpenAIModels.gpt35Turbo,
      messages: [{"role": "assistant", "content": `${query}`}],
      stream: false,
    });

    console.log(chatCompletion.choices);

    response = chatCompletion.choices[0].message.content || '';
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      console.error(error.status);
      console.error(error.message);
      console.error(error.code);
      console.error(error.type);
    } else {
      // Non-API error
      console.log(error);
    }
  }
  
  return response;
};

export const fetchAnswers = async (question: string): Promise<string> => {
  let response = '';
  
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const chatCompletion = await openai.chat.completions.create({
      ...openAIChatCompletionCreateDefaults,
      model: OpenAIModels.gpt35Turbo,
      messages: [{"role": "user", "content": `${question}. Please stringify the answer to this question.`}],
      stream: false,
    });

    console.log(chatCompletion.choices);

    response = chatCompletion.choices[0].message.content || '';
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      console.error(error.status);
      console.error(error.message);
      console.error(error.code);
      console.error(error.type);
    } else {
      // Non-API error
      console.log(error);
    }
  }
  
  return response;
};