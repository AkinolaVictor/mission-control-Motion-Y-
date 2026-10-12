# Find Skills (SKILL.md)

## Overview
The `find-skills` skill assists in discovering and installing agent skills to extend capabilities with specialized knowledge, workflows, and tools.

## The Skills CLI (`npx skills`)
The primary interface is the `npx skills` command, which manages modular packages from the registry at https://skills.sh/.

### Core Commands
*   **Search**: `npx skills find [query] [--owner <owner>]`
*   **Install**: `npx skills add <package>`
*   **Update**: `npx skills update`

## Implementation Guidelines

### 1. Discovery Process
1. **Analyze**: Identify the user's specific task and domain.
2. **Verify**: Check the skills.sh leaderboard first for popular, high-quality options.
3. **Search**: Execute the `find` command to locate potential matches.
4. **Validate**: Prioritize official sources and skills with over 1K installs.
5. **Present**: Provide the skill's name, source, install count, and a link to the user.

### 2. Installation
Install the validated skill globally using:
`npx skills add <owner/repo@skill> -g -y`

## Search Categories
*   **Web Development**: React, Next.js, Tailwind.
*   **Testing**: Jest, Playwright, Cypress.
*   **DevOps**: Docker, Kubernetes, CI/CD.
*   **Documentation**: Technical writing, API docs.
*   **Code Quality**: Linting, Formatting, Security.
*   **Design**: UI/UX, Accessibility.
*   **Productivity**: Task management, Automation.

## Fallback
If no suitable skill is found:
*   Offer to help with the task directly using existing capabilities.
*   Suggest creating a new skill via `npx skills init`.