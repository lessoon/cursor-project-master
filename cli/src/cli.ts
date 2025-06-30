#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { initCommand } from './commands/init';
import { kanbanCommand } from './commands/kanban';
import { version } from '../package.json';

const program = new Command();

// CLI Header
console.log(chalk.blue.bold(`
 ██████╗██████╗ ███╗   ███╗     ██████╗██╗     ██╗
██╔════╝██╔══██╗████╗ ████║    ██╔════╝██║     ██║
██║     ██████╔╝██╔████╔██║    ██║     ██║     ██║
██║     ██╔═══╝ ██║╚██╔╝██║    ██║     ██║     ██║
╚██████╗██║     ██║ ╚═╝ ██║    ╚██████╗███████╗██║
 ╚═════╝╚═╝     ╚═╝     ╚═╝     ╚═════╝╚══════╝╚═╝
`));

console.log(chalk.cyan('🚀 Cursor Project Master CLI'));
console.log(chalk.gray('Transform ideas into production-ready applications\n'));

program
  .name('cpm')
  .description('Official CLI for Cursor Project Master - AI-native project generator')
  .version(version, '-v, --version', 'Output the current version');

// Initialize command
program
  .command('init')
  .description('Initialize a new CPM project in the current directory')
  .option('-n, --name <name>', 'Project name')
  .option('-t, --template <template>', 'Template type', 'default')
  .option('-f, --force', 'Force initialization even if directory is not empty')
  .action(initCommand);

// Add more commands here in the future
program
  .command('status')
  .description('Show project status and task progress')
  .action(() => {
    console.log(chalk.yellow('📊 Status command coming soon...'));
  });

program
  .command('kanban')
  .description('Setup and start the Kanban board')
  .option('-p, --port <port>', 'Port to run the server on', '3000')
  .option('-i, --install', 'Force reinstall dependencies')
  .action(kanbanCommand);

program
  .command('task')
  .description('Manage project tasks')
  .action(() => {
    console.log(chalk.yellow('📋 Task management coming soon...'));
  });

// Parse CLI arguments
program.parse();

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
} 