# Changelog

All notable changes to the `@cpm/cli` package will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2024-12-30

### 🎉 Added  
- **Auto-open browser**: Kanban board now automatically opens in your default browser when started
- **Streamlined init process**: Removed project description prompt for faster setup

### 🔄 Changed
- **Package name**: Changed from `@cpm/cli` to `@project-master-ai/cli` 
- **Quieter setup**: Reduced verbose output during project creation - missing files are silently restored
- **Better UX**: Cleaner, faster project initialization experience

### 🐛 Fixed
- **Missing directory error**: Fixed "ENOENT: no such file or directory, scandir 'backlog'" error by updating Kanban code to use `backlog` directory instead of `review`. The root project renamed `review` to `backlog` but the Kanban application was still looking for the old `review` directory.

## [1.1.1] - 2024-12-30

### 🐛 Fixed
- **Missing directory error**: Fixed "ENOENT: no such file or directory, scandir 'backlog'" error by updating Kanban code to use `backlog` directory instead of `review`. The root project renamed `review` to `backlog` but the Kanban application was still looking for the old `review` directory.

## [1.1.0] - 2024-06-30

### 🎉 Added
- **New `kanban` command**: Setup and start Kanban board directly with `cpm kanban`
- **Automatic Kanban setup**: Option to start Kanban immediately after project initialization
- **Port customization**: Use `--port` option to run Kanban on different ports
- **Force dependency reinstall**: Use `--install` flag to force reinstall Kanban dependencies
- **CLI Development Guide**: Added `CLI_DEV_README.md` for future development and refinements

### 🔄 Changed
- **Default template**: Changed from "Default" to "Minimal" as the recommended template
- **Template naming**: Renamed templates for better clarity:
  - "Minimal (Basic CPM structure only) - Recommended" 
  - "Full (Next.js + Prisma + Tailwind + shadcn/ui + Supabase)"
- **Enhanced user experience**: Better success messages based on Kanban setup choice
- **Improved documentation**: Updated README with new features and options

### 🐛 Fixed
- **ES Module compatibility**: Fixed `ERR_REQUIRE_ESM` error by using inquirer v8.x
- **Module resolution**: Fixed `__dirname` issue in template.ts
- **TypeScript errors**: Resolved type safety issues with optional parameters

### 📚 Documentation
- Added comprehensive CLI development guide
- Updated main README with new commands and options
- Added changelog for version tracking
- Enhanced setup instructions

## [1.0.0] - 2024-06-30

### 🎉 Initial Release
- **Project initialization**: `cpm init` command for creating CPM projects
- **Interactive prompts**: Project name, description, author, and template selection
- **Template system**: Support for Minimal and Full project templates
- **Input validation**: Project name validation according to npm standards
- **Error handling**: Comprehensive error messages and graceful failures
- **Beautiful CLI**: Colored output with spinners and progress indicators
- **TypeScript support**: Full TypeScript implementation with type definitions

### 📦 Features
- Template copying with variable replacement
- Environment file generation
- Cross-platform compatibility
- NPM package support with `npx` usage
- Comprehensive documentation and setup guides 