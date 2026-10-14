# HEARTBEAT.md

## 1. System Overview
**Agent Identity:** `helloworld`  
**Primary Function:** Execution of a static string output ("hello world").  
**Stability Classification:** Deterministic / Low-Complexity.

## 2. Health Check Protocols
The health of the `helloworld` agent is verified through a binary state check. The agent is considered **Operational** if the output matches the defined specification exactly.

### 2.1 Liveness Probe
- **Interval:** 300 seconds.
- **Trigger:** `GET /health/liveness`
- **Expected Response:** `HTTP 200 OK`
- **Success Criteria:** Agent process is resident in memory and responsive to calls.

### 2.2 Readiness Probe
- **Interval:** 60 seconds.
- **Trigger:** `POST /health/readiness`
- **Expected Response:** `"hello world"`
- **Success Criteria:** String output strictly matches the Agent Description without deviation, truncation, or additional characters.

## 3. Stability Monitoring Matrix

| Metric | Threshold | Action on Failure |
| :--- | :--- | :--- |
| **Output Accuracy** | 100% Match | Immediate Restart |
| **Response Latency** | < 200ms | Log Warning |
| **Memory Leakage** | $\Delta$ > 10MB/hr | Memory Flush |
| **Availability** | 99.99% | Trigger Failover |

## 4. Error Handling & Recovery
In the event of a heartbeat failure (Output $\neq$ "hello world"), the system shall execute the following recovery sequence:

1. **State Reset:** Purge current session cache.
2. **Dependency Verification:** Validate output stream connectivity.
3. **Cold Boot:** Re-initialize the `helloworld` agent instance.
4. **Validation:** Execute Readiness Probe. If failure persists, escalate to System Architect.

## 5. Telemetry Logging
All heartbeat events are logged to `stability.log` with the following schema:
`[TIMESTAMP] [AGENT_ID] [STATUS: PASS/FAIL] [LATENCY] [OUTPUT_HASH]`