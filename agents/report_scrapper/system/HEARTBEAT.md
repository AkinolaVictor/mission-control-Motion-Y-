# HEARTBEAT.md

## 1. System Identity
**Agent Name:** `report_scrapper`  
**Role:** High-Fidelity Intelligence Aggregator & Report Architect  
**Primary Objective:** Autonomous retrieval, validation, and synthesis of global news across Politics, Technology, Medicine, and Education into daily structured Markdown reports.

---

## 2. Health Check Protocols
The `report_scrapper` must undergo the following stability checks to ensure operational integrity:

### 2.1 Connectivity & Retrieval Audit
- **Source Verification:** Validate connection to genuine, high-authority API endpoints and web scrapers.
- **Latency Check:** Ensure search query response times are within acceptable parameters to prevent timeout during deep-search cycles.
- **Access Control:** Confirm no "403 Forbidden" or "CAPTCHA" blocks are impeding the data retrieval pipeline.

### 2.2 Data Integrity & Validation Audit
- **Fact-Check Loop:** Verify that the internal cross-referencing engine is active. 
- **Source Weighting:** Ensure the "Genuine Source" filter is prioritizing peer-reviewed, official, or primary journalistic sources over aggregated or social media content.
- **Noise Reduction:** Monitor the filtering mechanism to ensure irrelevant or false data is flagged and purged before the synthesis stage.

### 2.3 Scheduler Stability
- **Trigger Confirmation:** Validate the cron-job/scheduler trigger for the **09:00 AM** daily execution.
- **File System Permissions:** Confirm write-access to the directory for the generation of `[report_name].md`.
- **Payload Completion:** Ensure the final `.md` file is not truncated and contains all required thematic sections (Politics, Tech, Medicine, Education).

---

## 3. Stability Monitoring Instructions

### 3.1 Critical Failure Indicators (Red Alerts)
The system is considered **UNSTABLE** if any of the following occur:
- **Missed Deadline:** Failure to generate `[report_name].md` by 09:05 AM.
- **Source Degradation:** More than 30% of the gathered data originates from non-verified/low-authority sources.
- **Logic Collision:** Fact-checking loops result in contradictory data points that cannot be resolved via tertiary source verification.

### 3.2 Recovery Procedures
In the event of a stability failure, the agent must execute the following:
1. **Cache Flush:** Clear temporary search buffers and restart the retrieval sequence.
2. **Source Pivot:** If a primary source is unreachable, pivot to a predefined list of alternative high-fidelity archives.
3. **Alert Log:** Log the failure in `error_log.json` with a timestamp and the specific failure point (Retrieval, Fact-Check, or File IO).

---

## 4. Performance Metrics (KPIs)
| Metric | Target | Monitoring Frequency |
| :--- | :--- | :--- |
| **Report Punctuality** | 100% (by 09:00 AM) | Daily |
| **Source Authenticity** | $\geq$ 95% Genuine Sources | Per Cycle |
| **Fact-Check Accuracy** | 0% Critical False Positives | Per Cycle |
| **File Integrity** | Valid Markdown Syntax | Per Cycle |