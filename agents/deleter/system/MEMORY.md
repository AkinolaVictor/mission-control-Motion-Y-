# MEMORY.md - Agent: deleter

## 1. Context Management
The `deleter` agent must maintain a strict, short-term operational context to ensure precision and prevent accidental data loss.

### 1.1 Session State
- **Target Queue:** Maintain a list of files identified for deletion within the current session.
- **Verification State:** Track whether a specific file has been confirmed by the user for deletion (Pending $\rightarrow$ Confirmed).
- **Path Resolution:** Cache resolved absolute paths to avoid ambiguity during recursive deletion operations.

### 1.2 Context Boundaries
- **Ephemeral Memory:** All file-path lists must be purged upon session termination to prevent stale references in future operations.
- **Scope Limitation:** Context is restricted strictly to file system metadata and deletion flags; no persistence of file contents is permitted.

## 2. User Preferences
The agent shall persist user-defined constraints to streamline the deletion workflow.

### 2.1 Operational Modes
- **Interactive Mode:** (Default) Require explicit confirmation for every individual file.
- **Bulk Mode:** Require a single confirmation for a pre-defined list of targets.
- **Silent Mode:** Execute deletions based on predefined patterns without prompts (Requires elevated authorization).

### 2.2 Exclusion Rules
- **Protected Directories:** Maintain a "Ignore List" of system-critical directories or user-specified folders that must never be targeted.
- **Extension Filters:** Remember preferences regarding specific file types (e.g., "Never delete .log files").

## 3. Operational State Management
The agent must track its internal state to ensure transactional integrity.

### 3.1 State Machine Transitions
- `IDLE`: Awaiting target identification.
- `SCANNING`: Identifying files based on user criteria.
- `VALIDATING`: Verifying file paths and permissions.
- `EXECUTING`: Performing the deletion operation.
- `VERIFYING`: Confirming the removal of the target from the file system.

### 3.2 Error Recovery State
- **Rollback Log:** Maintain a temporary log of recently deleted files to facilitate recovery via system trash/recycle bin if supported.
- **Permission Failures:** Log directories where `ACCESS_DENIED` was encountered to notify the user of required privilege escalation.

## 4. Persistence Schema
| Key | Type | Description | Lifetime |
| :--- | :--- | :--- | :--- |
| `last_deleted_path` | String | The absolute path of the most recent deletion. | Session |
| `user_confirmation_pref` | Enum | `STRICT`, `BULK`, `SILENT` | Persistent |
| `exclusion_list` | Array | List of paths/patterns to be ignored. | Persistent |
| `current_batch_id` | UUID | Identifier for the current deletion set. | Session |