import chalk from 'chalk';
import ora from 'ora';
import inquirer from 'inquirer';
import fs from 'fs-extra';
import path from 'path';
import { spawn } from 'child_process';
import { createProject } from '../utils/template';
import { validateProjectName, isDirectoryEmpty } from '../utils/validation';

interface InitOptions {
  name?: string;
  template?: string;
  force?: boolean;
}

/**
 * Setup and start the Kanban board
 */
async function setupKanban(projectPath: string): Promise<void> {
  const kanbanPath = path.join(projectPath, 'kanban');
  
  if (!fs.existsSync(kanbanPath)) {
    console.log(chalk.yellow('⚠️  Kanban directory not found, skipping kanban setup.'));
    return;
  }

  const setupSpinner = ora('Installing Kanban dependencies...').start();
  
  try {
    // Install dependencies
    await new Promise<void>((resolve, reject) => {
      const npm = spawn('npm', ['install', '--legacy-peer-deps'], {
        cwd: kanbanPath,
        stdio: ['pipe', 'pipe', 'pipe'],
      });

      let errorOutput = '';
      let output = '';

      npm.stdout?.on('data', (data) => {
        output += data.toString();
      });

      npm.stderr?.on('data', (data) => {
        errorOutput += data.toString();
      });

      npm.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          console.log(chalk.red('\n❌ npm install output:'));
          if (output) console.log(chalk.gray(output));
          if (errorOutput) console.log(chalk.red(errorOutput));
          reject(new Error(`npm install failed with code ${code}`));
        }
      });

      npm.on('error', (err) => {
        console.log(chalk.red('❌ Failed to start npm process:'), err.message);
        reject(err);
      });
    });

    setupSpinner.succeed('Kanban dependencies installed!');

    // Start the dev server
    console.log(chalk.cyan('\n🚀 Starting Kanban board...'));
    console.log(chalk.gray('Press Ctrl+C to stop the server when done.\n'));

    const devServer = spawn('npm', ['run', 'dev'], {
      cwd: kanbanPath,
      stdio: 'inherit',
    });

    // Handle server startup and auto-open browser
    setTimeout(async () => {
      const url = 'http://localhost:3000';
      console.log(chalk.green(`📊 Kanban board is running at: ${url}`));
      console.log(chalk.gray('The server will continue running in the background.\n'));
      
      // Auto-open browser
      try {
        const open = await import('open');
        await open.default(url);
        console.log(chalk.gray('📱 Opened in browser automatically\n'));
      } catch (error) {
        console.log(chalk.gray('💡 Please open the URL above in your browser\n'));
      }
    }, 3000);

  } catch (error) {
    setupSpinner.fail('Failed to setup Kanban board');
    console.log(chalk.yellow('⚠️  You can manually setup Kanban later with:'));
    console.log(chalk.white('   cd kanban && npm install && npm run dev'));
  }
}

export async function initCommand(options: InitOptions): Promise<void> {
  try {
    console.log(chalk.blue('🚀 Initializing new CPM project...\n'));

    // Get current directory
    const currentDir = process.cwd();
    const currentDirName = path.basename(currentDir);

    // Check if directory is empty
    if (!options.force && !isDirectoryEmpty(currentDir)) {
      const { proceed } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'proceed',
          message: 'Current directory is not empty. Continue anyway?',
          default: false,
        },
      ]);

      if (!proceed) {
        console.log(chalk.yellow('❌ Initialization cancelled.'));
        return;
      }
    }

    // Get project name
    let projectName: string;
    if (options.name) {
      projectName = options.name;
    } else {
      const { name } = await inquirer.prompt([
        {
          type: 'input',
          name: 'name',
          message: 'Project name:',
          default: currentDirName,
          validate: validateProjectName,
        },
      ]);
      projectName = name;
    }

    // Validate project name
    const validationResult = validateProjectName(projectName);
    if (validationResult !== true) {
      console.log(chalk.red(`❌ ${validationResult}`));
      return;
    }

    // Get additional project info (removed description step)
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'author',
        message: 'Author name:',
        default: 'Your Name',
      },
      {
        type: 'list',
        name: 'template',
        message: 'Choose template:',
        choices: [
          { name: 'Minimal (Basic CPM structure only) - Recommended', value: 'minimal' },
          { name: 'Full (Next.js + Prisma + Tailwind + shadcn/ui + Supabase)', value: 'default' },
        ],
        default: 'minimal',
      },
      {
        type: 'confirm',
        name: 'setupKanban',
        message: 'Setup and start Kanban board immediately?',
        default: true,
      },
    ]);
    
    // Set default description
    const description = `A new CPM project: ${projectName}`;

    const spinner = ora('Creating project structure...').start();

    try {
      // Create the project
      await createProject({
        name: projectName,
        description: description,
        author: answers.author,
        template: answers.template,
        targetPath: currentDir,
      });

      spinner.succeed('Project structure created successfully!');

      // Setup Kanban if requested
      if (answers.setupKanban) {
        await setupKanban(currentDir);
      }

      // Show success message
      console.log(chalk.green.bold('\n✅ CPM project initialized successfully!\n'));
      
      console.log(chalk.cyan('📋 Next steps:'));
      console.log(chalk.white('1. Fill in the document templates in ' + chalk.yellow('docs/_templates/')));
      console.log(chalk.white('   • ' + chalk.yellow('PRD.md') + ' - Product requirements'));
      console.log(chalk.white('   • ' + chalk.yellow('TECH_SPEC.md') + ' - Technical specifications'));
      console.log(chalk.white('   • ' + chalk.yellow('DATA_MAP.md') + ' - Data structure'));
      console.log(chalk.white('   • ' + chalk.yellow('UX_FLOW.md') + ' - User experience flow'));
      console.log(chalk.white('   • ' + chalk.yellow('STYLE_GUIDE.md') + ' - Design system'));

      console.log(chalk.white('\n2. Open the project in Cursor IDE'));
      console.log(chalk.white('3. Type ' + chalk.yellow('"init"') + ' to let CPM start building your project'));

      console.log(chalk.white('\n4. Monitor progress:'));
      console.log(chalk.white('   • Check ' + chalk.yellow('project/project_status.md') + ' for updates'));
      
      if (answers.setupKanban) {
        console.log(chalk.white('   • View live Kanban at ' + chalk.yellow('http://localhost:3000') + ' (should be running now!)'));
      } else {
        console.log(chalk.white('   • Start Kanban with: ' + chalk.yellow('cd kanban && npm install && npm run dev')));
        console.log(chalk.white('   • Then view at ' + chalk.yellow('http://localhost:3000')));
      }

      console.log(chalk.green('\n🎉 Happy building with CPM!'));

    } catch (error) {
      spinner.fail('Failed to create project');
      throw error;
    }

  } catch (error) {
    console.error(chalk.red('❌ Error initializing project:'), error);
    process.exit(1);
  }
} 