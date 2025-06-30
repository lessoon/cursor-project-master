import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs-extra';
import path from 'path';
import { spawn } from 'child_process';

interface KanbanOptions {
  port?: number;
  install?: boolean;
}

/**
 * Setup and start the Kanban board
 */
async function setupKanban(projectPath: string, options: KanbanOptions): Promise<void> {
  const kanbanPath = path.join(projectPath, 'kanban');
  
  if (!fs.existsSync(kanbanPath)) {
    console.log(chalk.red('❌ Kanban directory not found.'));
    console.log(chalk.yellow('Make sure you are in a CPM project directory.'));
    return;
  }

  // Check if package.json exists
  const packageJsonPath = path.join(kanbanPath, 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    console.log(chalk.red('❌ Kanban package.json not found.'));
    return;
  }

  // Install dependencies if requested or if node_modules doesn't exist
  const nodeModulesPath = path.join(kanbanPath, 'node_modules');
  const shouldInstall = options.install || !fs.existsSync(nodeModulesPath);

  if (shouldInstall) {
    const installSpinner = ora('Installing Kanban dependencies...').start();
    
    try {
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

      installSpinner.succeed('Dependencies installed successfully!');
    } catch (error) {
      installSpinner.fail('Failed to install dependencies');
      console.error(chalk.red('Error:'), error);
      return;
    }
  }

  // Start the dev server
  console.log(chalk.cyan('\n🚀 Starting Kanban board...'));
  const port = options.port || 3000;
  console.log(chalk.gray(`Server will start on port ${port}`));
  console.log(chalk.gray('Press Ctrl+C to stop the server.\n'));

  try {
    const devServer = spawn('npm', ['run', 'dev'], {
      cwd: kanbanPath,
      stdio: 'inherit',
      env: { ...process.env, PORT: port.toString() },
    });

    // Handle server startup
    setTimeout(async () => {
      const url = `http://localhost:${port}`;
      console.log(chalk.green(`\n📊 Kanban board should be running at: ${url}`));
      
      // Auto-open browser
      try {
        const open = await import('open');
        await open.default(url);
        console.log(chalk.gray('📱 Opened in browser automatically'));
      } catch (error) {
        console.log(chalk.gray('💡 Please open the URL above in your browser'));
      }
    }, 3000);

    // Handle process termination
    process.on('SIGINT', () => {
      console.log(chalk.yellow('\n⏹️  Stopping Kanban server...'));
      devServer.kill();
      process.exit(0);
    });

  } catch (error) {
    console.error(chalk.red('❌ Failed to start Kanban server:'), error);
  }
}

export async function kanbanCommand(options: KanbanOptions): Promise<void> {
  try {
    console.log(chalk.blue('📊 Setting up Kanban board...\n'));

    const currentDir = process.cwd();
    await setupKanban(currentDir, options);

  } catch (error) {
    console.error(chalk.red('❌ Error setting up Kanban:'), error);
    process.exit(1);
  }
} 