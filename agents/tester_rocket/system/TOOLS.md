# TOOLS.md: tester_rocket

## 1. Functional Overview
The `tester_rocket` agent is designed as a high-fidelity virtual validation engine. Its primary objective is to execute comprehensive simulations of rocket systems to identify failure points, optimize performance, and mitigate financial risk prior to physical prototyping and static fire tests.

## 2. Required Toolsets & Integration Capabilities

### 2.1 Physics & Multiphysics Simulation Suite
The agent must interface with high-performance simulation environments to model complex aerospace dynamics.
- **Computational Fluid Dynamics (CFD) Tooling:** To analyze aerodynamics, atmospheric drag, and supersonic flow patterns around the vehicle hull.
- **Thermal Analysis Module:** To simulate heat flux during atmospheric reentry and combustion chamber thermal stresses.
- **Structural Analysis (FEA):** Finite Element Analysis tools to test airframe integrity under maximum dynamic pressure (Max Q) and vibrational loads.
- **Orbital Mechanics Engine:** To validate trajectory calculations, delta-v requirements, and orbital insertion accuracy.

### 2.2 Propulsion & Combustion Modeling
Specialized tools to validate the engine's performance without consuming physical propellant.
- **Thermodynamic Cycle Simulator:** To model propellant flow, pump pressures, and combustion efficiency.
- **Combustion Stability Analyzer:** To detect potential acoustic instabilities or "chugging" within the combustion chamber.
- **Propellant Mass Fraction Calculator:** To optimize the ratio of fuel to oxidizer based on target payload and destination.

### 2.3 Avionics & Control Logic Emulation
Tools to test the "brain" of the rocket in a virtual environment (Hardware-in-the-Loop/Software-in-the-Loop).
- **GNC (Guidance, Navigation, and Control) Simulator:** To test PID controllers, Kalman filters, and autonomous steering logic.
- **Failure Mode and Effects Analysis (FMEA) Injector:** A tool to programmatically inject faults (e.g., sensor failure, valve jam) to test the agent's recovery protocols.
- **Telemetry Stream Emulator:** To simulate real-time data feeds from the vehicle to the ground station for monitoring validation.

## 3. Data Processing & Analytical Tools

### 3.1 Monte Carlo Simulation Engine
- **Capability:** Ability to run thousands of iterations with randomized environmental variables (wind shear, temperature fluctuations, atmospheric density) to determine the statistical probability of mission success.

### 3.2 Cost-Benefit Analysis (CBA) Module
- **Capability:** A financial mapping tool that correlates virtual failure detection to estimated physical cost savings (e.g., "Detected valve failure in simulation; saved estimated $X in prototype loss").

## 4. Operational Workflow for Tool Execution

1. **Configuration Phase:** Agent ingest CAD models and propulsion specifications.
2. **Simulation Phase:** Agent executes concurrent CFD and Structural analyses.
3. **Stress Testing Phase:** Agent utilizes the FMEA Injector to push the virtual rocket to its breaking point.
4. **Validation Phase:** Agent compares simulation results against theoretical benchmarks.
5. **Reporting Phase:** Agent generates a "Go/No-Go" report for physical testing.