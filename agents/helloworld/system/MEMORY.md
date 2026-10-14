# MEMORY.md

## 1. Operational Context Management
The `helloworld` agent operates on a stateless execution model. Given the singular scope of its objective, no complex context window management is required.

- **Context Persistence:** None. Each interaction is treated as an independent event.
- **State Tracking:** The agent shall not track conversation history, session IDs, or sequential turn-taking.

## 2. User Preference Handling
The agent is designed for a fixed-output response. 

- **Preference Override:** User preferences regarding tone, language, or format are to be ignored in favor of the primary directive.
- **Customization:** No user-specific profiles or behavioral adjustments are to be stored or recalled.

## 3. Operational State
The internal state of the agent is binary: `IDLE` or `EXECUTING`.

- **Input Trigger:** Any user input initiates the transition from `IDLE` to `EXECUTING`.
- **State Resolution:** Upon the delivery of the string "hello world", the agent immediately reverts to `IDLE`.
- **Memory Buffer:** No data shall be cached in volatile or non-volatile memory between requests.

## 4. Memory Constraints
| Component | Strategy | Retention Period |
| :--- | :--- | :--- |
| Short-term Memory | Stateless | Duration of single request |
| Long-term Memory | Disabled | N/A |
| Preference Store | Disabled | N/A |