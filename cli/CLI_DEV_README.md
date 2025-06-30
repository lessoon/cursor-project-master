# CPM CLI Development Guide

This document provides guidance for developing and refining the `@cpm/cli` package.

## 🎯 Current Features

### ✅ Implemented
- **Project Initialization**: `cpm init` - Creates complete CPM project structure
- **Kanban Setup**: `cpm kanban` - Automatically installs and starts the Kanban board
- **Template Selection**: Minimal (default) vs Full template options
- **Interactive Prompts**: Project name, description, author, template choice
- **Automatic Kanban Launch**: Option to start Kanban immediately after project creation
- **Input Validation**: Project name validation according to npm standards
- **Error Handling**: Comprehensive error messages and graceful failures

### 🚧 Planned Features
- **Status Command**: `cpm status` - Show project progress and task status
- **Task Management**: `cpm task` - Create, update, and manage tasks
- **Template Management**: Custom templates and template marketplace
- **Project Analytics**: Usage tracking and productivity metrics

## 📁 Architecture

```
cli/
├── src/
│   ├── commands/           # Command implementations
│   │   ├── init.ts        # Project initialization
│   │   └── kanban.ts      # Kanban board management
│   ├── utils/             # Utility functions
│   │   ├── template.ts    # Template handling
│   │   └── validation.ts  # Input validation
│   ├── cli.ts            # Main CLI entry point
│   └── index.ts          # Package exports
├── package.json          # Package configuration
├── tsconfig.json         # TypeScript configuration
└── README.md            # User documentation
```

## 🔧 Development Workflow

### Setup
```bash
cd cli
npm install
npm run build
npm link  # For local testing
```

### Making Changes
1. Edit source files in `src/`
2. Run `npm run build` to compile
3. Test with `cpm` command (if linked)
4. Update version in `package.json` before publishing

### Testing
```bash
# Local testing
mkdir /tmp/test-project && cd /tmp/test-project
cpm init --name test-project

# Test Kanban command
cpm kanban --port 3001
```

## 📋 Future Refinements

### High Priority
1. **Enhanced Error Handling**
   - Better network error handling for npm operations
   - Rollback functionality if project creation fails
   - More descriptive error messages

2. **Template System Improvements**
   - Template versioning and updates
   - Custom template support from Git repositories
   - Template validation and testing

3. **Performance Optimizations**
   - Parallel file operations
   - Incremental project updates
   - Caching for faster subsequent operations

### Medium Priority
1. **Status Command Implementation**
   ```bash
   cpm status
   # Shows:
   # - Current project phase
   # - Task completion percentage
   # - Recent activity
   # - Kanban board status
   ```

2. **Task Management Features**
   ```bash
   cmp task create "Implement user authentication"
   cpm task list
   cpm task complete T-123
   cpm task assign T-123 @developer
   ```

3. **Configuration Management**
   - Global CLI configuration file
   - Project-specific settings
   - Template preferences

### Low Priority
1. **Advanced Features**
   - Plugin system for extensibility
   - Integration with external project management tools
   - AI-powered task suggestions
   - Team collaboration features

## 🐛 Known Issues

### Current Limitations
1. **Windows Compatibility**: File path handling may need adjustment for Windows
2. **Port Conflicts**: Kanban setup doesn't check for port availability
3. **Memory Usage**: Large projects may consume significant memory during copying
4. **Network Dependencies**: Requires internet connection for npm operations

### Workarounds
- **Port Conflicts**: Use `cpm kanban --port 3001` to specify different port
- **Large Projects**: Use `--minimal` template for faster setup
- **Offline Usage**: Pre-install dependencies in template

## 📊 Metrics & Analytics

### Success Metrics
- Time from `cpm init` to first successful build
- User adoption of automatic Kanban setup
- Template preference distribution
- Error rates and common failure points

### Tracking Considerations
- Respect user privacy (no personal data collection)
- Optional anonymous usage statistics
- Performance benchmarking data

## 🤝 Contributing Guidelines

### Code Style
- Use TypeScript with strict mode
- Follow existing naming conventions
- Add JSDoc comments for public functions
- Include error handling for all async operations

### Testing Requirements
- Add unit tests for new utility functions
- Test CLI commands with real project creation
- Verify compatibility across Node.js versions
- Test error scenarios and edge cases

### Pull Request Process
1. Create feature branch from `main`
2. Implement changes with tests
3. Update documentation
4. Test locally with `npm link`
5. Submit PR with clear description

## 🔄 Version Management

### Semantic Versioning
- **Patch** (1.0.x): Bug fixes, minor improvements
- **Minor** (1.x.0): New features, backward compatible
- **Major** (x.0.0): Breaking changes, major redesigns

### Release Process
1. Update version in `package.json`
2. Update `CHANGELOG.md` with changes
3. Build and test: `npm run build && npm test`
4. Publish: `npm publish --access public`
5. Tag release in Git
6. Update documentation

## 📚 Resources

### Dependencies
- [Commander.js](https://github.com/tj/commander.js/) - CLI framework
- [Inquirer.js](https://github.com/SBoudrias/Inquirer.js/) - Interactive prompts
- [Chalk](https://github.com/chalk/chalk) - Terminal colors
- [fs-extra](https://github.com/jprichardson/node-fs-extra) - File operations
- [ora](https://github.com/sindresorhus/ora) - Terminal spinners

### References
- [Node.js CLI Best Practices](https://github.com/lirantal/nodejs-cli-apps-best-practices)
- [npm CLI Guidelines](https://docs.npmjs.com/cli/v8/using-npm/developers)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

*Last updated: 2024-06-30*
*Version: 1.0.0* 