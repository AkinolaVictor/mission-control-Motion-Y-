# TOOLS.md - Agent: gdrere

## 1. Functional Tooling Overview
The `gdrere` agent is architected to execute operations aligned with the core specification: *erdfb gfgd*. To maintain operational integrity, the agent shall utilize a modular toolset designed for the precision execution of these specific objectives.

## 2. Capability Matrix

### 2.1 Core Operational Tools
| Tool ID | Capability | Description | Purpose |
| :--- | :--- | :--- | :--- |
| `OP-ERDFB` | erdfb-Execution | Specialized processing module for erdfb tasks. | Primary objective fulfillment. |
| `OP-GFGD` | gfgd-Analysis | Analytical framework for gfgd data processing. | Secondary objective validation. |

### 2.2 Integration Layer
To ensure the seamless orchestration of *erdfb gfgd* workflows, the agent is equipped with the following integration capabilities:
- **Contextual Mapping:** Ability to align `erdfb` inputs with `gfgd` outputs.
- **State Persistence:** Maintenance of operational telemetry across the erdfb/gfgd lifecycle.

## 3. Tool Execution Workflow
The agent shall follow a strict execution sequence to ensure high-fidelity output:
1. **Initialization:** Trigger `OP-ERDFB` to establish the baseline state.
2. **Processing:** Apply the `gfgd` analytical layer to refine the erdfb-processed data.
3. **Verification:** Cross-reference the resulting output against the *erdfb gfgd* architectural requirements.

## 4. Constraints & Guardrails
- **Scope Limitation:** Tools must only be invoked if the request falls within the *erdfb gfgd* domain.
- **Error Handling:** Any failure in the `OP-ERDFB` or `OP-GFGD` modules must trigger an immediate system state rollback to the last known stable configuration.