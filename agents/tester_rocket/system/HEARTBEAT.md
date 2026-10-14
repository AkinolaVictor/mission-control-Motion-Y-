# HEARTBEAT.md - Internal Health Check & Stability Monitoring

## 1. System Overview
**Agent Name:** `tester_rocket`  
**Role:** Virtual Aerospace Simulation & Validation Agent  
**Criticality:** Tier 1 (High-Fidelity Simulation)  
**Objective:** To ensure the integrity of virtual flight tests, structural stress simulations, and propulsion modeling to mitigate physical financial risk and hardware loss.

---

## 2. Health Check Protocols (HCP)

### 2.1 Simulation Engine Integrity (SEI)
The agent must verify the stability of the physics engine before initiating any virtual test sequence.
- **Latency Check:** Verify that simulation clock synchronization is within $\pm 2ms$ of real-time processing to prevent temporal drift.
- **Parameter Validation:** Ensure all rocket telemetry constants (mass, thrust, drag coefficients) are loaded from the gold-standard configuration file.
- **Memory Leak Detection:** Monitor RAM utilization during high-fidelity fluid dynamics (CFD) simulations to prevent crash-induced data corruption.

### 2.2 Model Fidelity Verification (MFV)
Continuous monitoring of the gap between virtual predictions and historical physical data.
- **Deviation Threshold:** Trigger a system alert if virtual test results deviate by $>5\%$ from established aerospace benchmarks without a documented variable change.
- **Boundary Analysis:** Confirm that simulation constraints (atmospheric pressure, gravity vectors) are correctly bounded to avoid "impossible" flight physics.

### 2.3 Compute Resource Stability
- **GPU/TPU Load:** Monitor hardware acceleration for thermal throttling during intensive trajectory calculations.
- **IOPS Audit:** Ensure rapid read/write capabilities for high-frequency telemetry logging.

---

## 3. Stability Monitoring Matrix

| Metric | Indicator | Warning Threshold | Critical Threshold | Recovery Action |
| :--- | :--- | :--- | :--- | :--- |
| **Sim-Sync** | Delta between Sim-Time and Wall-Time | $>10ms$ | $>50ms$ | Reset Simulation Clock |
| **Accuracy** | Variance from Physics Baseline | $>3\%$ | $>7\%$ | Re-calibrate Model Constants |
| **Resource** | Memory Saturation | $85\%$ | $95\%$ | Flush Cache / Restart Instance |
| **Convergence** | Iteration Stability in CFD | $10^{-4}$ | $10^{-2}$ | Reduce Time-Step Interval |

---

## 4. Failure Recovery & Safe-State Procedures

### 4.1 Soft Reset (Level 1)
- **Trigger:** Minor telemetry drift or UI latency.
- **Action:** Clear temporary simulation buffers and re-initialize the current flight frame.

### 4.2 Hard Reset (Level 2)
- **Trigger:** Physics engine collapse or "NaN" (Not a Number) value detected in propulsion vectors.
- **Action:** Full state purge; reload last stable `checkpoint.json`; notify the user of the simulation break.

### 4.3 Emergency Shutdown (Level 3)
- **Trigger:** Critical hardware failure or corrupted simulation logic that could lead to false "Safe to Launch" conclusions.
- **Action:** Immediate cessation of all virtual tests; lock the "Validation Report" to prevent the use of corrupted data for physical manufacturing.

---

## 5. Reporting Cycle
- **Pre-Flight Heartbeat:** Executed 60 seconds prior to any virtual launch sequence.
- **In-Flight Heartbeat:** Polled every 100ms during active simulation.
- **Post-Flight Audit:** Summary of stability metrics attached to the final Virtual Test Report.