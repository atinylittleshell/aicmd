/* eslint-disable no-console */
import appDirs from 'appdirsjs';
import fs from 'fs';
import ollama from 'ollama';
import path from 'path';

import { printAsciiArtAsync, readStdinAsync } from './utils.js';

export const ensureModelAsync = async () => {
  if (process.env.AICMD_MODEL) {
    return;
  }

  const dirs = appDirs.default({ appName: 'aicmd' });

  // if model file exists then read the key from it
  const modelFile = path.join(dirs.config, 'model.txt');
  if (fs.existsSync(modelFile)) {
    process.env.AICMD_MODEL = fs.readFileSync(modelFile, 'utf-8').trim();
  }
  if (process.env.AICMD_MODEL) {
    return;
  }

  // otherwise, read from stdin
  await printAsciiArtAsync('aicmd');

  // make sure ollama is available
  try {
    const ollamaResponse = await ollama.list();

    console.log('Available Ollama models:');
    ollamaResponse.models.forEach((model) => {
      console.log(`- ${model.name}`);
    });

    const userInputModel = await readStdinAsync('Please specify the Ollama model to use (e.g. llama3): ');
    if (!userInputModel) {
      console.error('You must configure which Ollama model to use.');
      process.exit(1);
    }

    if (
      ollamaResponse.models.filter(
        (model) => model.name === userInputModel || model.name === `${userInputModel}:latest`,
      ).length === 0
    ) {
      throw Error(`Model ${userInputModel} is not found in your Ollama.`);
    }

    process.env.AICMD_MODEL = userInputModel;

    // persist model to modelFile
    fs.mkdirSync(dirs.config, {
      recursive: true,
    });
    fs.writeFileSync(modelFile, process.env.AICMD_MODEL, 'utf-8');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
