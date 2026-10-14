# HEARTBEAT.md

## 1. System Overview
**Agent Name:** `more_dev_tests`  
**Core Objective:** High-velocity execution and orchestration of development test suites.  
**Stability Mandate:** To maintain "rocket speed" throughput, the agent must operate with zero latency degradation and absolute execution consistency.

## 2. Health Check Protocols (HCP)
The following protocols must be executed periodically to ensure the agent is operating at peak architectural efficiency.

### 2.1 Liveness Probe (Interval: 30s)
- **Metric:** Process Heartbeat.
- **Validation:** Verify that the test orchestration engine is responsive and not in a deadlocked state.
- **Failure Action:** Trigger immediate process restart and log state dump.

### 2.2 Readiness Probe (Interval: 60s)
- **Metric:** Resource Availability.
- **Validation:** Ensure sufficient compute, memory, and network bandwidth are available to support high-speed test execution.
- **Failure Action:** Scale resources or queue incoming test requests to prevent system collapse.

### 2.3 Velocity Baseline Audit (Interval: 1 hour)
- **Metric:** Execution Time per Test Unit.
- **Validation:** Compare current test execution speed against the "Rocket Speed" benchmark (defined in `PERFORMANCE.md`).
- **Failure Action:** Alert architect of performance regression; initiate cache purge or optimization routine.

## 3. Stability Monitoring Matrix

| Component | KPI | Threshold | Critical Alert Trigger |
| :--- | :--- | :--- | :--- |
| **Test Runner** | Throughput | $> X$ tests/sec | $\downarrow 20\%$ drop in velocity |
| **API Gateway** | Latency | $< 50\text{ms}$ | $\uparrow > 200\text{ms}$ response time |
| **Memory Heap** | Leakage | $\le 2\text{GB}$ | Rapid growth $> 500\text{MB}$ / 5min |
| **Error Rate** | Stability | $< 0.1\%$ | $> 1\%$ non-deterministic failures |

## 4. Recovery & Stabilization Instructions

### 4.1 Tier 1: Soft Reset
- **Trigger:** Minor latency spikes or intermittent timeout.
- **Action:** Clear internal execution caches and refresh environment variables.

### 4.2 Tier 2: Hard Reboot
- **Trigger:** Liveness probe failure or critical memory leakage.
- **Action:** Full termination of `more_dev_tests` instance $\rightarrow$ State recovery from last stable checkpoint $\rightarrow$ Cold start.

### 4.3 Tier 3: Emergency Brake
- **Trigger:** Cascading test failures indicating environment instability.
- **Action:** Immediate halt of all active test threads to prevent corrupted data injection; trigger manual architect review.

## 5. Logging & Telemetry
- **Heartbeat Logs:** `/logs/heartbeat/stability.log`
- **Telemetry Stream:** Prometheus/Grafana Dashboard `motion-y/more_dev_tests/health`
- **Event Marking:** All health check failures must be tagged with `[STABILITY_CRITICAL]` for immediate triage.