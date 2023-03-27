/* eslint-disable no-console */
import axios from 'axios';
import chalk from 'chalk';
import { spawnSync } from 'child_process';
import os from 'os';

import { getCurrentShellAsync, readStdinAsync } from './utils';

type ChatResponse = {
  choices: {
    message: {
      role: string;
      content: string;
    };
  }[];
};

const PlatformOSMapping: Record<string, string> = {
  darwin: 'macOS',
  linux: 'Linux',
  win32: 'Windows',
};

const longCommandExtractor = /```\w*\s*(\S[^`]*\S)\s*```/g;
const shortCommandExtractor = /(?<!`)`([^`]+)`(?!`)/g;

export const executeAsync = async (prompt: string, debug: boolean) => {
  const osPlatform = os.platform();
  if (!PlatformOSMapping[osPlatform]) {
    console.log(chalk.red(`aicmd does not support your OS: ${osPlatform}`));
    return;
  }

  const osName = PlatformOSMapping[osPlatform];
  const shellInfo = await getCurrentShellAsync();

  if (debug) {
    console.log(chalk.yellow(`OS: ${osName}`));
    console.log(chalk.yellow(`Shell: ${JSON.stringify(shellInfo)}`));
  }

  const requestPayload = {
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content:
          'You can only respond with a single-line shell command in a single code block. ' +
          'Do not write anything outside of the code block.',
      },
      {
        role: 'user',
        content: `Write a ${
          shellInfo ? shellInfo.displayName : 'shell'
        } command that can complete the following task on ${osName}: ${prompt}`,
      },
    ],
    temperature: 0.2,
  };
  if (debug) {
    console.log(chalk.yellow('ChatGPT request:'));
    console.log(chalk.yellow(JSON.stringify(requestPayload, null, 2)));
  }

  const response = await axios.post('https://api.openai.com/v1/chat/completions', requestPayload, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
  });

  if (response.status === 200) {
    const chatResponse = response.data as ChatResponse;
    if (debug) {
      console.log(chalk.yellow('ChatGPT response:'));
      console.log(chalk.yellow(JSON.stringify(chatResponse, null, 2)));
    }

    const chatResponseContent = chatResponse.choices[0].message.content;
    // ChatGPT can return a multi-line code block, a single-line code block, or no code block at all.
    // The following logic deals with these different cases.
    let commandMatch: string[] | null = longCommandExtractor.exec(chatResponseContent);
    if (!commandMatch) {
      commandMatch = shortCommandExtractor.exec(chatResponseContent);
    }
    if (!commandMatch && !chatResponseContent.includes('`')) {
      // if the response doesn't even contain a code block at all, assume the whole response is a command
      commandMatch = ['', chatResponseContent];
    }

    if (commandMatch) {
      const command = commandMatch[1];
      console.log(chalk.green(command));
      const answer = await readStdinAsync('Execute the command above? [y/N] ');
      if (answer === 'y') {
        spawnSync(command, { shell: shellInfo ? shellInfo.shell : true, stdio: 'inherit' });
      }
    } else {
      console.log(chalk.red(chatResponseContent));
    }
  } else {
    console.log(chalk.red('No confident solution found.'));
  }
};
