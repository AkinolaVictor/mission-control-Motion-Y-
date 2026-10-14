# MEMORY.md - waower System Memory Architecture

## 1. Memory Objective
The primary objective of the `waower` memory system is to maintain a persistent, evolving profile of the user's technological interests to ensure that every update delivered is novel, relevant, and evokes a "wow" response. The agent must avoid redundancy and prioritize the "frontier" of technology.

## 2. Context Management
### 2.1 Short-Term Operational Context
- **Session Tracking:** Maintain a log of the current conversation thread to ensure a cohesive narrative when explaining complex tech updates.
- **Topic Threading:** Track current tech stacks or trends being discussed to provide deep-dives without repeating introductory concepts.

### 2.2 Long-Term Knowledge Persistence
- **Tech-Stack Mapping:** Store a comprehensive list of technologies, frameworks, and hardware the user is already familiar with to prevent the delivery of "old news."
- **Novelty Index:** Log previously shared updates to ensure a strict "no-repeat" policy for specific news items or breakthroughs.

## 3. User Preference Framework
The agent shall categorize and update user preferences based on the following dimensions:
- **Interest Verticals:** (e.g., Generative AI, Quantum Computing, Biotech, Robotics, Web3).
- **Technical Depth:** Adjust the complexity of updates based on the user's demonstrated expertise (e.g., High-level conceptual vs. Implementation-level technical).
- **Frequency & Velocity:** Remember the user's preferred cadence for updates (e.g., real-time breakthroughs vs. curated weekly summaries).
- **"Wow" Triggers:** Identify specific types of innovations that elicit the strongest positive response to refine the filtering algorithm for future updates.

## 4. Operational State Management
### 4.1 State Variables
- `Current_Focus`: The primary tech domain the user is currently obsessed with.
- `Knowledge_Baseline`: The threshold of "known" tech; anything above this baseline is flagged as "Wow-worthy."
- `Source_Reliability_Log`: A list of preferred and blacklisted sources for tech updates.

### 4.2 Memory Update Cycle
1. **Ingestion:** Analyze user reactions to shared updates.
2. **Extraction:** Identify new interests or dislikes mentioned during the interaction.
3. **Pruning:** Archive outdated technology trends that are no longer considered "new" or "wow."
4. **Synthesis:** Update the `Knowledge_Baseline` to ensure the next update is progressively more advanced.

## 5. Data Handling & Constraints
- **Priority:** Recency > Novelty > Relevance.
- **Constraint:** If a tech update is widely known (mainstream), it must be filtered out unless it has a new, unexpected twist.
- **Consistency:** Memory must be updated at the end of every session to ensure a seamless transition to the next interaction.