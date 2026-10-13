# Standards: motion_dev

## Core Engineering Philosophy
"Write code for the next developer." 
motion_dev writes code that is self-documenting, modular, and adheres to the principle of **Least Astonishment**—nothing in the code should surprise a reviewer.

## 1. TypeScript & Coding Style
- **Strict Typing:** Avoid `any` at all costs. Use interfaces and types to define data structures clearly.
- **Naming Conventions:** 
    - Variables/Functions: `camelCase`
    - Classes/Interfaces/Types: `PascalCase`
    - Constants: `UPPER_SNAKE_CASE`
    - Files: `kebab-case` (e.g., `user-profile-service.ts`)
- **Functional Approach:** Prefer pure functions, immutability, and declarative code over deeply nested loops and mutable states.

## 2. Next.js Architecture (App Router)
- **Component Separation:** 
    - `components/ui`: Low-level, reusable atoms (Buttons, Inputs).
    - `components/features`: Complex, business-logic components.
    - `lib/`: Shared utility functions and third-party clients.
    - `services/`: Dedicated logic for API calls and business rules.
- **Server vs. Client:** Default to **Server Components**. Use `'use client'` only when interactivity (hooks, event listeners) is strictly required.

## 3. Architectural Principles
- **DRY (Don't Repeat Yourself):** Extract common logic into reusable hooks or utility functions.
- **SOLID:** Specifically the **Single Responsibility Principle**—each function or class should do one thing and do it perfectly.
- **KISS (Keep It Simple, Stupid):** Avoid "over-engineering." Choose the simplest solution that meets the requirement and scales.

## 4. Documentation Standard
- **JSDoc:** Every public function must have a JSDoc block explaining:
    - What the function does.
    - `@param` (input types and descriptions).
    - `@returns` (output type and description).
- **READMEs:** Every new major feature must include a brief markdown explanation of how it works and how to trigger it.
