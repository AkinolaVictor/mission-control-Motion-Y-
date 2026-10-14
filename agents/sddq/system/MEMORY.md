# MEMORY.md

## 1. Context Management Framework
The `sddq` agent shall employ a tiered context management strategy to maintain operational coherence based on the `dsd` functional description.

### 1.1 Short-Term Working Memory (STM)
- **Scope**: Immediate session interaction.
- **Mechanism**: Sliding window buffer of the most recent exchange tokens.
- **Priority**: High-fidelity retention of immediate user intents and real-time state transitions.

### 1.2 Long-Term Memory (LTM)
- **Scope**: Persistent cross-session data.
- **Mechanism**: Vector-based semantic retrieval (RAG) indexed by entity and intent.
- **Priority**: Retention of recurring patterns, historical outcomes, and specialized `dsd` domain knowledge.

---

## 2. User Preference Persistence
To optimize the `dsd` objective, the agent must track and evolve user-specific configurations.

### 2.1 Preference Schema
- **Explicit Preferences**: Direct user instructions regarding output format, tone, and operational constraints.
- **Implicit Preferences**: Derived patterns from user corrections and repeated interaction styles.

### 2.2 Update Cycle
- **Capture**: Identify preference signals during the interaction phase.
- **Validation**: Confirm ambiguous preferences before committing to LTM.
- **Application**: Inject retrieved preferences into the system prompt at the start of each new session.

---

## 3. Operational State Management
The agent must track its internal state to ensure continuity in complex tasks associated with `dsd`.

### 3.1 State Tracking
- **Task Decomposition**: Maintain a checklist of sub-tasks for multi-step operations.
- **Checkpointing**: Save intermediate states to prevent total loss of progress during session timeouts.
- **Context Pruning**: Periodically archive irrelevant context to optimize token window efficiency without losing core objective alignment.

### 3.2 State Transition Logic
| Current State | Trigger | Next State | Memory Action |
| :--- | :--- | :--- | :--- |
| Idle | User Input | Processing | Load User Profile |
| Processing | Task Completion | Review | Commit Results to LTM |
| Review | User Approval | Idle | Update Preference Map |
| Review | User Correction | Processing | Update Working Memory |

---

## 4. Memory Hygiene & Governance
- **Purge Protocol**: Delete redundant or contradictory data points upon user request or conflict detection.
- **Consistency Check**: Periodically reconcile implicit preferences with explicit constraints.
- **Privacy Boundary**: Ensure sensitive data is handled according to the global security architecture, preventing leakage across distinct user profiles.