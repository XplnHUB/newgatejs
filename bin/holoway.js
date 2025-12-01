#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const COMMANDS = {
  create: 'Create a new Holoway project',
  help: 'Show help information',
  version: 'Show version'
};

function showHelp() {
  console.log(`
Holoway CLI - Multi-format Backend Framework

Usage:
  holoway <command> [options]

Commands:
  create <name>     Create a new Holoway project
  help              Show this help message
  version           Show version information

Examples:
  holoway create my-api
  holoway help
  holoway version
`);
}

function showVersion() {
  const packagePath = path.join(__dirname, '../package.json');
  const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
  console.log(`Holoway v${pkg.version}`);
}

function createProject(projectName) {
  const projectPath = path.join(process.cwd(), projectName);

  // Check if directory already exists
  if (fs.existsSync(projectPath)) {
    console.error(`Error: Directory "${projectName}" already exists`);
    process.exit(1);
  }

  // Create project directory
  fs.mkdirSync(projectPath, { recursive: true });

  // Create src directory structure
  fs.mkdirSync(path.join(projectPath, 'src'), { recursive: true });
  fs.mkdirSync(path.join(projectPath, 'src', 'routes'), { recursive: true });
  fs.mkdirSync(path.join(projectPath, 'src', 'middleware'), { recursive: true });

  // Create package.json
  const packageJson = {
    name: projectName,
    version: '1.0.0',
    description: 'Holoway API',
    type: 'module',
    main: 'src/index.js',
    scripts: {
      start: 'node src/index.js',
      dev: 'node --watch src/index.js',
      test: 'vitest'
    },
    dependencies: {
      holoway: '^1.0.0'
    },
    devDependencies: {
      vitest: '^1.6.1'
    }
  };

  fs.writeFileSync(
    path.join(projectPath, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );

  // Create main app file
  const appCode = `import App from 'holoway';

const app = new App();

// Middleware
app.use((req, res, next) => {
  console.log(\`[\${new Date().toISOString()}] \${req.method} \${req.url}\`);
  next();
});

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to ${projectName}' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.useError((err, req, res, next) => {
  console.error(err);
  res.status(500).error({
    message: 'Internal Server Error',
    code: 500
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});
`;

  fs.writeFileSync(path.join(projectPath, 'src', 'index.js'), appCode);

  // Create .gitignore
  const gitignore = `node_modules/
npm-debug.log
.env
.env.local
.DS_Store
dist/
build/
*.log
`;

  fs.writeFileSync(path.join(projectPath, '.gitignore'), gitignore);

  // Create README
  const readme = `# ${projectName}

An Holoway API project.

## Getting Started

### Installation

\`\`\`bash
npm install
\`\`\`

### Development

\`\`\`bash
npm run dev
\`\`\`

### Production

\`\`\`bash
npm start
\`\`\`

## API Endpoints

- \`GET /\` - Welcome message
- \`GET /health\` - Health check

## Environment Variables

- \`PORT\` - Server port (default: 3000)

## Documentation

For more information about Holoway, visit: https://github.com/XplnHUB/holoway
`;

  fs.writeFileSync(path.join(projectPath, 'README.md'), readme);

  console.log(`Project "${projectName}" created successfully!`);
  console.log(`\nNext steps:`);
  console.log(`  cd ${projectName}`);
  console.log(`  npm install`);
  console.log(`  npm run dev`);
}

// Main CLI logic
const args = process.argv.slice(2);
const command = args[0];

if (!command || command === 'help' || command === '--help' || command === '-h') {
  showHelp();
} else if (command === 'version' || command === '--version' || command === '-v') {
  showVersion();
} else if (command === 'create') {
  const projectName = args[1];
  if (!projectName) {
    console.error('Error: Project name is required');
    console.error('Usage: holoway create <project-name>');
    process.exit(1);
  }
  createProject(projectName);
} else {
  console.error(`Error: Unknown command "${command}"`);
  console.error('Run "holoway help" for usage information');
  process.exit(1);
}
