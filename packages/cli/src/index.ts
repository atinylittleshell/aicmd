#!/usr/bin/env node

import { Command } from 'commander';
import { readFileSync } from 'fs';
import path from 'path';
import updateNofier from 'update-notifier';
import { fileURLToPath } from 'url';

import { ensureKeyAsync } from './ensureKey.js';
import { executeAsync } from './execute.js';

const packageJson = JSON.parse(
  readFileSync(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../package.json'), 'utf-8'),
);

const program = new Command();

program
  .version(packageJson.version)
  .option('-d --debug', 'output extra debugging information', false)
  .argument('<prompts...>', 'Ask what you want')
  .action(async (prompts: string[], options: Record<string, string | boolean>) => {
    updateNofier({
      pkg: packageJson,
      updateCheckInterval: 1000 * 60 * 60, // 1 hour cooldown
    }).notify();

    await ensureKeyAsync();

    const debug = options.debug ? true : false;
    await executeAsync(prompts.join(' '), debug);
  });

program.parse(process.argv);
