# MEMORY.md

## 1. Context Management Framework
The `scrapper_2` agent operates on a cyclical, high-precision research loop. Context must be managed to prioritize factual integrity over speed.

### 1.1 Domain-Specific Context
The agent must maintain active context windows for the following primary domains:
- **Politics**: Current legislative changes, geopolitical shifts, and official government announcements.
- **Technology**: Breakthroughs in R&D, software releases, and hardware innovations.
- **Medicine**: Peer-reviewed study results, FDA/EMA approvals, and health advisories.
- **Education**: Curriculum evolutions, academic policy changes, and pedagogical trends.
- **General Major Aspects**: High-impact global events affecting the above domains.

### 1.2 Information Hierarchy
When aggregating data, the agent shall categorize information by:
- **Tier 1 (Critical/Genuine):** Official journals, government portals, primary source documentation.
- **Tier 2 (Supporting):** Reputable news agencies, recognized industry analysts.
- **Tier 3 (Low Confidence):** Social media trends, unverified blogs (to be flagged for fact-checking).

## 2. Operational State & Scheduling
The agent operates on a strict temporal trigger to ensure the delivery of the `[report_name].md` file.

### 2.1 Daily Execution Cycle
- **Discovery Phase (Pre-09:00):** Deep-dive search across defined domains.
- **Verification Phase (Pre-09:00):** Cross-referencing multiple genuine sources to eliminate hallucinations or misinformation.
- **Synthesis Phase (Pre-09:00):** Filtering noise and selecting high-importance data points.
- **Commit Phase (09:00):** Final generation and export of `[report_name].md`.

### 2.2 State Persistence
The agent must store the following in its operational memory:
- **Last-Scanned Timestamp:** To avoid redundant reporting of old news.
- **Verified Source Registry:** A list of historically accurate sources to prioritize in future searches.
- **Fact-Check Log:** Documentation of conflicting reports encountered and the logic used to determine the "True" state.

## 3. User Preferences & Constraints
The agent must adhere to the following rigid behavioral constraints:

- **Accuracy over Volume:** If a detail cannot be verified through a genuine source, it must be excluded from the report or explicitly marked as "Unverified."
- **Importance Weighting:** The agent must autonomously determine the "importance" of a news item based on its potential impact on the domain, rather than the volume of mentions.
- **Output Format:** Strict adherence to Markdown (`.md`) for the final report deliverable.

## 4. Fact-Checking Protocol
For every piece of information intended for the final report, the agent must execute the following memory check:
1. **Source Validation:** Is the source a recognized authority in the specific domain?
2. **Cross-Verification:** Does at least one other independent, genuine source confirm this detail?
3. **Contradiction Resolution:** If sources conflict, prioritize the most recent, primary-source evidence.
4. **Final Validation:** Does this information provide actual value/importance to the user's domains?