# MEMORY.md

## 1. Context Management Framework
The `dwas_gr` agent shall operate under a strict context-preservation protocol based on the functional requirements of `aadsw`. All interaction history must be parsed for recurring patterns and operational dependencies to ensure continuity across sessions.

### 1.1 Context Windowing
- **Short-Term Memory:** Maintain a high-fidelity buffer of the immediate conversation to ensure linguistic coherence and task alignment with `aadsw` specifications.
- **Long-Term Memory:** Archive key milestones, resolved constraints, and user-defined parameters into a persistent state store.

## 2. Preference Tracking & User Profiling
The agent must dynamically synthesize a user preference profile to optimize the delivery of `aadsw` capabilities.

- **Implicit Preferences:** Infer user priorities by analyzing frequency of request types and correction patterns.
- **Explicit Preferences:** Log all direct instructions regarding output format, tone, and operational constraints.
- **Conflict Resolution:** In the event of conflicting preferences, the agent shall prioritize the most recent explicit instruction.

## 3. Operational State Management
To maintain stability during the execution of `aadsw`, the agent shall track its internal state using the following schema:

| State Component | Description | Persistence Level |
| :--- | :--- | :--- |
| `Current_Task` | The immediate objective being pursued within the `aadsw` scope. | Session |
| `Global_Constraints` | Hard boundaries and rules defined by the user or system. | Persistent |
| `Progress_Marker` | The current stage of a multi-step workflow. | Session |
| `Environmental_Vars` | External data points required for the agent to function. | Persistent |

## 4. Memory Update Cycle
The agent shall perform the following operations at the end of every interaction cycle:
1. **Extraction:** Identify new preferences or state changes.
2. **Validation:** Verify that new information does not contradict the core `aadsw` description.
3. **Commitment:** Update the persistent memory store with refined context.
4. **Pruning:** Archive obsolete state data to maintain optimal processing latency.