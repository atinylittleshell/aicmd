/* eslint-disable no-console */
import chalk from 'chalk';
import { spawnSync } from 'child_process';
import ollama from 'ollama';
import os from 'os';

import { CommandContext, GetCommandRequest, GetCommandResponse } from './types.js';
import { getCurrentShellAsync, getGitInfoAsync, OSPlatformMapping, readStdinAsync } from './utils.js';

const getCommandAsync = async (prompt: string, context: CommandContext): Promise<GetCommandResponse> => {
  const requestPayload = {
    model: process.env.AICMD_MODEL || '',
    messages: [
      {
        role: 'system',
        content:
          'You are aicmd, a shell command assistant. You will be asked to help generate shell commands. ' +
          'You can only respond with a single-line shell command in a single code block. ' +
          'Do not write anything outside of the code block.',
      },
      {
        role: 'user',
        content: `# Context
Operating system: ${OSPlatformMapping[context.osInfo.platform]}
${context.shellInfo ? 'Shell: ' + context.shellInfo.displayName : ''}

# Task
Write a shell command that can complete the following task: ${prompt}

# Response
Please return a valid JSON object with the following structure:
\`\`\`
{
  "command": "put the command you wrote here"
}
\`\`\``,
      },
    ],
    format: 'json',
    options: {
      temperature: 0.2,
    },
  };

  const response = await ollama.chat(requestPayload);
  return JSON.parse(response.message.content) as GetCommandResponse;
};

export const executeAsync = async (prompt: string, debug: boolean) => {
  const osPlatform = os.platform();
  if (osPlatform !== 'darwin' && osPlatform !== 'linux' && osPlatform !== 'win32') {
    console.log(chalk.red(`aicmd does not support your OS: ${osPlatform}`));
    return;
  }
  const shellInfo = await getCurrentShellAsync();
  const gitInfo = await getGitInfoAsync();

  const requestPayload: GetCommandRequest = {
    prompt,
    context: {
      osInfo: {
        platform: osPlatform,
      },
      shellInfo,
      gitInfo,
    },
  };
  if (debug) {
    console.log(chalk.yellow('Request:'));
    console.log(chalk.yellow(JSON.stringify(requestPayload, null, 2)));
  }

  const response = await getCommandAsync(prompt, requestPayload.context);
  if (debug) {
    console.log(chalk.yellow('Response:'));
    console.log(chalk.yellow(JSON.stringify(response, null, 2)));
  }

  if (response.command) {
    const command = response.command;
    console.log(chalk.green(command));
    const answer = await readStdinAsync('Execute the command above? [y/N] ');
    if (answer === 'y') {
      spawnSync(command, { shell: shellInfo ? shellInfo.shell : true, stdio: 'inherit' });
    }
  } else {
    console.log(chalk.red('No confident solution found.'));
  }
};
