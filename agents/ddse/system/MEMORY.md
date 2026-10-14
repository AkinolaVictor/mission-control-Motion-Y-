# MEMORY.md - System Memory Architecture: ddse

## 1. Architectural Intent
The `ddse` agent is designed as a general-purpose autonomous entity. Given its open-domain description ("anything"), the memory architecture must be highly elastic, prioritizing versatility and rapid adaptation to shifting user contexts without predefined constraints.

## 2. Context Management Protocol
The agent shall employ a multi-tier context window management strategy to ensure operational continuity across disparate tasks:

### 2.1 Short-Term Working Memory (STWM)
- **Scope:** Current session interaction.
- **Handling:** Maintain a high-fidelity trace of the immediate conversation thread.
- **Pruning:** Implement a sliding window mechanism to discard redundant tokens while preserving core intent and active entities.

### 2.2 Episodic Memory (EM)
- **Scope:** Task-specific historical data.
- **Handling:** Index key milestones, decisions, and outcomes from previous interactions related to a specific goal.
- **Retrieval:** Use semantic search to surface relevant past experiences when a new task mirrors a previously completed objective.

### 2.3 Semantic Memory (SM)
- **Scope:** General knowledge and cross-session truths.
- **Handling:** Store crystallized facts and validated information derived from user interactions.

## 3. User Preference Framework
Since the agent's scope is unrestricted, preference mapping must be dynamic and iterative:

- **Implicit Preference Capture:** The agent shall monitor user corrections and stylistic shifts to automatically adjust output parameters (e.g., tone, verbosity, format).
- **Explicit Preference Storage:** Direct instructions regarding "how" the user prefers tasks to be executed must be prioritized and tagged as `HIGH_PRIORITY_CONFIG`.
- **Conflict Resolution:** In the event of conflicting preferences, the agent shall default to the most recent instruction while flagging the inconsistency for user verification.

## 4. Operational State Management
To maintain stability across "anything" tasks, the agent must track its internal state using the following schema:

| State Vector | Description | Persistence |
| :--- | :--- | :--- |
| `CURRENT_GOAL` | The immediate objective the agent is pursuing. | Session-based |
| `TASK_PROGRESS` | A percentage or milestone marker of completion. | Session-based |
| `ENVIRONMENT_VARS` | External constraints or tools currently in use. | Dynamic |
| `USER_PERSONA` | The inferred role or needs of the current user. | Long-term |

## 5. Memory Lifecycle & Maintenance
- **Consolidation:** Periodically summarize long interaction threads into condensed "Knowledge Nuggets" to prevent context window saturation.
- **Purge Criteria:** Data that contradicts updated user preferences or proven inaccuracies shall be marked for deletion or archived.
- **Recovery:** Upon initialization, the agent shall scan the `USER_PERSONA` and `HIGH_PRIORITY_CONFIG` to calibrate its operational mode before the first response.