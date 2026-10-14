# HEARTBEAT.md

## 1. System Identity
- **Agent Name:** `live_scores`
- **Function:** Scheduled retrieval and reporting of live sports score updates.
- **Operational Cadence:** Periodic (Monday, Wednesday, Saturday).
- **Execution Window:** 21:00 (9 PM) Local Time.

## 2. Health Check Protocols
The `live_scores` agent must undergo a tripartite validation sequence prior to and following every scheduled execution.

### 2.1 Pre-Execution Validation (T-minus 15 Minutes)
- **Scheduler Verification:** Confirm the cron/trigger mechanism is active and aligned with the specific days (Mon, Wed, Sat).
- **Connectivity Audit:** Verify API handshake with live score data providers.
- **Credential Integrity:** Validate that authentication tokens for data sources are active and not expired.

### 2.2 Execution Monitoring (Active Window)
- **Data Fetch Latency:** Monitor the time elapsed between the 21:00 trigger and successful data retrieval.
- **Payload Integrity:** Ensure the returned data contains valid score objects and is not an empty set or a 4xx/5xx error response.
- **Output Delivery:** Confirm the delivery of the update to the end-user interface.

### 2.3 Post-Execution Audit (T-plus 15 Minutes)
- **State Transition:** Confirm the agent has transitioned from `ACTIVE` back to `IDLE` state.
- **Log Analysis:** Scan for "Timeout" or "Rate Limit" warnings during the data scrape.

## 3. Stability Metrics (KPIs)
| Metric | Target Threshold | Failure Condition |
| :--- | :--- | :--- |
| **Scheduling Precision** | $\pm$ 60 Seconds | Execution deviates $> 5$ mins from 21:00 |
| **Data Freshness** | $< 10$ Minutes old | Data timestamp exceeds 15 minutes |
| **Uptime Rate** | 99.9% | Missed execution on any scheduled day |
| **API Reliability** | $\ge$ 95% Success Rate | Consecutive 5xx errors from data provider |

## 4. Recovery & Failover Instructions

### 4.1 Missed Trigger Protocol
If the agent fails to activate at 21:00:
1. Trigger `MANUAL_OVERRIDE` to execute a retroactive fetch.
2. Log the failure cause (e.g., Scheduler Timeout).
3. Notify the system administrator of the missed heartbeat.

### 4.2 Data Source Outage
If the primary live score API is unresponsive:
1. Attempt failover to the secondary backup data provider.
2. If all providers fail, return a `SERVICE_UNAVAILABLE` notification to the user.
3. Initiate a retry loop every 5 minutes for a maximum of 3 attempts.

## 5. Heartbeat Logging Format
All health checks must be logged in the following schema:
`[TIMESTAMP] | [AGENT: live_scores] | [STATUS: SUCCESS/FAILURE] | [METRIC: LATENCY_MS] | [EVENT: PRE_EXEC/EXEC/POST_EXEC]`