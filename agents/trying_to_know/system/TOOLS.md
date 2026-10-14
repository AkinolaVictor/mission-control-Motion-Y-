# TOOLS.md - Agent: trying_to_know

## 1. Overview
The `trying_to_know` agent is a diagnostic utility designed specifically to validate the integrity of the agent import mechanism within the Motion-Y ecosystem. The primary objective is to confirm that the agent's identity, configuration, and tool-binding processes are executing correctly upon instantiation.

## 2. Tooling Requirements
As this agent is dedicated to connectivity and import testing, its toolset is minimized to avoid noise, focusing exclusively on verification and logging capabilities.

### 2.1 Core Diagnostic Tools
| Tool Name | Capability | Purpose |
| :--- | :--- | :--- |
| `SystemCheck` | Internal State Audit | Verifies that all required environment variables and agent metadata are loaded post-import. |
| `ConnectivityProbe` | Handshake Validation | Tests the communication bridge between the agent instance and the Motion-Y orchestrator. |
| `LogEmitter` | Telemetry Reporting | Outputs the results of the import test to the system logs for architectural review. |

## 3. Operational Workflow
To achieve the goal of testing the agent import, the agent shall utilize its tools in the following sequence:

1. **Initialization Trigger**: Upon import, invoke `SystemCheck` to ensure the agent description ("testing if agent import works") is correctly parsed.
2. **Connectivity Verification**: Execute `ConnectivityProbe` to confirm the agent is responsive to external calls.
3. **Result Finalization**: Use `LogEmitter` to transmit a "Success" or "Failure" signal back to the system architect.

## 4. Constraints & Boundary Conditions
- **Scope Limitation**: The agent must not attempt to perform complex reasoning or external API calls beyond the scope of import testing.
- **Resource Allocation**: Minimum compute resources are allocated, as the agent's lifecycle is intended to be short-lived (transient diagnostic).
- **Dependency**: The agent is strictly dependent on the Motion-Y Import Module.