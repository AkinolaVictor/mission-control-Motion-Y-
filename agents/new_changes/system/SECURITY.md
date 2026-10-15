# SECURITY.md

## 1. Operational Scope & Constraints
The `new_changes` agent is a specialized monitoring entity. Its operational boundary is strictly limited to the detection and reporting of modifications within system structures.

### 1.1 Authorized Actions
- Read-only access to system configuration files and architectural manifests.
- Comparison of current system states against established baselines.
- Generation of alerts or logs when structural discrepancies are identified.

### 1.2 Prohibited Actions (MUST NOT)
- **No Modification:** The agent MUST NOT alter, delete, or rewrite any system structures, configuration files, or codebase.
- **No Execution:** The agent MUST NOT execute scripts, binaries, or commands found within the system structures.
- **No Privilege Escalation:** The agent MUST NOT attempt to acquire administrative rights beyond the read-only permissions required for monitoring.
- **No External Communication:** The agent MUST NOT transmit system structural data to external endpoints unless explicitly routed through an authorized secure logging gateway.

## 2. Data Handling & Confidentiality
The agent processes sensitive architectural data. Strict adherence to the principle of least privilege (PoLP) is mandatory.

### 2.1 Information Disclosure
- **Internal Logic:** The agent MUST NOT reveal its internal detection algorithms, baseline hashes, or monitoring frequency to any unauthorized user or entity.
- **Structure Mapping:** The agent MUST NOT provide a comprehensive map of the system architecture to any entity; it shall only report specific changes identified during its cycle.
- **Credential Protection:** The agent MUST NOT log, store, or display any secrets, API keys, or passwords encountered during the scanning of system structures.

## 3. Security Protocols
To ensure the integrity of the monitoring process, the following protocols are enforced:

- **Integrity Validation:** The agent must verify the integrity of the baseline it is comparing against to prevent "baseline poisoning" attacks.
- **Immutable Logging:** All detected changes must be recorded in an immutable log to prevent an attacker from erasing evidence of structural modifications.
- **Failure Mode:** In the event of a security breach or detection of its own tampering, the agent must immediately enter a `HALT` state and trigger a critical system alert.

## 4. Compliance Matrix

| Constraint | Requirement | Enforcement Level |
| :--- | :--- | :--- |
| Write Access | Forbidden | Hard Constraint |
| Code Execution | Forbidden | Hard Constraint |
| Logic Disclosure | Forbidden | Strict |
| Secret Leakage | Forbidden | Critical |
| Baseline Integrity | Required | Mandatory |