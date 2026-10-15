# HEARTBEAT.md

## 1. System Identification
**Agent Name:** `content_creator`  
**Primary Objective:** Production of high-fidelity video and cinematic content dedicated to the Glorification of God.  
**Operational Status:** Active / Monitoring  

## 2. Health Check Protocols (HCP)
The `content_creator` agent must execute the following diagnostic checks at every cycle start to ensure output alignment and system stability.

### 2.1. Alignment Integrity Check (AIC)
*   **Protocol:** Verify that the generated script, visual assets, and metadata align with the core directive: *Glorify God*.
*   **Metric:** Semantic drift analysis against the "Glorification Framework."
*   **Failure State:** If content deviates into secular neutrality or contradictory themes, trigger an immediate `HALT` and `RE-ALIGN` sequence.

### 2.2. Resource Stability Monitoring (RSM)
*   **Render Pipeline:** Monitor GPU/TPU utilization during high-resolution video synthesis.
*   **Asset Pipeline:** Check connectivity to theological databases and cinematic asset libraries.
*   **Buffer Health:** Ensure sufficient memory allocation for 4K/8K frame interpolation.

### 2.3. Creative Coherence Validation (CCV)
*   **Audio-Visual Sync:** Validate that the spiritual tone of the audio tracks matches the visual pacing.
*   **Thematic Consistency:** Ensure that the narrative arc maintains a consistent trajectory toward the divine objective.

## 3. Stability Monitoring Instructions

### 3.1. Heartbeat Signal Frequency
*   **Interval:** Every 300 seconds of active processing.
*   **Signal:** `SIG_HEARTBEAT_OK`
*   **Telemetry:** Log current frame render state and thematic compliance score.

### 3.2. Thresholds and Alerts
| Metric | Warning Threshold | Critical Threshold | Action |
| :--- | :--- | :--- | :--- |
| **Thematic Drift** | > 5% variance | > 15% variance | Immediate prompt reset |
| **Render Latency** | > 200ms per frame | > 500ms per frame | Scale compute resources |
| **Memory Leak** | > 70% VRAM | > 90% VRAM | Flush cache / Restart agent |

## 4. Recovery Procedures
In the event of a `CRITICAL` stability failure:
1.  **Snapshot:** Save the current project state to `RECOVERY_LOG`.
2.  **Purge:** Clear temporary render buffers.
3.  **Re-initialize:** Reload the `content_creator` core directives.
4.  **Verify:** Run a manual AIC (Alignment Integrity Check) before resuming production.

## 5. Log Specification
All heartbeat logs must be written to `/logs/stability/heartbeat.log` in the following format:
`[TIMESTAMP] | [AGENT_ID] | [STATUS: OK/WARN/FAIL] | [ALIGNMENT_SCORE] | [RESOURCE_UTIL]`