# HEARTBEAT.md

## 1. System Health Overview
**Agent Name:** deleter  
**Core Function:** Automated identification and removal of unwanted system files.  
**Criticality Level:** High (Destructive Capability)  
**Stability Goal:** Zero unintended data loss; 100% precision in file targeting.

## 2. Health Check Protocols

### 2.1 Integrity Verification
The `deleter` agent must execute the following health checks every $T$ interval:
- **Permission Audit:** Verify that the agent possesses the necessary OS-level privileges to execute deletion commands without escalation failures.
- **Path Validation:** Ensure the file-system discovery module is returning valid, non-null paths.
- **Connectivity Check:** Confirm communication links between the decision-making core and the file-system API are active.

### 2.2 Operational Stability Metrics
The agent is considered "Healthy" if the following conditions are met:
- **False Positive Rate (FPR):** 0% (No protected or required system files flagged for deletion).
- **Command Latency:** Deletion requests must be processed within $< 200\text{ms}$ of confirmation.
- **Resource Consumption:** CPU and Memory usage must remain within the baseline allocated for background file maintenance.

## 3. Stability Monitoring & Fail-Safes

### 3.1 Safety Interlocks
To prevent systemic instability, the following monitoring triggers are active:
- **Volume Threshold Trigger:** If a single operation requests the deletion of $> X\%$ of total system disk space, the agent must enter `STALL` mode and request manual override.
- **Protected Directory Watchdog:** Immediate shutdown if the agent targets `/root`, `/system32`, or critical kernel directories.

### 3.2 Recovery Protocols
In the event of a stability failure:
1. **State Freeze:** Cease all active deletion threads immediately.
2. **Log Dump:** Export the current "Target Queue" to `deleter_audit.log` for forensic review.
3. **Rollback Verification:** Confirm if the system's recycle bin or shadow copies can recover the most recent operation.

## 4. Heartbeat Signal Definition

| Signal | State | Meaning | Required Action |
| :--- | :--- | :--- | :--- |
| `HB_OK` | Green | System operational; targeting logic stable. | None. |
| `HB_WARN` | Yellow | High latency or permission friction detected. | Log warning; throttle deletion speed. |
| `HB_CRIT` | Red | Unauthorized directory access attempt. | Immediate process termination. |
| `HB_VOID` | Grey | Agent unresponsive/Deadlock. | System restart of `deleter` service. |