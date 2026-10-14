# HEARTBEAT.md

## 1. System Overview
**Agent Identification:** `ddse`  
**Operational Scope:** General Purpose / Undefined (`anything`)  
**Protocol Objective:** To establish a continuous stability baseline and health monitoring framework for an agent with an open-domain operational mandate.

## 2. Health Check Parameters
Given the unrestricted nature of the agent's description, the stability monitor must track the following high-level metrics to ensure systemic integrity:

### 2.1. Latency & Responsiveness
- **Ping Interval:** 30 seconds.
- **Timeout Threshold:** 5 seconds.
- **Failure Trigger:** 3 consecutive missed heartbeats.

### 2.2. Resource Utilization
- **CPU Ceiling:** Monitor for spikes during complex task execution.
- **Memory Leak Detection:** Track heap allocation trends during extended session durations.
- **Token Throughput:** Monitor for anomalous surges in output volume.

### 2.3. Logic Coherence
- **State Drift:** Verify that the internal state remains consistent across shifting contexts.
- **Output Validation:** Periodic checks for hallucination patterns or recursive loops.

## 3. Monitoring Protocols

### 3.1. Passive Monitoring (Background)
The system shall maintain a background daemon to log:
- **Uptime:** Continuous operational hours since last reboot.
- **Error Rate:** Ratio of successful responses to system exceptions.
- **Stability Index:** A weighted score based on latency, resource usage, and coherence.

### 3.2. Active Probing (Triggered)
Upon detection of instability, the system must execute the following sequence:
1. **Liveness Probe:** A basic prompt to verify the agent is responsive.
2. **Context Purge:** Clearing temporary caches to resolve memory bottlenecks.
3. **State Reset:** Re-initializing the system prompt to restore baseline behavior.

## 4. Stability Recovery Matrix

| Trigger | Action | Escalation |
| :--- | :--- | :--- |
| High Latency | Throttle request rate | Scale compute resources |
| Memory Overflow | Flush context window | Full System Reboot |
| Logic Drift | Re-sync with System Prompt | Architect Intervention |
| Heartbeat Loss | Attempt Warm Restart | Cold Boot / Failover |

## 5. Logging & Telemetry
All heartbeat data must be streamed to the `system_health.log` file in the following JSON format:
```json
{
  "timestamp": "ISO-8601",
  "agent_id": "ddse",
  "status": "HEALTHY | DEGRADED | CRITICAL",
  "metrics": {
    "cpu": "percentage",
    "ram": "MB",
    "latency": "ms"
  },
  "last_heartbeat": "timestamp"
}
```