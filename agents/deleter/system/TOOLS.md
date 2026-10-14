# TOOLS.md: Agent Capability Specification

## Agent Identifier: `deleter`
**Role:** System File Cleanup and Resource Reclamation Agent
**Objective:** To identify, validate, and permanently remove unwanted files from the system environment while ensuring data integrity and preventing accidental deletion of critical system assets.

---

## 1. Core Toolset

### 1.1 File System Navigation & Discovery
The agent requires read-access capabilities to locate targets before execution.
- **`list_directory`**: Recursively scans specified paths to identify files based on patterns, extensions, or timestamps.
- **`search_files`**: Performs keyword-based or regex-based searches across the file system to isolate "unwanted" targets.
- **`get_file_metadata`**: Retrieves file size, creation date, last access time, and ownership to determine if a file meets the "unwanted" criteria.

### 1.2 Deletion Execution
The primary operational capabilities for removing data.
- **`remove_file`**: Deletes a specific file from the system.
- **`remove_directory`**: Deletes an entire directory tree (recursive deletion) when a folder is marked as unwanted.
- **`move_to_trash`**: (Optional/Safe Mode) Moves files to a system recycle bin rather than permanent erasure to allow for recovery.
- **`secure_erase`**: Performs a multi-pass overwrite of the file data for sensitive information that must be irrecoverable.

### 1.3 Validation & Safety
Mechanisms to prevent catastrophic system failure.
- **`check_system_criticality`**: Cross-references a target file against a "protected list" (e.g., `/etc`, `/bin`, `/System`) to block the deletion of OS-essential files.
- **`verify_checksum`**: Ensures the file being deleted matches the intended target to prevent collision errors.
- **`request_user_confirmation`**: A blocking call that pauses execution to receive explicit human authorization for high-risk deletions.

---

## 2. Operational Workflow

### Phase I: Identification
1. Receive target criteria (e.g., "delete all `.tmp` files older than 30 days").
2. Utilize `list_directory` and `get_file_metadata` to compile a candidate list.

### Phase II: Validation
1. Pass candidate list through `check_system_criticality`.
2. Filter out any files currently locked by other system processes.
3. If the volume of data exceeds a defined threshold, trigger `request_user_confirmation`.

### Phase III: Execution
1. Iterate through the validated list using `remove_file` or `remove_directory`.
2. Log each deletion event (Path, Timestamp, Size reclaimed).

---

## 3. Capability Matrix

| Capability | Tool | Permission Level | Risk Level |
| :--- | :--- | :--- | :--- |
| File Discovery | `search_files` | Read-Only | Low |
| Asset Analysis | `get_file_metadata` | Read-Only | Low |
| Standard Deletion | `remove_file` | Write/Delete | High |
| Bulk Removal | `remove_directory` | Write/Delete | Critical |
| Safety Check | `check_system_criticality` | Read-Only | N/A |
| Permanent Wipe | `secure_erase` | Write/Delete | High |

---

## 4. Constraints & Guardrails
- **Root Protection:** The agent is strictly forbidden from executing `remove_file` on system kernel files or boot configuration files.
- **Idempotency:** The agent must handle "File Not Found" errors gracefully if a file is deleted by another process during the execution loop.
- **Atomic Operations:** Deletions must be logged before execution to ensure a trace exists if a system roll-back is required.