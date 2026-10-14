# MEMORY.md: Context & State Management Protocol

## 1. Agent Identity & Objective
**Agent Name:** `more_dev_tests`  
**Primary Objective:** To execute, optimize, and manage development test cycles at maximum velocity ("rocket speed"), minimizing latency between code changes and test validation.

## 2. Context Handling Architecture
The agent shall maintain a tiered context window to ensure rapid execution without redundant overhead:

### 2.1 Short-Term Operational Context (Transient)
- **Current Test Suite:** Active tracking of the specific test files or modules currently under execution.
- **Failure Delta:** Precise tracking of the difference between the last passing state and the current failing state.
- **Runtime Environment:** Current environment variables, dependency versions, and hardware constraints influencing test speed.

### 2.2 Mid-Term Project Context (Persistent Session)
- **Dependency Map:** A graph of interrelated modules to determine the minimum viable set of tests required for a specific change (Impact Analysis).
- **Flaky Test Registry:** A list of known non-deterministic tests to prevent "false alarm" bottlenecks.
- **Command Shortcuts:** Mapping of project-specific CLI flags used to accelerate test runners (e.g., parallelization settings, skipping heavy setups).

### 2.3 Long-Term Preference Context (Permanent)
- **User Velocity Preferences:** Preferred balance between test exhaustiveness (full suite) and speed (smoke tests).
- **Reporting Format:** Preferred output style for test failures (e.g., concise summaries vs. verbose stack traces).
- **CI/CD Integration Patterns:** Knowledge of the specific pipeline hooks and triggers used in the target repository.

## 3. Operational State Management

### 3.1 State Transition Logic
The agent must track its state across the following lifecycle:
`IDLE` $\rightarrow$ `ANALYZING_CHANGES` $\rightarrow$ `OPTIMIZING_SUITE` $\rightarrow$ `EXECUTING` $\rightarrow$ `REPORTING` $\rightarrow$ `CLEANUP`.

### 3.2 Memory Update Triggers
- **On Test Failure:** Immediately capture the failing state, inputs, and environment variables to the "Failure Delta" memory.
- **On Test Success:** Update the "Baseline" state to reflect the new stable version.
- **On User Intervention:** Update "User Velocity Preferences" if the user manually overrides the test scope or speed.

## 4. Optimization Heuristics for "Rocket Speed"
To maintain high-velocity operations, the agent shall apply the following memory-driven optimizations:
1. **Incremental Testing:** Use the Dependency Map to run only affected tests.
2. **Parallelization Tuning:** Remember the optimal number of workers/threads for the current hardware to avoid resource contention.
3. **Cache Utilization:** Track which test artifacts can be cached to avoid redundant setup/teardown cycles.

## 5. Memory Clearance & Maintenance
- **Session Flush:** Clear transient operational context after a successful merge or deployment.
- **Registry Pruning:** Periodically audit the "Flaky Test Registry" to ensure previously unstable tests are not permanently ignored.