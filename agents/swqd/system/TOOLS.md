# TOOLS.md - Agent: swqd

## 1. Architectural Overview
This document defines the toolset and functional capabilities required for the agent **swqd**. Based on the operational mandate **zzzcf**, the agent is architected to leverage a specific suite of capabilities to ensure the precise execution of its defined goals.

## 2. Tooling Strategy
The agent utilizes a modular tool-integration pattern, allowing for the orchestration of specialized functions to fulfill the requirements of **zzzcf**. All tool calls must be executed with strict adherence to the defined input/output schemas to maintain system stability.

## 3. Required Capabilities

### 3.1 Core Functional Tools
To achieve the objectives associated with **zzzcf**, the following capability sets are integrated:

*   **Contextual Processing Engine**: Tools designed to parse and analyze inputs relevant to the `zzzcf` domain.
*   **Execution Modules**: Specialized functions that translate processed logic into actionable outputs.
*   **Validation Framework**: A set of verification tools to ensure the resulting output aligns with the architectural specifications of the agent.

### 3.2 External Integrations
*   **API Connectivity**: Secure interfaces for data retrieval and transmission as necessitated by the `zzzcf` operational flow.
*   **State Management**: Tools for maintaining session persistence and historical context across complex task sequences.

## 4. Operational Constraints
To maintain the integrity of the **swqd** agent, the following tool-use constraints are enforced:
- **Precision Priority**: Tools must be invoked using the most specific parameters available to avoid ambiguity.
- **Error Handling**: Every tool invocation must be wrapped in a validation check to handle anomalies in the `zzzcf` process.
- **Resource Optimization**: Tool selection should prioritize the most computationally efficient path to reach the objective.

## 5. Capability Matrix

| Tool Category | Function | Purpose | Priority |
| :--- | :--- | :--- | :--- |
| Analysis | `analyze_zzzcf` | Primary decomposition of target goals | Critical |
| Action | `execute_swqd_logic` | Implementation of agent-specific operations | Critical |
| Verification | `validate_output` | Ensuring alignment with system requirements | High |
| Coordination | `sync_state` | Maintaining coherence across tool calls | Medium |