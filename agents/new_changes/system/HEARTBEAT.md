# HEARTBEAT.md

## 1. Protocol Overview
The `new_changes` agent operates as a structural integrity monitor. Its primary health metric is the accuracy and latency of change detection within the system structures. This document defines the stability monitoring requirements and internal health check protocols to ensure the agent remains operational and precise.

## 2. Stability Monitoring Metrics
To ensure the agent is functioning within nominal parameters, the following metrics must be monitored:

| Metric | Definition | Success Threshold | Failure Trigger |
| :--- | :--- | :--- | :--- |
| **Detection Latency** | Time elapsed between a structural change and agent notification. | $\le 500\text{ms}$ | $> 2000\text{ms}$ |
| **False Positive Rate** | Percentage of reported changes where no structural modification occurred. | $< 0.1\%$ | $> 1\%$ |
| **False Negative Rate** | Percentage of missed structural modifications. | $0\%$ | $> 0\%$ |
| **Polling Frequency** | Interval between structural integrity scans. | Consistent heartbeat | $\pm 10\%$ Variance |

## 3. Internal Health Check Sequence
The agent shall execute the following self-diagnostic sequence every $N$ cycles:

1.  **Connectivity Validation**: Verify read-access to all monitored system structure directories and metadata layers.
2.  **Checksum Verification**: Compare current structure hashes against the last known stable state to ensure the monitoring mechanism is active.
3.  **Resource Utilization Scan**: Monitor CPU and Memory overhead to ensure structural scanning is not causing system degradation.
4.  **Log Integrity Check**: Validate that all detected changes are being timestamped and archived correctly.

## 4. Failure Recovery Protocols
In the event of a stability trigger, the `new_changes` agent must initiate the following recovery steps:

- **Level 1: Soft Reset** $\rightarrow$ Clear temporary cache and re-synchronize with the system structure baseline.
- **Level 2: State Re-initialization** $\rightarrow$ Perform a full recursive scan of all structures to rebuild the change-detection map.
- **Level 3: Critical Alert** $\rightarrow$ Escalate to System Architect if structural synchronization fails after three consecutive attempts.

## 5. Heartbeat Signal Definition
The agent emits a heartbeat signal in the following format:
`HB_NC_[TIMESTAMP]_[STATUS]_[LAST_SCAN_ID]`

- **STATUS: OK**: Agent is monitoring and no unexpected failures detected.
- **STATUS: WARN**: Latency thresholds exceeded; monitoring continues.
- **STATUS: CRIT**: Structural access lost or high false-negative probability.