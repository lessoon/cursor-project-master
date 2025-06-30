import fs from 'fs-extra';
import path from 'path';

/**
 * Validate project name according to npm package naming rules
 */
export function validateProjectName(name: string): boolean | string {
  if (!name) {
    return 'Project name is required';
  }

  if (name.length > 214) {
    return 'Project name must be less than 214 characters';
  }

  if (name.toLowerCase() !== name) {
    return 'Project name must be lowercase';
  }

  if (/[~'!()*]/.test(name)) {
    return 'Project name cannot contain special characters';
  }

  if (name.startsWith('.') || name.startsWith('_')) {
    return 'Project name cannot start with . or _';
  }

  if (/^[._]/.test(name)) {
    return 'Project name cannot start with . or _';
  }

  if (!/^[a-z0-9@\-_.]+$/.test(name)) {
    return 'Project name can only contain lowercase letters, numbers, @, -, _, and .';
  }

  return true;
}

/**
 * Check if directory is empty (ignoring .git and common hidden files)
 */
export function isDirectoryEmpty(dirPath: string): boolean {
  try {
    const files = fs.readdirSync(dirPath);
    
    // Filter out allowed files that don't count as "content"
    const allowedFiles = [
      '.git',
      '.gitignore', 
      '.DS_Store',
      'Thumbs.db',
      '.vscode',
      '.idea',
      'README.md',
      'LICENSE',
      '.env.example'
    ];

    const significantFiles = files.filter(file => 
      !allowedFiles.includes(file) && !file.startsWith('.env')
    );

    return significantFiles.length === 0;
  } catch (err) {
    // If we can't read the directory, assume it's not empty for safety
    return false;
  }
}

/**
 * Get the default project name from current directory
 */
export function getDefaultProjectName(): string {
  const currentDir = process.cwd();
  return path.basename(currentDir);
} 