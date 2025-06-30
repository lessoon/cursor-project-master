# @cpm/cli

Official CLI tool for **Cursor Project Master (CPM)** - Transform your ideas into production-ready applications with AI-native project management.

## Installation

```bash
npm install -g @cpm/cli
# or
npx @cpm/cli init
```

## Usage

### Initialize a new CPM project

```bash
# Interactive mode
npx @cpm/cli init

# With options
npx @cpm/cli init --name my-project --force

# Help
npx @cpm/cli --help
```

### Available Commands

- `init` - Initialize a new CPM project in the current directory
- `kanban` - Setup and start the Kanban board
- `status` - Show project status and task progress (coming soon)
- `task` - Manage project tasks (coming soon)

### Init Options

- `-n, --name <name>` - Project name
- `-t, --template <template>` - Template type (default: 'minimal')
- `-f, --force` - Force initialization even if directory is not empty

### Kanban Options

- `-p, --port <port>` - Port to run the server on (default: 3000)
- `-i, --install` - Force reinstall dependencies

## What gets created

When you run `npx @cpm/cli init`, you get a complete CPM project structure:

```
my-project/
├── .cursor/rules/           # AI agent rules and behaviors
├── docs/                    # Project documentation
│   └── _templates/          # Document templates to fill
│       ├── PRD.md          # Product Requirements Document
│       ├── TECH_SPEC.md    # Technical Specifications
│       ├── DATA_MAP.md     # Data Structure Mapping
│       ├── UX_FLOW.md      # User Experience Flow
│       └── STYLE_GUIDE.md  # Design System & Style Guide
├── kanban/                  # Visual Kanban board (Next.js app)
├── project/                 # Project management
│   ├── _templates/         # Task and planning templates
│   ├── tasks/              # Kanban-style task management
│   └── project_status.md   # Real-time project status
├── scripts/                 # Utility scripts
└── README.md               # Project documentation
```

## Next Steps

1. **Fill in the documentation templates** in `docs/_templates/`:
   - `PRD.md` - Define what you want to build
   - `TECH_SPEC.md` - Choose your tech stack
   - `DATA_MAP.md` - Map your data structure
   - `UX_FLOW.md` - Design user interactions
   - `STYLE_GUIDE.md` - Set visual guidelines

2. **Open in Cursor IDE** and activate the AI agent

3. **Type `"init"`** to let CPM start building your project

4. **Monitor progress**:
   - Check `project/project_status.md` for updates
   - Run `cd kanban && npm run dev` for visual Kanban board

## Templates

### Minimal Template (Default)
- **Tech Stack**: Basic CPM structure only
- **Features**: Essential CPM files with Kanban board
- **Best for**: Most projects, fast setup, customizable foundation

### Full Template
- **Tech Stack**: Next.js + Prisma + Tailwind CSS + shadcn/ui + Supabase
- **Features**: Complete web application stack with CPM integration
- **Best for**: Web applications needing full-stack foundation

## Development

```bash
# Clone and setup
git clone https://github.com/heyzgj/cursor-project-master.git
cd cursor-project-master/cli

# Install dependencies
npm install

# Build
npm run build

# Test locally
npm link
cpm init --help
```

## Publishing

```bash
npm run build
npm publish
```

## Features

- 🚀 **One-command setup** - Get a complete CPM project instantly
- 📋 **Interactive prompts** - Guided project configuration
- 🎨 **Multiple templates** - Choose the right starting point
- 📝 **Documentation-driven** - Structured approach to requirements
- 🤖 **AI-ready** - Built for Cursor IDE and AI agents
- 📊 **Visual management** - Integrated Kanban board

## License

MIT - see LICENSE file for details

## Support

- [GitHub Issues](https://github.com/heyzgj/cursor-project-master/issues)
- [Documentation](https://github.com/heyzgj/cursor-project-master#readme)
- [CPM Project](https://github.com/heyzgj/cursor-project-master) 