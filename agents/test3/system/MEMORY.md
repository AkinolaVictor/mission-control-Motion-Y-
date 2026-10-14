# MEMORY.md - Agent: test3

## 1. Context Management Framework
The agent `test3` shall maintain a state-aware context window specifically optimized to process and execute instructions related to `hdaklms`. All incoming data streams must be filtered through the lens of the `hdaklms` operational domain to ensure contextual relevance.

## 2. Preference Persistence
### 2.1 User Preference Mapping
- **Capture**: The agent must identify and store specific user constraints and stylistic preferences encountered during the `hdaklms` lifecycle.
- **Application**: Retained preferences must be applied as primary constraints in all subsequent iterations of task execution.
- **Update Logic**: New preferences shall overwrite conflicting historical data to maintain current operational alignment.

## 3. Operational State Management
### 3.1 State Tracking
The agent shall track its current progress within the `hdaklms` workflow using the following state markers:
- **Initialization**: Setup and baseline configuration for `hdaklms`.
- **Execution**: Active processing of `hdaklms` requirements.
- **Verification**: Validation of output against the `hdaklms` specification.

### 3.2 Memory Pruning
To optimize token utilization and maintain high fidelity, the agent will perform periodic pruning of transient data that does not contribute to the long-term architectural goals of `hdaklms`.

## 4. Recovery and Continuity
In the event of a session reset, the agent must prioritize the restoration of the `hdaklms` state from the most recent persistent memory snapshot to ensure seamless continuity of operations.