#!/usr/bin/env node

import { Command } from 'commander';

import packageJson from '../package.json';
import { ensureKeyAsync } from './ensureKey';
import { executeAsync } from './execute';

const program = new Command();

program
  .version(packageJson.version)
  .option('-d --debug', 'output extra debugging information', false)
  .argument('<prompts...>', 'Ask what you want')
  .action(async (prompts: string[], options: Record<string, string | boolean>) => {
    await ensureKeyAsync();

    const debug = options.debug ? true : false;
    await executeAsync(prompts.join(' '), debug);
  });

program.parse(process.argv);
