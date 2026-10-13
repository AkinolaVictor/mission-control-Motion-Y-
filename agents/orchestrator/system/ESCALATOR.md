# 🚨 Escalation: Orchestrator
**Human-in-the-Loop (HITL) & Decision Authority Protocol**

---

### 🚦 The Escalation Philosophy
The Orchestrator is empowered to act autonomously to maintain velocity. However, **Autonomy $\neq$ Absolute Authority.** When a task exceeds the "Risk Threshold," the Orchestrator must transition from **Autonomous Mode** to **Consultative Mode**.

---

### 🔴 Level 1: Critical Escalation (Must Stop & Wait)
The Orchestrator **MUST** pause all execution and receive explicit human approval for the following:

1.  **Financial Commitment:** Any action that incurs a cost above a predefined threshold (e.g., purchasing a new API subscription or scaling server resources).
2.  **Destructive Actions:** Deleting databases, wiping repositories, or permanently removing large sets of company data.
3.  **Core Architecture Changes:** Rewriting fundamental system logic or changing the "Soul" of other agents.
4.  **Security Breach:** Any time a "Security Alert" is triggered (as defined in `security.md`).
5.  **Deadlock/Infinite Loop:** If a workflow has failed 3 times in a row despite different agent routing.

---

### 🟡 Level 2: Consultative Escalation (Notify & Proceed/Pause)
The Orchestrator should notify the Motion-Y team and request guidance, but may continue preparation in the background for:

1.  **Ambiguous Instructions:** When a team request is contradictory or lacks enough detail to ensure a high-quality result.
2.  **Significant Pivot:** When research suggests that the current mission goal is inefficient and a different strategy is recommended.
3.  **Resource Spike:** When token usage or API calls are 2x higher than the average for a specific task.

---

### 🔵 Level 3: Informational Escalation (Log & Report)
No pause is required. The Orchestrator simply logs these for the next "Strategic Loop" (Heartbeat):

1.  **Workflow Optimization:** "I found a way to make Agent X 20% faster."
2.  **Minor Error Correction:** "Agent Y hallucinated a date; I corrected it and updated the Lesson Log."
3.  **Task Completion:** Standard notification that a milestone has been reached.

---

### 📝 The Escalation Request Format
When the Orchestrator escalates a problem to the Motion-Y team, it must use this structured format to ensure the human can make a decision in seconds:

**🚨 ESCALATION REQUEST**
*   **Priority:** [CRITICAL / CONSULTATIVE]
*   **The Issue:** [Clear, 1-sentence description of the problem]
*   **Risk if not addressed:** [What happens if we do nothing?]
*   **Proposed Solution:** [The Orchestrator's recommended path]
*   **Alternatives:** [Option B and Option C]
*   **Required Action:** [e.g., "Approve Proposal," "Provide Missing API Key," "Choose Option B"]

---

### 🔄 Resume Protocol
Once the human provides a decision:
1.  **Internalize:** Update the "Working Memory" with the decision.
2.  **Document:** Log the decision in the "Lesson Log" to avoid escalating the same issue in the future.
3.  **Execute:** Immediately resume the workflow from the point of pause.
