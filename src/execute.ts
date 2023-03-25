/* eslint-disable no-console */
import axios from 'axios';
import chalk from 'chalk';
import { spawnSync } from 'child_process';
import os from 'os';

import { readStdinAsync } from './utils';

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

const commandExtractor = /```\w*\s*(\S[^`]*\S)\s*```/g;

export const executeAsync = async (prompt: string) => {
  const osPlatform = os.platform();
  if (!PlatformOSMapping[osPlatform]) {
    console.error(chalk.red(`aicmd does not support your OS: ${osPlatform}`));
    return;
  }
  const osName = PlatformOSMapping[osPlatform];

  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'You can only respond with a single-line shell command in a single code block. ' +
            'Do not write anything outside of the code block.',
        },
        { role: 'user', content: `Write a shell command that can complete the following task on ${osName}: ${prompt}` },
      ],
      temperature: 0.5,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    },
  );

  if (response.status === 200) {
    const chatResponse = response.data as ChatResponse;
    const chatResponseContent = chatResponse.choices[0].message.content;
    const commandMatch = commandExtractor.exec(chatResponseContent);
    if (commandMatch) {
      const command = commandMatch[1];
      console.log(chalk.green(command));
      const answer = await readStdinAsync('Execute the command above? [y/N]');
      if (answer === 'y') {
        spawnSync(command, { shell: true, stdio: 'inherit' });
      }
    }
  } else {
    console.error(chalk.red('No confident solution found.'));
  }
};
