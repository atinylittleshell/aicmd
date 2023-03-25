#!/usr/bin/env node

import { Command } from 'commander';

import packageJson from '../package.json';
import { ensureKeyAsync } from './ensureKey';
import { executeAsync } from './execute';

const program = new Command();

program
  .version(packageJson.version)
  .argument('<prompts...>', 'Ask what you want')
  .action(async (prompts: string[]) => {
    await ensureKeyAsync();
    await executeAsync(prompts.join(' '));
  });

program.parse(process.argv);
