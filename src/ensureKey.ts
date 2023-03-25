import appDirs from 'appdirsjs';
import fs from 'fs';
import path from 'path';
import * as readline from 'readline';

const readKeyAsync = (): Promise<string> => {
  return new Promise((resolve) => {
    const readlineInterface = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    readlineInterface.question(
      'Please enter your OpenAI API key. You can find it here: https://platform.openai.com/account/api-keys. ',
      (key) => {
        readlineInterface.close();
        resolve(key);
      },
    );
  });
};

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
  process.env.OPENAI_API_KEY = await readKeyAsync();
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
