# MEMORY.md: Context and State Management Protocol for `tester_rocket`

## 1. Operational Purpose
The `tester_rocket` agent is a high-fidelity virtual testing environment designed to simulate aerospace dynamics, structural integrity, and propulsion systems. The primary objective of the memory architecture is to minimize physical prototyping costs by maintaining a persistent, iterative record of virtual test results and engineering modifications.

## 2. Context Handling Framework

### 2.1 Simulation State Persistence
The agent must maintain a stateful record of the "Current Virtual Prototype." This includes:
- **Configuration Baseline:** Current specifications of the rocket (materials, fuel type, engine thrust, dimensions).
- **Iteration Versioning:** A chronological log of changes made between Virtual Test A and Virtual Test B to track performance delta.
- **Environmental Parameters:** Saved presets for simulation environments (e.g., atmospheric pressure, gravity constants, wind shear vectors).

### 2.2 Technical Domain Context
The agent shall categorize and prioritize incoming data into the following context buckets:
- **Aerodynamics:** Lift/drag coefficients and stability margins.
- **Thermodynamics:** Heat shield performance and combustion chamber temperatures.
- **Avionics:** Guidance, navigation, and control (GNC) logic and sensor telemetry.
- **Structural:** Stress points, vibration analysis, and material fatigue.

## 3. User Preference Management

### 3.1 Engineering Constraints
The agent must remember and adhere to the user's specific project constraints, including:
- **Budgetary Limits:** Virtual material costs vs. actual physical costs.
- **Safety Thresholds:** Defined "Failure Points" that trigger immediate simulation halts.
- **Target KPIs:** Specific performance goals (e.g., Target Apogee, Payload Capacity, Reusability Metrics).

### 3.2 Interaction Preferences
- **Reporting Granularity:** Preference for high-level executive summaries vs. raw telemetry data dumps.
- **Verification Rigor:** Whether the agent should perform a single simulation or a Monte Carlo analysis (1,000+ iterations) for statistical confidence.

## 4. Operational State Management

### 4.1 Short-Term Memory (Session State)
- **Active Test Loop:** Current variables being tuned in the immediate conversation.
- **Error Logs:** Immediate failures encountered during the current virtual launch sequence.

### 4.2 Long-Term Memory (Project Archive)
- **Knowledge Base:** Historical data of failed virtual tests to prevent redundant errors in future iterations.
- **Validated Designs:** A registry of "Flight-Ready" virtual configurations that have passed all simulation gates.

## 5. Memory Update Trigger Logic

| Trigger | Action | Memory Target |
| :--- | :--- | :--- |
| **Specification Change** | Update baseline parameters | Prototype Configuration |
| **Simulation Completion** | Log results $\rightarrow$ Compare to Baseline $\rightarrow$ Archive | Iteration Versioning |
| **User Constraint Update** | Overwrite previous threshold | Engineering Constraints |
| **Failure Analysis** | Tag failure mode (e.g., "Max-Q Structural Failure") | Knowledge Base |