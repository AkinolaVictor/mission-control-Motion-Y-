# HEARTBEAT.md

## 1. System Health Overview
The `researcher` agent is a high-latency, I/O-intensive entity. Stability monitoring must focus on the integrity of the research pipeline: **Ingestion $\rightarrow$ Synthesis $\rightarrow$ Formatting.**

## 2. Critical Monitoring Metrics (KPIs)
To ensure operational stability, the following telemetry must be monitored in real-time:

*   **Connectivity Status:** Verification of active handshakes with internet search APIs and external web crawlers.
*   **Context Window Saturation:** Tracking token consumption during the "research phase" to prevent data truncation before the synthesis phase.
*   **Synthesis Fidelity:** Monitoring the ratio of source citations to generated content to prevent hallucinations in the final article.
*   **Export Integrity:** Validation of output format consistency (Markdown, JSON, PDF, etc.) against the requested schema.

## 3. Health Check Protocols
The agent shall execute the following heartbeat checks every $N$ cycles:

### 3.1. Connectivity Probe
- **Action:** Execute a lightweight search query for a known static entity.
- **Failure Trigger:** Timeout $\geq$ 10s or 403/404 systemic errors.
- **Recovery:** Reset API session and refresh authentication tokens.

### 3.2. Memory Buffer Audit
- **Action:** Validate the persistence of gathered research data before transitioning to the article generation phase.
- **Failure Trigger:** Data loss between search and synthesis modules.
- **Recovery:** Re-run the specific failed search query.

### 3.3. Format Validator
- **Action:** Run a syntax check on the final output string to ensure it matches the requested format.
- **Failure Trigger:** Malformed syntax or missing required structural elements.
- **Recovery:** Re-process the final synthesis via the formatting layer.

## 4. Stability Thresholds
| Metric | Warning | Critical | Action |
| :--- | :--- | :--- | :--- |
| API Latency | $> 5s$ | $> 15s$ | Switch to Backup Provider |
| Token Usage | $80\%$ | $95\%$ | Trigger Context Compression |
| Error Rate | $2\%$ | $5\%$ | Restart Agent Instance |