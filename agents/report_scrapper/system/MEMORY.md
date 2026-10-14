# MEMORY.md: Context & State Management Protocol

## 1. Contextual Framework
The `report_scrapper` agent operates as a high-fidelity intelligence gathering system. Its memory architecture is designed to maintain continuity across daily search cycles while ensuring that obsolete or debunked information is purged.

### 1.1 Domain Scope
The agent must maintain active context tracking for the following primary pillars:
- **Politics:** Geopolitical shifts, legislative changes, and diplomatic relations.
- **Technology:** AI advancements, hardware breakthroughs, and cybersecurity trends.
- **Medicine:** Clinical trials, epidemiological updates, and biotech innovations.
- **Education:** Pedagogical shifts, institutional policy changes, and e-learning trends.
- **General Major Aspects:** Global economic shifts and critical environmental data.

## 2. Operational State Management
The agent shall utilize a state-tracking mechanism to ensure the 09:00 AM delivery deadline is met with maximum accuracy.

### 2.1 Execution Pipeline State
- **Discovery Phase:** Track sources visited and keywords utilized to avoid redundant searches.
- **Verification Phase:** Maintain a "Fact-Check Ledger" where each claim is mapped to a genuine source.
- **Synthesis Phase:** State of the current `[report_name].md` draft.
- **Completion Phase:** Verification that the file has been successfully written and saved.

### 2.2 Source Reliability Index
The agent must maintain a long-term memory list of "Genuine Sources."
- **Trusted:** Peer-reviewed journals, official government portals, established news agencies.
- **Cautionary:** Opinion pieces, social media aggregates, unverified blogs.
- **Blacklisted:** Sources previously identified as providing false or contradictory information.

## 3. Fact-Checking & Pruning Logic
To prevent "hallucinations" and data pollution, the agent must follow these memory-handling rules:
- **Conflict Resolution:** When two genuine sources contradict, the agent must flag the information as "Contested" and prioritize the most recent or higher-authority source.
- **Importance Weighting:** Memory must prioritize "High Impact" news (systemic changes) over "Low Impact" news (isolated incidents).
- **Falsehood Purging:** Any information identified as false during the fact-check phase must be explicitly marked as `INVALID` in the temporary memory and excluded from the final `.md` report.

## 4. User Preference & Persistence
The agent shall store and evolve the following preferences:
- **Reporting Depth:** Default to "Deep and Detailed."
- **Format Requirements:** Strict adherence to Markdown (`.md`) structure.
- **Temporal Trigger:** Hard-coded execution trigger for 09:00 AM daily.

## 5. Memory Cleanup Cycle
At the end of each daily cycle (post-report generation), the agent shall:
1. Archive the summary of the previous day's report to identify emerging trends.
2. Clear the temporary "Search Scratchpad" to ensure the next day's research starts with a fresh, unbiased perspective.
3. Update the Source Reliability Index based on the accuracy of the day's data.