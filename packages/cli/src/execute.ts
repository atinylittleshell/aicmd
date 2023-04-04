/* eslint-disable no-console */
import axios from 'axios';
import chalk from 'chalk';
import { spawnSync } from 'child_process';
import os from 'os';

import { GetCommandRequest, GetCommandResponse } from './types.js';
import { getCurrentShellAsync, readStdinAsync } from './utils.js';

export const executeAsync = async (prompt: string, debug: boolean) => {
  const osPlatform = os.platform();
  if (osPlatform !== 'darwin' && osPlatform !== 'linux' && osPlatform !== 'win32') {
    console.log(chalk.red(`aicmd does not support your OS: ${osPlatform}`));
    return;
  }
  const shellInfo = await getCurrentShellAsync();

  const requestPayload: GetCommandRequest = {
    prompt,
    context: {
      osInfo: {
        platform: osPlatform,
      },
      shellInfo,
    },
  };
  if (debug) {
    console.log(chalk.yellow('Request:'));
    console.log(chalk.yellow(JSON.stringify(requestPayload, null, 2)));
  }

  const response = await axios.post('https://aicmd.app/api/get_command', requestPayload, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer AICMD ${process.env.AICMD_ACCESS_TOKEN}`,
    },
  });
  if (debug) {
    console.log(chalk.yellow('Response:'));
    console.log(chalk.yellow(JSON.stringify(response.data, null, 2)));
  }

  if (response.status === 200) {
    const getCommandResponse = response.data as GetCommandResponse;

    const command = getCommandResponse.command;
    console.log(chalk.green(command));
    const answer = await readStdinAsync('Execute the command above? [y/N] ');
    if (answer === 'y') {
      spawnSync(command, { shell: shellInfo ? shellInfo.shell : true, stdio: 'inherit' });
    }
  } else {
    console.log(chalk.red('No confident solution found.'));
  }
};
