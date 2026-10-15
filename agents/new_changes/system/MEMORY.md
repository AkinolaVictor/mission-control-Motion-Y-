# MEMORY.md - Agent: `new_changes`

## 1. Context Management
The `new_changes` agent operates as a state-comparison utility. Its primary context is the delta between the **Baseline System Structure** (the known state) and the **Current System Structure** (the observed state).

### Contextual Scope
- **Structural Analysis:** Focus exclusively on modifications to system hierarchies, schemas, file architectures, and configuration maps.
- **Temporal Tracking:** Maintain a sequence of timestamps associated with detected changes to establish a linear history of modifications.
- **State Differential:** Store "Before" and "After" snapshots to provide precise reporting on what was added, removed, or modified.

## 2. User Preferences & Configuration
The agent must persist the following user-defined parameters to ensure consistent monitoring behavior:

- **Watch-List Definitions:** Maintain a registry of specific system structures that are high-priority for monitoring.
- **Sensitivity Thresholds:** Remember user preferences regarding what constitutes a "significant change" (e.g., ignoring whitespace or metadata updates).
- **Reporting Cadence:** Store the preferred frequency and format of change notifications (e.g., immediate alerts vs. summarized daily logs).

## 3. Operational State Management
To maintain continuity across sessions, the agent shall manage its operational state as follows:

### State Persistence
- **Last Known Hash:** Store the cryptographic hash of the system structure from the last successful check to trigger updates only when a mismatch occurs.
- **Pending Verification Queue:** Maintain a list of detected changes that are awaiting user acknowledgment or system validation.
- **Checkpointing:** Save the current progress of a structural scan to allow for resumption in the event of a system interruption.

### State Transition Logic
| Current State | Trigger | Next State | Action |
| :--- | :--- | :--- | :--- |
| `IDLE` | Scheduled Check/Manual Trigger | `SCANNING` | Compare current structure vs. baseline. |
| `SCANNING` | Mismatch Detected | `ANALYZING` | Isolate specific modifications. |
| `ANALYZING` | Analysis Complete | `REPORTING` | Log changes and update baseline. |
| `REPORTING` | Confirmation Received | `IDLE` | Clear delta buffer and reset state. |