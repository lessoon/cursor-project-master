import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';

export interface ProjectConfig {
  name: string;
  description: string;
  author: string;
  template: string;
  targetPath: string;
}

/**
 * Get the template directory path
 */
function getTemplateDir(): string {
  // Get current file directory
  const currentDir = path.dirname(__filename);
  
  // In production, templates will be in the npm package
  const packageDir = path.join(currentDir, '../../');
  const templatesDir = path.join(packageDir, 'templates');
  
  if (fs.existsSync(templatesDir)) {
    return templatesDir;
  }
  
  // Fallback for development - use the current project as template
  const devTemplateDir = path.join(currentDir, '../../../');
  return devTemplateDir;
}

/**
 * Copy template files to target directory
 */
async function copyTemplateFiles(templatePath: string, targetPath: string): Promise<void> {
  const excludePatterns = [
    'node_modules',
    'package-lock.json',
    'yarn.lock',
    'pnpm-lock.yaml',
    '.git',
    '.next',
    'dist',
    'build',
    '.turbo',
    '.vercel',
    '.env',
    '.env.local',
    'cli', // Don't copy the CLI package itself
    '*.log',
    '.DS_Store',
    'Thumbs.db'
  ];

  const shouldExclude = (filePath: string): boolean => {
    const relativePath = path.relative(templatePath, filePath);
    return excludePatterns.some(pattern => {
      if (pattern.includes('*')) {
        const regex = new RegExp(pattern.replace(/\*/g, '.*'));
        return regex.test(relativePath);
      }
      return relativePath.includes(pattern);
    });
  };

  const copyRecursive = async (src: string, dest: string): Promise<void> => {
    try {
      const stat = await fs.stat(src);
      
      if (stat.isFile()) {
        if (!shouldExclude(src)) {
          await fs.ensureFile(dest);
          await fs.copy(src, dest, { overwrite: true, preserveTimestamps: true });
          // Debug log for critical files
          if (src.includes('api-client.ts')) {
            console.log(chalk.gray(`✓ Copied: ${path.relative(templatePath, src)}`));
          }
        }
      } else if (stat.isDirectory()) {
        if (!shouldExclude(src)) {
          await fs.ensureDir(dest);
          const items = await fs.readdir(src);
          
          for (const item of items) {
            const srcPath = path.join(src, item);
            const destPath = path.join(dest, item);
            await copyRecursive(srcPath, destPath);
          }
        }
      }
    } catch (error) {
      console.warn(chalk.yellow(`Warning: Failed to copy ${src}: ${error}`));
    }
  };

  await copyRecursive(templatePath, targetPath);
}

/**
 * Replace template variables in files
 */
async function replaceTemplateVariables(targetPath: string, config: ProjectConfig): Promise<void> {
  const replaceInFile = async (filePath: string): Promise<void> => {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      let newContent = content
        .replace(/{{PROJECT_NAME}}/g, config.name)
        .replace(/{{PROJECT_DESCRIPTION}}/g, config.description)
        .replace(/{{AUTHOR_NAME}}/g, config.author)
        .replace(/{{CURRENT_YEAR}}/g, new Date().getFullYear().toString());

      // Replace package.json name specifically
      if (path.basename(filePath) === 'package.json') {
        try {
          const packageJson = JSON.parse(content);
          packageJson.name = config.name;
          packageJson.description = config.description;
          packageJson.author = config.author;
          newContent = JSON.stringify(packageJson, null, 2);
        } catch (e) {
          // If JSON parsing fails, fall back to string replacement
          console.warn(chalk.yellow(`Warning: Could not parse ${filePath} as JSON`));
        }
      }

      if (newContent !== content) {
        await fs.writeFile(filePath, newContent, 'utf8');
      }
    } catch (err) {
      console.warn(chalk.yellow(`Warning: Could not process file ${filePath}`));
    }
  };

  const processDirectory = async (dirPath: string): Promise<void> => {
    const items = await fs.readdir(dirPath);
    
    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      const stat = await fs.stat(itemPath);
      
      if (stat.isFile()) {
        // Only process text files
        const ext = path.extname(item).toLowerCase();
        const textExtensions = ['.md', '.json', '.ts', '.tsx', '.js', '.jsx', '.txt', '.yml', '.yaml'];
        
        if (textExtensions.includes(ext) || !ext) {
          await replaceInFile(itemPath);
        }
      } else if (stat.isDirectory() && item !== 'node_modules') {
        await processDirectory(itemPath);
      }
    }
  };

  await processDirectory(targetPath);
}

/**
 * Create a new CPM project
 */
export async function createProject(config: ProjectConfig): Promise<void> {
  const templateDir = getTemplateDir();
  
  console.log(chalk.gray(`Using template from: ${templateDir}`));
  
  // Copy template files
  await copyTemplateFiles(templateDir, config.targetPath);
  
  // Validate critical files were copied
  const criticalFiles = [
    'kanban/lib/api-client.ts',
    'kanban/package.json',
    'kanban/tsconfig.json'
  ];
  
  for (const file of criticalFiles) {
    const filePath = path.join(config.targetPath, file);
    if (!await fs.pathExists(filePath)) {
      // Silently restore missing critical files
      const sourcePath = path.join(templateDir, file);
      if (await fs.pathExists(sourcePath)) {
        await fs.ensureFile(filePath);
        await fs.copy(sourcePath, filePath, { overwrite: true });
        // Only log if in debug mode
        if (process.env.DEBUG) {
          console.log(chalk.gray(`✓ Restored: ${file}`));
        }
      }
    }
  }
  
  // Replace template variables
  await replaceTemplateVariables(config.targetPath, config);
  
  // Create .env.example if it doesn't exist
  const envExamplePath = path.join(config.targetPath, '.env.example');
  if (!await fs.pathExists(envExamplePath)) {
    const envContent = `# Environment variables for ${config.name}
# Copy this file to .env and fill in your values

# Database
DATABASE_URL="your-database-url"

# Authentication
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"

# AI API Keys
GEMINI_API_KEY="your-gemini-api-key"

# Deployment
VERCEL_TOKEN="your-vercel-token"
`;
    await fs.writeFile(envExamplePath, envContent);
  }
  
  // Create required directories that might not exist in template
  const requiredDirs = [
    'project/tasks/todo',
    'project/tasks/in_progress', 
    'project/tasks/done',
    'project/tasks/backlog',    // Fixed: use backlog instead of review
    'docs/_templates'
  ];
  
  for (const dir of requiredDirs) {
    const dirPath = path.join(config.targetPath, dir);
    if (!await fs.pathExists(dirPath)) {
      await fs.ensureDir(dirPath);
      console.log(chalk.green(`✓ Created: ${dir}`));
    }
  }
  
  console.log(chalk.green('✅ Project files copied and configured'));
} 