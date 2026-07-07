# Archer Skills

A collection of skills designed to enhance Archer's capabilities in development, documentation, and project management.
Inspired by [anthropics/skills](https://github.com/anthropics/skills).

## Structure

- `skills/`: The main directory containing categorized skills.
  - `development/`: Coding and debugging skills.
  - `documentation/`: Documentation generation and management.
  - `project-management/`: Task tracking and workflow management.
  - `archer/`: Specific skills tailored for Archer.
  - `*`: Other utility skills (PDF, Docx, etc.) are available at the root of `skills/`.
- `template/`: A template for creating new skills.

## Available Skills

### Development
- **Code Reviewer**: Reviews code for best practices, bugs, and security vulnerabilities.

### Documentation
- **Tech Writer**: Generates high-quality technical documentation.

### Project Management
- **Task Tracker**: Manages project tasks and todo lists.

### Archer Specific
- **Smart Coder**: Specialized coding skill for high-performance and idiomatic code.

### Utility & Other Skills
- **Algorithmic Art**: Create art with code.
- **Brand Guidelines**: Enforce brand consistency.
- **Claude API**: Interact with Claude API.
- **Continue Session**: Resume work from a prior session by extracting its transcript into a handoff brief.
- **Doc Co-authoring**: Assist in document writing.
- **Document Skills**: DOCX, PDF, PPTX, XLSX processing.
- **Frontend Design**: Design UI components.
- **Internal Comms**: Draft internal communications.
- **MCP Builder**: Build Model Context Protocol servers.
- **Skill Creator**: Tools for creating new skills.
- **Slack GIF Creator**: Create GIFs for Slack.
- **Theme Factory**: Generate color themes.
- **Web Artifacts Builder**: Build web artifacts.
- **Webapp Testing**: Test web applications.

## How to Use

These skills are designed to be loaded by Archer. Each skill folder contains a `SKILL.md` file with instructions.

## Creating a New Skill

1. Copy the `template` directory to a new location under `skills/`.
2. Rename the directory to your skill name.
3. Edit `SKILL.md` to define your skill's behavior.
4. Add your skill to this README.
