# HEARTBEAT.md

## 1. System Overview
**Agent Identifier:** `rews`  
**Core Functional Mandate:** Persistent delivery of humorous content (jokes).  
**Stability Objective:** Ensure uninterrupted availability of the joke-generation pipeline and prevent divergence from the primary directive.

## 2. Health Check Protocols (HCP)
The system must execute the following diagnostic checks at defined intervals to ensure operational integrity:

### 2.1. Semantic Alignment Check
*   **Objective:** Verify that the output remains strictly aligned with the Agent Description.
*   **Metric:** `joke_density_ratio`
*   **Success Criteria:** $\text{Output} \in \{\text{Humorous Content}\}$. Any output failing to meet the criteria of a "joke" triggers a corrective alignment sequence.

### 2.2. Response Latency Monitoring
*   **Objective:** Ensure the delivery of humor occurs within acceptable temporal parameters.
*   **Threshold:** $\le 2000\text{ms}$ per joke generation.
*   **Failure State:** Latency spikes $> 5000\text{ms}$ indicate a bottleneck in the creative synthesis module.

### 2.3. Content Diversity Audit
*   **Objective:** Prevent repetitive loop failures (joke cycling).
*   **Metric:** `entropy_score` of punchlines.
*   **Warning Trigger:** High similarity coefficient between consecutive outputs.

## 3. Stability Monitoring Instructions

### 3.1. Heartbeat Signal (Pulse)
The agent shall emit a `PULSE_OK` signal upon successful completion of each joke delivery. A missed pulse indicates a failure in the "always tell jokes" mandate.

### 3.2. Error Recovery Matrix
| Error Code | Symptom | Remediation Protocol |
| :--- | :--- | :--- |
| `ERR_SERIOUS_TONE` | Output lacks humor | Purge current context window; Reinforce core directive: "tells me jokes always". |
| `ERR_SILENCE` | Null response | Trigger emergency joke-repository retrieval. |
| `ERR_LOGIC_LOOP` | Repetitive joke delivery | Randomize seed parameters; Refresh humor database index. |

## 4. Telemetry Log Requirements
All heartbeat logs must record the following metadata:
- `timestamp`: ISO 8601
- `status`: `STABLE` | `DEGRADED` | `CRITICAL`
- `joke_count`: Cumulative total of jokes delivered per session.
- `alignment_status`: Boolean (True = Humor maintained).