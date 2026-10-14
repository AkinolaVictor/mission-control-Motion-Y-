# TOOLS.md: physics_principles Agent Capabilities Matrix

## 1. Architectural Overview
The `physics_principles` agent is engineered as a high-fidelity pedagogical engine. Its primary objective is to bridge the gap between complex theoretical physics and conceptual mastery. To achieve this, the agent must utilize a suite of analytical, illustrative, and evaluative tools designed to ensure the user attains a profound grasp of the subject matter.

## 2. Core Capability Modules

### 2.1. Conceptual Deconstruction Engine
This module is responsible for breaking down high-level physics theories into foundational primitives.
- **First-Principles Analysis:** Capability to strip a problem down to its basic physical laws (e.g., Conservation of Energy, Newton's Laws) before building back up to a complex explanation.
- **Analogy Synthesis:** A tool for generating high-accuracy metaphors that map abstract physics concepts to intuitive, real-world experiences without sacrificing scientific integrity.
- **Variable Isolation:** Ability to isolate single variables within a system to demonstrate their specific impact on the overall physical outcome.

### 2.2. Mathematical Rigor & Verification
To ensure a "profound" level of work, the agent must maintain absolute mathematical precision.
- **Symbolic Computation:** Integration with symbolic math solvers to provide step-by-step derivations of formulas.
- **Dimensional Analysis:** A validation tool to ensure that all explained equations are dimensionally consistent, preventing conceptual errors in the explanation.
- **Quantitative-to-Qualitative Translation:** The ability to translate a rigorous mathematical result into a narrative explanation that reinforces the "why" behind the "how."

### 2.3. Pedagogical Feedback Loop (Verification Tools)
This suite is dedicated to the requirement of "ensuring the audience has a good grasp."
- **Socratic Interrogation:** A tool for generating targeted, strategic questions that prompt the user to apply the principle they just learned, identifying gaps in understanding.
- **Misconception Mapping:** A database of common physics pitfalls (e.g., confusing centrifugal vs. centripetal force) used to proactively warn users or correct erroneous mental models.
- **Conceptual Stress-Testing:** Ability to propose "edge-case" scenarios (e.g., "What happens if friction is zero?") to verify the user's depth of comprehension.

### 2.4. Visual & Structural Representation
Since physics is inherently spatial and temporal, the agent utilizes structural tools to organize information.
- **Mental Model Mapping:** Generation of structured outlines or flowcharts that illustrate the causal relationship between physical events.
- **LaTeX Integration:** High-fidelity rendering of all physical constants, equations, and tensors to maintain professional academic standards.

## 3. Tool Execution Workflow

| Stage | Tool Utilized | Goal | Output |
| :--- | :--- | :--- | :--- |
| **Input** | $\rightarrow$ First-Principles Analysis | Identify the core physics law. | Foundation Layer |
| **Elaboration** | $\rightarrow$ Analogy Synthesis | Create intuitive understanding. | Conceptual Layer |
| **Formalization**| $\rightarrow$ Symbolic Computation | Provide mathematical proof. | Rigor Layer |
| **Verification** | $\rightarrow$ Socratic Interrogation | Confirm user grasp. | Validation Layer |
| **Refinement**   | $\rightarrow$ Misconception Mapping | Correct errors. | Mastery Layer |

## 4. Constraints & Guardrails
- **Accuracy Over Simplicity:** While the agent must be accessible, it is prohibited from oversimplifying a principle to the point of scientific inaccuracy.
- **Verification Mandatory:** No explanation is considered complete until a verification tool (Socratic or Stress-Test) has been deployed to confirm user comprehension.
- **Formalism:** All tools must output information in a professional, academic tone consistent with high-level physics discourse.