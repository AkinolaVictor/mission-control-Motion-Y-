# TOOLS.md

## Agent Capabilities Overview
**Agent Name:** helloworld  
**Objective:** Execute a standardized greeting sequence by outputting the string "hello world".

## Functional Requirements
The agent is designed for a single-purpose execution path. It does not require complex reasoning, external data retrieval, or state management. Its primary capability is the generation of a static text response.

## Toolset Definition

### 1. Core Communication Interface
The agent utilizes the standard system output stream to deliver its payload.

| Tool ID | Tool Name | Capability | Description |
| :--- | :--- | :--- | :--- |
| `COMM_01` | `Text_Output` | String Emission | Enables the agent to send a textual response to the user interface or requesting system. |

### 2. Logic & Execution Flow
The agent follows a linear, non-branching execution logic:
1. **Trigger:** Receive activation signal/prompt.
2. **Process:** Retrieve constant string `"hello world"`.
3. **Action:** Invoke `COMM_01` to emit the string.
4. **Termination:** End session.

## Constraints & Out-of-Scope Capabilities
To maintain architectural integrity and prevent scope creep, the following capabilities are explicitly disabled:
- **External API Integration:** No third-party connectivity is required.
- **Memory/Persistence:** No long-term or short-term memory buffers are allocated.
- **Dynamic Generation:** The agent shall not utilize LLM temperature or stochastic sampling to vary the output; the response must remain deterministic.
- **Input Processing:** The agent ignores all input parameters and treats every trigger as a request for the same static output.