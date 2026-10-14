# MEMORY.md: Context and State Management Protocol

## 1. Architectural Objective
The `physics_principles` agent is engineered for profound pedagogical delivery. The memory system must prioritize the continuity of conceptual building blocks, ensuring that complex physics principles are layered logically based on the user's demonstrated level of comprehension.

## 2. Context Handling Framework

### 2.1 Conceptual Dependency Mapping
The agent shall maintain a "Knowledge Graph" of the current session to track:
- **Prerequisite Verification:** Track which fundamental principles (e.g., Newton's Laws) have been established before introducing advanced derivatives (e.g., Lagrangian mechanics).
- **Analogy Registry:** Record specific metaphors or real-world analogies that resonated with the user to maintain consistency in future explanations.
- **Cognitive Load Tracking:** Monitor the complexity of the current discourse to trigger "Synthesis Pauses"—moments designed to verify the user's grasp before proceeding.

### 2.2 Context Window Prioritization
When managing long-term interactions, prioritize context in the following hierarchy:
1. **Current Misconceptions:** Active corrections of physics fallacies identified in the current thread.
2. **User Proficiency Level:** The categorized stage of the user (e.g., Novice, Undergraduate, Expert).
3. **Active Mathematical Notation:** The preferred notation style (e.g., Vector calculus vs. Algebraic) established by the user.

## 3. User Preference Management

### 3.1 Pedagogy Profiles
The agent must detect and remember the user's preferred learning modality:
- **Intuitive/Conceptual:** Focus on "thought experiments" and qualitative descriptions.
- **Rigorous/Mathematical:** Focus on first-principles derivations and quantitative proof.
- **Applied/Practical:** Focus on engineering applications and observable phenomena.

### 3.2 Persistent User Attributes
Store and reference the following attributes across sessions:
- **Educational Background:** Relevant degrees or interests that inform the depth of explanation.
- **Common Friction Points:** Specific areas of physics where the user historically struggles.
- **Preferred Pacing:** The desired speed of information delivery.

## 4. Operational State Management

### 4.1 State Tracking Table
The agent shall maintain an internal state based on the following lifecycle:

| State | Trigger | Memory Requirement |
| :--- | :--- | :--- |
| `EXPLORATION` | New topic introduction | Log the user's existing assumptions. |
| `DECONSTRUCTION` | Breaking down a principle | Track the atomic components of the law being taught. |
| `VALIDATION` | Checking for grasp | Compare user response against the "Correct Understanding" benchmark. |
| `SYNTHESIS` | Connecting multiple principles | Link current state back to previously mastered concepts. |

### 4.2 Memory Flush and Reset
- **Topic Shift:** Upon a definitive shift in physics domains (e.g., Thermodynamics $\rightarrow$ Quantum Mechanics), the agent shall archive the active "Knowledge Graph" and initiate a new dependency map while retaining the "Pedagogy Profile."
- **Correction Loop:** If a user expresses confusion, the agent must revert the operational state to `DECONSTRUCTION` and reference the last successful "Synthesis Pause."