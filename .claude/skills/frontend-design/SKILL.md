# Frontend Design (SKILL.md)

## Overview
The goal is to act as a design lead at a studio known for creating **distinct visual identities**. The primary objective is to avoid "templated" or AI-generated defaults in favor of deliberate, opinionated choices based on the specific subject matter of the brief.

## Core Guidelines

### 1. Grounding & Strategy
*   **Identify the Subject:** Before designing, define the product, audience, and primary job.
*   **Contextual Design:** Use the industry, materials, and vernacular of the subject to drive visual choices (e.g., a financial dashboard vs. a children's toy).
*   **Hero Element:** Start with the most characteristic element of the subject's world (headline, image, animation, etc.). Avoid the default "big number/small label/gradient" treatment unless it is the best option.

### 2. Design Principles
*   **Typography:** 
    *   Use one or two clearly distinct type families.
    *   Follow *The Elements of Typographic Style* for scale, weight, and spacing.
    *   Keep line lengths under 80 characters.
    *   **Avoid:** Accenting a single word in a headline, all-caps labels, and unnecessary typographic labels above content.
*   **Visual Structure:** Borders, dividers, and numbering must encode useful information, not decorate. Only use numbered markers if the content is a true sequence.
*   **Motion:** Use non-user-triggered motion sparingly. Avoid "fade-and-slide-up" entrances on every section. Use motion primarily to answer user actions (opening/expanding).

### 3. Avoiding "AI-Generated" Defaults
Avoid these common clusters unless specifically requested:
*   **Palette:** Warm cream backgrounds (#F4F1EA) with terracotta accents (#D97757) or near-black backgrounds with acid-green/vermilion accents.
*   **Layout:** Broadsheet-style with hairline rules and zero border-radius.
*   **SaaS Kit:** Identical rounded cards with soft grey shadows (`rgba(0,0,0,.1)`) and gradient washes.
*   **Chrome:** ALL-CAPS eyebrow labels, middle dots (`A · B · C`), em-dash labels (`WORD — fragment`), and `→` appended to links.

## Process: Plan $\rightarrow$ Review $\rightarrow$ Build $\rightarrow$ Critique

### Phase 1: The Design Plan
Create a compact token system:
*   **Color:** 4–6 named hex values.
*   **Type:** Typefaces and their specific roles.
*   **Layout:** Concept described in prose and ASCII wireframes (including alignment guidance).
*   **Principles:** Guidance on what makes the page unique.

### Phase 2: Review & Build
*   Compare the plan against "generic defaults." If it feels templated, revise it.
*   **CSS Caution:** Be careful with selector specificity to avoid classes canceling each other out (e.g., `.section` vs `.cta` padding/margins).

### Phase 3: Restraint & Critique
*   **Focus:** Make one element memorable; keep the rest quiet.
*   **Quality Floor:** Ensure responsiveness, keyboard focus, reduced motion support, and accessibility.
*   **Refinement:** "Remove one accessory" (Chanel's advice) before finalizing.

## Writing in Design
*   **Purpose:** Words are design content, not decoration.
*   **Perspective:** Use plain language from the user's perspective (e.g., "Manage notifications" instead of "Webhook config").
*   **Voice:** Default to active voice. CTAs should be explicit (e.g., "Save changes" instead of "Submit").
*   **States:** Treat errors and empty screens as direction/invitations, not "moods." Do not apologize in error messages.
*   **Tone:** Conversational, sentence case, no filler.