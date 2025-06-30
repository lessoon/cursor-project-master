/**
 * @cpm/cli - Official CLI tool for Cursor Project Master
 * 
 * This package provides command-line tools for creating and managing
 * CPM (Cursor Project Master) projects.
 */

export { initCommand } from './commands/init';
export { kanbanCommand } from './commands/kanban';
export { createProject, ProjectConfig } from './utils/template';
export { validateProjectName, isDirectoryEmpty, getDefaultProjectName } from './utils/validation';

// Re-export version for programmatic use
import { version } from '../package.json';
export { version }; 