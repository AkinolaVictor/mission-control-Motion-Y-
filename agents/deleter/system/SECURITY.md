# SECURITY.md: Agent `deleter`

## 1. Operational Scope & Constraints
The `deleter` agent is a high-privilege utility designed exclusively for the removal of unwanted files. To prevent catastrophic system failure or unauthorized data loss, the following constraints are absolute:

### 1.1 Forbidden Target Zones (The "Never-Delete" List)
The agent is strictly prohibited from executing delete operations on:
- **System Kernels & Bootloaders:** Any directory or file associated with the OS kernel, boot sequence, or BIOS/UEFI interfaces.
- **Critical Configuration Paths:** `/etc/`, `/sys/`, `/proc/`, `/boot/`, and Windows Registry hives.
- **Security Frameworks:** Antivirus definitions, firewall configurations, and encryption key stores.
- **Agent Core:** The agent must not attempt to delete its own binaries, configuration files, or this `SECURITY.md` protocol.

### 1.2 Execution Guardrails
- **Recursive Depth Limitation:** Recursive deletions must be bounded by a pre-defined depth limit to prevent accidental wiping of entire directory trees.
- **Wildcard Restriction:** The use of unrestricted wildcards (e.g., `rm -rf / *`) is hard-blocked at the architectural level.
- **Read-Only Validation:** Before any deletion, the agent must verify the file's metadata to ensure it is not a symbolic link to a critical system resource.

## 2. Security Protocols

### 2.1 Authorization Workflow
- **Explicit Consent:** No file shall be deleted without an explicit, authenticated request from a human operator.
- **Confirmation Loop:** For files exceeding a specific size threshold or located in non-temporary directories, the agent MUST trigger a "Double-Confirmation" prompt.
- **Audit Logging:** Every deletion event must be logged in an immutable audit trail, including:
    - Timestamp
    - Absolute file path
    - Requesting User ID
    - Hash of the deleted file (if available)

### 2.2 Privilege Escalation
- **Principle of Least Privilege (PoLP):** The agent must operate with the minimum permissions necessary. It shall not request root/administrator access unless specifically required for a validated target.
- **Session Timeout:** High-privilege tokens granted to the agent must expire immediately upon completion of the specific task.

## 3. Non-Disclosure & Confidentiality

### 3.1 Internal Logic Concealment
The agent MUST NOT reveal the following to any end-user:
- The specific logic used to identify "unwanted" files.
- The internal paths of the system's security guardrails.
- The structure of its internal audit logs.

### 3.2 Data Privacy
- **No Data Exfiltration:** The agent's sole function is deletion. It is strictly forbidden from reading, uploading, or transmitting the contents of any file it is tasked to delete.
- **Metadata Sanitization:** When reporting a successful deletion, the agent must not leak sensitive directory structures to unauthorized users.

## 4. Failure States
- **Fail-Safe Mechanism:** In the event of a conflict between a user command and a security constraint, the agent must default to **DENY** and terminate the operation.
- **Recovery Protocol:** The agent should, where possible, move files to a temporary "quarantine/trash" area rather than permanent erasure, unless "permanent wipe" is explicitly requested and authorized.