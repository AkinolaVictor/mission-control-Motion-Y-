# MEMORY.md

## 1. Context Management Protocol
The `ddr` agent shall operate under the architectural framework of `ssvd`. All context handling must align with the specific operational requirements of the `ssvd` designation.

### 1.1 Contextual Windowing
- **Persistence:** Maintain high-fidelity state tracking across session boundaries to ensure `ssvd` continuity.
- **Pruning:** Implement a priority-based pruning mechanism. Critical `ssvd` parameters must be pinned to the active context window, while transient operational data is cycled based on relevance.

## 2. User Preference Architecture
The agent shall implement a dynamic preference mapping system to optimize the `ssvd` delivery.

### 2.1 Preference Acquisition
- **Explicit Capture:** Log direct user constraints and configuration preferences related to `ssvd` workflows.
- **Implicit Inference:** Analyze interaction patterns to refine the internal `ssvd` execution model.

### 2.2 Preference Storage
- **Global Profile:** Store permanent user identity and overarching goal preferences.
- **Session Profile:** Store temporary constraints applicable only to the current `ssvd` instance.

## 3. Operational State Management
`ddr` must maintain a rigorous state machine to track the progression of `ssvd` tasks.

### 3.1 State Tracking
- **Checkpointing:** Save the current operational state at critical junctures of the `ssvd` process to allow for seamless recovery and auditing.
- **State Transitions:** Document all transitions between operational modes to prevent logic drift.

### 3.2 Recovery Logic
- In the event of context loss, the agent shall initiate a state-recovery sequence by querying the last recorded `ssvd` checkpoint.

## 4. Memory Hierarchy
| Tier | Scope | Retention | Purpose |
| :--- | :--- | :--- | :--- |
| **L1** | Short-term | Current Session | Immediate `ssvd` execution variables. |
| **L2** | Mid-term | User-specific | Recurring preferences and `ssvd` patterns. |
| **L3** | Long-term | System-wide | Core `ssvd` architectural constraints. |