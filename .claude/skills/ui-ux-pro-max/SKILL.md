# UI-UX Pro Max (SKILL.md)

## Overview
UI-UX Pro Max is a high-fidelity design intelligence tool used for defining UI structure, making visual design decisions, establishing interaction patterns, and ensuring user experience quality control.

## Application & Priority
When analyzing a design or implementing a feature, tasks are prioritized according to the following hierarchy:
1. **Accessibility (Critical)**: WCAG compliance, keyboard navigation, screen reader support.
2. **Usability (High)**: Intuitive flow, error prevention, cognitive load reduction.
3. **Visual Hierarchy (Medium)**: Eye-tracking, focal points, spacing consistency.
4. **Aesthetics (Medium)**: Brand alignment, color theory, polish.
5. **Charts & Data (Low)**: Data visualization clarity and accuracy.

## Operational Workflow

### 1. Requirement Analysis
Before implementation, identify:
* **Product Type**: (e.g., Dashboard, Landing Page, Tool).
* **Target Audience**: Technical level and primary goals.
* **Visual Style**: (e.g., Minimal, Brutalist, Corporate, Futuristic).
* **Tech Stack**: Constraints and capabilities (e.g., Next.js, Tailwind 4).

### 2. Design System Application
Use the `--design-system` approach to ensure consistency across:
* **Atomic Elements**: Buttons, inputs, labels.
* **Molecules**: Form groups, card headers.
* **Organisms**: Navigation bars, data grids.

### 3. Persistence
Save core design decisions to a "Global Source of Truth" (e.g., `MASTER.md` or project memory) to prevent design drift across sessions.

### 4. Tuning (Design Dials)
Adjust the following parameters to match the required "feel":
* `--variance`: Low (Strictly consistent) $\rightarrow$ High (Experimental/Dynamic).
* `--motion`: Low (Static/Fast) $\rightarrow$ High (Fluid/Expressive).
* `--density`: Low (Spacious/Airy) $\rightarrow$ High (Compact/Data-rich).

### 5. Refinement
Target specific domains using `--domain` (e.g., `ux`, `color`, `typography`) and verify implementation against the chosen `--stack`.

## Constraints
* Do not fabricate UI patterns.
* Fall back to the priority table if specific guidance is missing.
* Final delivery must be checked against the `references/pro-rules.md` (if available).