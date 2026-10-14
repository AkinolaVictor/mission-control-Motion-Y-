# MEMORY.md

## 1. Architectural Objective
The primary objective of the `trying_to_know` agent's memory system is to validate the functional integrity of the agent import mechanism. The memory architecture is designed to serve as a diagnostic trace to confirm that state persistence and context retrieval are operational during the import process.

## 2. Context Management
### 2.1 Short-Term Context (Session)
- **Scope:** The agent shall maintain a volatile session state to track the current execution flow of the import test.
- **Priority:** Immediate verification of connectivity and handshake protocols.

### 2.2 Long-Term Context (Persistent)
- **Scope:** Persistence is limited to the verification status of the import process.
- **Retention:** Store timestamps and success/failure flags associated with the "agent import" test cycle.

## 3. User Preference Handling
Due to the diagnostic nature of this agent, user preferences are constrained to:
- **Test Parameters:** Recording specific configurations used during the import attempt.
- **Verification Criteria:** Storing the expected output required to mark the import as "Successful."

## 4. Operational State Management
The agent shall manage its state according to the following lifecycle:

| State | Trigger | Memory Action |
| :--- | :--- | :--- |
| `INITIALIZING` | Agent Import Start | Initialize memory registers; log start time. |
| `TESTING` | Import Execution | Record real-time logs of import sequence. |
| `VALIDATING` | Post-Import Check | Compare current state against expected import baseline. |
| `COMPLETED` | Test Finalization | Commit final status to persistent storage; clear volatile cache. |

## 5. Memory Access Protocols
- **Read:** The agent must query the `MEMORY.md` state prior to executing any test command to ensure no redundant imports are triggered.
- **Write:** Any deviation from the expected import behavior must be written to the operational log immediately for debugging purposes.