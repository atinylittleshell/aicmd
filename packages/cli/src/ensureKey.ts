import appDirs from 'appdirsjs';
import fs from 'fs';
import path from 'path';

import { readStdinAsync } from './utils';

export const ensureKeyAsync = async () => {
  if (process.env.OPENAI_API_KEY) {
    return;
  }

  const dirs = appDirs({ appName: 'aicmd' });

  // if key file exists then read the key from it
  const keyFile = path.join(dirs.config, 'key.txt');
  if (fs.existsSync(keyFile)) {
    process.env.OPENAI_API_KEY = fs.readFileSync(keyFile, 'utf-8').trim();
  }
  if (process.env.OPENAI_API_KEY) {
    return;
  }

  // otherwise, read from stdin
  process.env.OPENAI_API_KEY = await readStdinAsync(
    'Get your OpenAI API key from https://platform.openai.com/account/api-keys and enter your OpenAI API key here: ',
  );
  if (!process.env.OPENAI_API_KEY) {
    console.error('You must provide a valid OpenAI API key in order to use aicmd.');
    process.exit(1);
  }

  // persist key to keyFile
  fs.mkdirSync(dirs.config, {
    recursive: true,
  });
  fs.writeFileSync(keyFile, process.env.OPENAI_API_KEY, 'utf-8');
};
