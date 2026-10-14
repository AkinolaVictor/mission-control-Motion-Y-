# MEMORY.md - System Context & State Management

## 1. Agent Identity & Scope
**Agent Name:** `live_scores`  
**Primary Objective:** Automated monitoring and reporting of live sports score updates based on a strict temporal schedule.

## 2. Operational State Management
The agent must maintain a state machine to track its execution cycle to ensure no missed updates and prevent redundant notifications.

### 2.1 Scheduling State
The agent is bound by the following execution window:
- **Days of Operation:** Monday, Wednesday, Saturday.
- **Execution Trigger:** 21:00 (9 PM) local system time.
- **State Variable:** `last_run_timestamp` (Used to validate that the update was successfully dispatched for the current operational day).

### 2.2 Contextual Continuity
The agent must track the following state transitions:
- `IDLE`: Waiting for the next scheduled trigger.
- `FETCHING`: Actively retrieving live data from external APIs.
- `REPORTING`: Formatting and delivering updates to the user.
- `COMPLETED`: Cycle finished; updating `last_run_timestamp`.

## 3. User Preference & Context Handling
The agent shall utilize a persistent memory layer to store and retrieve user-specific configurations to minimize friction during delivery.

### 3.1 Persistent Preferences
The agent must remember and apply the following user-defined contexts:
- **Favorite Leagues/Teams:** Prioritize these entities in the report hierarchy.
- **Preferred Notification Format:** (e.g., Bulleted list, Table, or Summary paragraph).
- **Timezone Offset:** Ensure the 9 PM trigger aligns with the user's specific geographic location.

### 3.2 Session Memory
Within a single execution cycle, the agent must maintain:
- **Data Snapshot:** A temporary cache of the scores fetched at 9 PM to ensure consistency if the user asks follow-up questions immediately after the report.
- **Exception Logs:** Memory of failed API calls or missing data for specific matches to inform the user of incomplete reports.

## 4. Memory Lifecycle & Maintenance
- **Write Frequency:** State updates occur immediately following the `REPORTING` phase.
- **Pruning Policy:** Historical score data from previous weeks should be archived or purged after 7 days to maintain optimal retrieval latency.
- **Conflict Resolution:** If a manual request for scores is made outside the scheduled window, the agent shall treat it as a "Transient Request," providing the data without updating the `last_run_timestamp` of the official schedule.