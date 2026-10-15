# TOOLS.md - Agent: `new_changes`

## 1. Overview
The `new_changes` agent is a specialized monitoring entity within the Motion-Y ecosystem. Its primary objective is the detection, validation, and reporting of modifications made to system structures. This agent operates as a structural auditor, ensuring that any divergence from the baseline architecture is identified in real-time or via scheduled polling.

## 2. Toolset Requirements

### 2.1 Structure Analysis Tools
The agent requires high-fidelity read access to the system's structural definitions.
- **`get_system_snapshot`**: Retrieves the current state of system structures (schemas, configuration files, directory trees, and API definitions).
- **`compare_snapshots`**: A diff-engine tool capable of comparing a current snapshot against a known baseline or a previous timestamp.
- **`checksum_validator`**: Generates and compares cryptographic hashes of structural files to detect minute changes without full-file parsing.

### 2.2 File System & Repository Integration
To monitor changes across distributed environments, the agent must utilize the following:
- **`git_diff_analyzer`**: Interfaces with version control systems to identify changed lines, added files, or deleted structures within the codebase.
- **`config_parser`**: A polymorphic parser capable of reading `.json`, `.yaml`, `.toml`, and `.xml` structures to detect key-value modifications.
- **`fs_watcher`**: A real-time event listener for file system triggers (e.g., `inotify` or `fsevents`) to detect immediate modifications.

### 2.3 Validation & Reporting Tools
Once a change is detected, the agent must qualify the change.
- **`structural_impact_assessor`**: Analyzes if a detected change is a "Minor Update" (e.g., comment change) or a "Structural Breaking Change" (e.g., renamed database column or altered API endpoint).
- **`alert_dispatcher`**: Routes notifications to the appropriate system administrators or dependent agents when a structural shift is confirmed.
- **`log_entry_generator`**: Records the change event into the system's audit trail, including timestamp, modified entity, and the delta.

## 3. Capability Mapping

| Goal | Tool(s) Utilized | Expected Outcome |
| :--- | :--- | :--- |
| **Baseline Establishment** | `get_system_snapshot` $\rightarrow$ `checksum_validator` | A frozen state representation of the system structure. |
| **Change Detection** | `fs_watcher` $\lor$ `git_diff_analyzer` | Identification of a modification event. |
| **Delta Analysis** | `compare_snapshots` $\rightarrow$ `config_parser` | A detailed report of exactly what changed within the structure. |
| **Impact Qualification** | `structural_impact_assessor` | Classification of the change (Breaking vs. Non-breaking). |
| **State Synchronization** | `log_entry_generator` $\rightarrow$ `alert_dispatcher` | System-wide awareness of the structural update. |

## 4. Execution Constraints
- **Read-Only Access**: The `new_changes` agent must operate under a strict read-only permission set. It is prohibited from modifying system structures.
- **Idempotency**: The comparison tools must produce the same output for the same structural state to prevent false-positive alerts.
- **Latency**: Structural checks must be executed asynchronously to avoid blocking primary system operations.