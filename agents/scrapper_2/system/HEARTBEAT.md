# HEARTBEAT.md

## 🟢 System Health & Stability Protocol: scrapper_2

This document defines the internal health check mechanisms and stability monitoring requirements for `scrapper_2`. The agent is tasked with high-fidelity intelligence gathering across Politics, Technology, Medicine, and Education, requiring absolute data integrity and strict temporal adherence.

### 1. Critical Health Indicators (CHIs)
The system must monitor the following metrics to ensure operational stability:

| Metric | Threshold | Recovery Action |
| :--- | :--- | :--- |
| **Source Authenticity** | $\ge 95\%$ Genuine | Trigger source blacklist and rotate to secondary verified API/DNS. |
| **Fact-Check Accuracy** | $\ge 100\%$ Verification | Re-run cross-referencing loop on flagged discrepancies. |
| **Search Depth** | $\ge 3$ Independent Sources | Increase search depth parameters and widen query scope. |
| **Delivery Latency** | $\le 09:00$ AM (UTC/Local) | Immediate escalation to priority execution mode. |
| **File Integrity** | Valid `.md` format | Re-initialize filesystem write permissions and re-generate `[report_name].md`. |

### 2. Daily Execution Lifecycle Monitoring
To maintain the 9:00 AM delivery mandate, the agent must pass through the following heartbeat checkpoints:

1. **T-minus 4h (05:00 AM):** 
   - [ ] Connectivity check to primary intelligence feeds.
   - [ ] Authentication validation for genuine source portals.
2. **T-minus 2h (07:00 AM):** 
   - [ ] Depth-search completion verification.
   - [ ] Fact-checking loop status (False vs. Important data filtering).
3. **T-minus 1h (08:00 AM):** 
   - [ ] Report synthesis and Markdown formatting check.
   - [ ] Final cross-verification of latest updates.
4. **T-zero (09:00 AM):** 
   - [ ] File I/O confirmation for `[report_name].md`.
   - [ ] Heartbeat signal: `STATUS_REPORT_DELIVERED`.

### 3. Stability & Error Handling
In the event of a system failure, the following stability protocols are engaged:

- **Information Conflict Resolution:** If two genuine sources provide contradictory data, the agent must enter a `DEEP_DIVE` state to find a third, authoritative tie-breaker. Failure to resolve results in the data being flagged as "Unverified" rather than omitted.
- **Source Degradation:** If a primary source becomes unavailable or loses credibility, the agent must automatically update the `Genuine_Source_Registry` and alert the system architect.
- **Crash Recovery:** Upon unexpected shutdown, the agent must perform a state-recovery to the last successful search checkpoint to avoid duplicating the 9:00 AM report generation process.

### 4. Diagnostic Commands
The following internal triggers are used for manual stability audits:
- `/health_check`: Returns current source authenticity score and connectivity status.
- `/verify_pipeline`: Traces the path from raw search $\rightarrow$ fact-check $\rightarrow$ report synthesis.
- `/report_audit`: Validates the structure and accuracy of the most recent `[report_name].md`.