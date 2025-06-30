# @cpm/cli Setup Guide

This guide will help you build, test, and publish the `@cpm/cli` npm package.

## Prerequisites

- Node.js 16+ installed
- npm account for publishing (optional)

## Step 1: Install Dependencies

```bash
cd cli
npm install
```

This will install all the required dependencies:
- `commander` - CLI framework
- `chalk` - Terminal colors and styling
- `fs-extra` - Enhanced file system utilities
- `inquirer` - Interactive command line prompts
- `ora` - Terminal spinners
- `semver` - Semantic versioning utilities

## Step 2: Build the Package

```bash
npm run build
```

This compiles the TypeScript code to JavaScript in the `dist/` directory.

## Step 3: Test Locally

Link the package for local testing:

```bash
npm link
```

Now you can test the CLI from anywhere:

```bash
# Test the CLI
cpm --help
cpm init --help

# Test initialization in a temporary directory
mkdir /tmp/test-cpm
cd /tmp/test-cpm
cpm init
```

## Step 4: Publish to npm (Optional)

1. **Login to npm:**
   ```bash
   npm login
   ```

2. **Publish the package:**
   ```bash
   npm publish --access public
   ```

   Note: Since this is a scoped package (`@cpm/cli`), you need the `--access public` flag.

## Development Workflow

### Making Changes

1. Edit source files in `src/`
2. Run `npm run build` to compile
3. Test with `cpm` command (if linked)

### Watch Mode

For continuous development:

```bash
npm run dev
```

This runs TypeScript in watch mode, rebuilding when files change.

### Testing

```bash
npm test
```

(Note: Test files need to be created in `src/__tests__/` or with `.test.ts` suffix)

## File Structure

```
cli/
├── src/
│   ├── commands/
│   │   └── init.ts          # Init command implementation
│   ├── utils/
│   │   ├── template.ts      # Project template handling
│   │   └── validation.ts    # Input validation
│   ├── cli.ts              # Main CLI entry point
│   └── index.ts            # Package exports
├── dist/                   # Compiled JavaScript (generated)
├── package.json            # Package configuration
├── tsconfig.json          # TypeScript configuration
├── jest.config.js         # Testing configuration
└── README.md              # Package documentation
```

## Usage After Installation

Once published, users can use:

```bash
# Global installation
npm install -g @cpm/cli
cpm init

# Or direct usage with npx
npx @cpm/cli init
```

## Troubleshooting

### Permission Issues

If you get permission errors when linking:
```bash
sudo npm link
```

### Build Errors

If TypeScript compilation fails:
1. Check `tsconfig.json` configuration
2. Ensure all dependencies are installed
3. Check for syntax errors in source files

### Publish Errors

If publishing fails:
1. Make sure you're logged in: `npm whoami`
2. Check if package name is available: `npm info @cpm/cli`
3. Ensure version number is updated in `package.json`

## Next Steps

1. Add comprehensive tests in `src/__tests__/`
2. Add more CLI commands (status, task management)
3. Enhance template system with more options
4. Add CI/CD pipeline for automated publishing 