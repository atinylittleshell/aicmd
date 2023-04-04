import appDirs from 'appdirsjs';
import fs from 'fs';
import path from 'path';

import { printAsciiArtAsync, readStdinAsync } from './utils.js';

export const ensureKeyAsync = async () => {
  if (process.env.AICMD_ACCESS_TOKEN) {
    return;
  }

  const dirs = appDirs.default({ appName: 'aicmd' });

  // if key file exists then read the key from it
  const keyFile = path.join(dirs.config, 'aicmd_access_token.txt');
  if (fs.existsSync(keyFile)) {
    process.env.AICMD_ACCESS_TOKEN = fs.readFileSync(keyFile, 'utf-8').trim();
  }
  if (process.env.AICMD_ACCESS_TOKEN) {
    return;
  }

  // otherwise, read from stdin
  await printAsciiArtAsync('aicmd');

  process.env.AICMD_ACCESS_TOKEN = await readStdinAsync(
    'Get your access token from [https://aicmd.app/get_key] and paste it here: ',
  );
  if (!process.env.AICMD_ACCESS_TOKEN) {
    console.error('You must provide a valid access token in order to use aicmd.');
    process.exit(1);
  }

  // persist key to keyFile
  fs.mkdirSync(dirs.config, {
    recursive: true,
  });
  fs.writeFileSync(keyFile, process.env.AICMD_ACCESS_TOKEN, 'utf-8');
};
