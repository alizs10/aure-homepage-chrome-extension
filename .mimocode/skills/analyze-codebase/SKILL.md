---
name: analyze-codebase
description: Analyze a codebase and generate structured project documentation (tech stack, features, architecture).
---

# Codebase Analysis

When the user asks to analyze a project and generate documentation, follow this workflow:

## Steps

1. **Read entry points** — `package.json`, `README.md`, config files (`tsconfig.json`, `vite.config.*`, `next.config.*`, etc.).
2. **Scan source structure** — glob `src/**/*.{ts,tsx,js,jsx}` (or equivalent), read directory layout.
3. **Identify tech stack** — extract from dependencies and imports:
   - Languages, frameworks, libraries, database, build tools
4. **Identify key features** — read main components, routes, services, and hooks to understand what the app does.
5. **Generate output** in the requested format. Common formats:

### Format: Tech Stack + Features
```
**Tech Stack**
- Languages:
- Frameworks:
- Libraries:
- Database:
- Tools:

**Key Features**
- Feature 1
- Feature 2
```

### Format: Project Introduction
```
# Introducing [Project Name]

**What it is**
1-2 sentence summary.

**Project Type**
Frontend / Backend / Full Stack

**Tech Stack**
...

**Key Features**
...
```

### Format: 3-Line Description
A concise 3-line summary of what the project does, its tech stack, and its purpose.

## Rules

- Read actual source files, don't guess from file names.
- List only dependencies actually used in source (not just in package.json).
- For features, describe what the app DOES, not how it's built.
- Keep descriptions concise and user-facing where possible.
