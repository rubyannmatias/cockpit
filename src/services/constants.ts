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

export const ENVIRONMENT_KEYS = ['username', 'homedir', 'shell'];
export const TEMP_PATH = 'cockpit-temp';

export enum OpenAIModels {
  gpt4 = 'gpt-4',
  gpt35Turbo = 'gpt-3.5-turbo'
};

/* eslint-why Based on OpenAI API Doc - https://platform.openai.com/docs/api-reference/chat/create */
/* eslint-disable @typescript-eslint/naming-convention */
export interface IOpenAIChatCompletionParams {
  model: OpenAIModels,
  message: Array<string>,
  // Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic.
  temperature?: number,
  'max_tokens'?: number,
  // An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass.
  // So 0.1 means only the tokens comprising the top 10% probability mass are considered.
  'top_p'?: number,
  stop?: string | Array<string>, // Up to 4 sequences where the API will stop generating further tokens.
  frequency_penalty?: number,
  presence_penalty?: number,
  n?: number,
  stream?: boolean,
}

export const openAIChatCompletionCreateDefaults: Partial<IOpenAIChatCompletionParams> = {
  model: OpenAIModels.gpt35Turbo,
  temperature: 0,
  'max_tokens': 1000,
  'top_p': 0.2,
  stop: ["`"],
  frequency_penalty: 0,
  presence_penalty: 0,
  n: 1,
};
/* eslint-enable @typescript-eslint/naming-convention */

export enum OperatingSystemsEnum {
  windows = "Windows",
  linux = "Linux",
  macOS = "macOS",
  other = "Other"
}