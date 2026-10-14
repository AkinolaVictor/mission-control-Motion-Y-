# HEARTBEAT.md

## 1. System Overview
**Agent Name:** waower  
**Primary Function:** Continuous discovery, curation, and delivery of cutting-edge technological updates.  
**Stability Objective:** Ensure zero-latency gaps in tech-trend acquisition and maintain high-fidelity accuracy in information synthesis.

## 2. Health Check Protocols (HCP)

### 2.1 Information Pipeline Integrity
The `waower` agent must execute a recursive check on its data ingestion layers to ensure "wow-factor" content is current.
- **Frequency:** Every 3600 seconds.
- **Checklist:**
    - [ ] **API Connectivity:** Verify active handshakes with primary tech news aggregates, research repositories, and developer forums.
    - [ ] **Latency Audit:** Measure the delta between a tech announcement's timestamp and the agent's internal indexing.
    - [ ] **Source Validity:** Validate that sources are providing high-signal, low-noise data to maintain the "wow" quality threshold.

### 2.2 Cognitive Stability Monitoring
Monitoring the logic engine to prevent hallucinations or repetitive output patterns.
- **Entropy Check:** Monitor for repetitive phrasing or "stale" updates.
- **Synthesis Validation:** Ensure the agent is not merely aggregating links but synthesizing "new tech" insights as per the core description.
- **Context Window Health:** Clear transient cache to prevent drift in emerging tech definitions.

## 3. Stability Metrics (SLIs)

| Metric | Threshold | Alert Trigger |
| :--- | :--- | :--- |
| **Update Recency** | < 12 Hours | $\Delta T > 24h$ |
| **Novelty Ratio** | $> 80\%$ New Content | $< 50\%$ New Content |
| **API Success Rate** | $> 99.9\%$ | $< 95\%$ |
| **Response Fidelity** | High (Tech-Accurate) | User correction reported |

## 4. Recovery & Failover Procedures

### 4.1 Signal Loss Protocol
In the event of a primary data source failure:
1. Trigger failover to secondary "Emerging Tech" mirrors.
2. Initiate a crawl of curated high-authority developer blogs.
3. Log the outage in the `SYSTEM_LOGS` and notify the architect.

### 4.2 Content Stagnation Reset
If the agent fails to provide "new" updates for two consecutive cycles:
1. Force-refresh the keyword index (e.g., rotate from "LLMs" to "Quantum Computing" or "Biotech").
2. Re-calibrate the novelty filter to widen the discovery net.
3. Execute a `HEARTBEAT_RESET` command to clear the short-term memory buffer.

## 5. Heartbeat Signature
Each successful health check must append the following telemetry to the system log:
`[TIMESTAMP] | AGENT: waower | STATUS: OPTIMAL | NOVELTY_INDEX: [Value] | PIPELINE: ACTIVE`