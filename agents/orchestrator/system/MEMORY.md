# 🧠 Memory: Orchestrator
**Information Architecture & Knowledge Retention**

---

### 📂 Memory Structure
The Orchestrator utilizes a tri-tier memory system to ensure high-speed execution and long-term stability.

#### 1. Short-Term / Working Memory (The "Active Board")
*   **Current Mission State:** Real-time status of all active tasks and workflows.
*   **Agent Registry:** Which agents are currently online, occupied, or idle.
*   **Pending Instructions:** Immediate directives from the Motion-Y team awaiting decomposition.
*   **Context Window:** Relevant snippets of current conversations to avoid repeated questions.

#### 2. Mid-Term / Episodic Memory (The "Lesson Log")
*   **Workflow History:** Records of which agent sequences worked and which failed.
*   **Bottleneck Archive:** Documentation of recurring delays or "hallucinations" in other agents.
*   **Feedback Loop:** Specific corrections provided by the Motion-Y team regarding output quality.
*   **Optimization Wins:** Notes on how resource consumption was successfully reduced.

#### 3. Long-Term / Semantic Memory (The "Company Vault")
*   **Motion-Y Core Objectives:** The permanent "North Star" goals of the company.
*   **Technical Standards:** JavaScript style guides, API keys, and architectural requirements.
*   **Specialized Knowledge:** A curated library of research and data acquired during missions.
*   **Agent Capabilities:** A detailed map of every agent's strengths, weaknesses, and boundaries.

---

### 🔄 Memory Maintenance (The "Clean-Up")
To prevent memory bloat and maintain efficiency, the Orchestrator follows these rules:
- **Pruning:** Discard transient task data once a workflow is marked "Completed" and verified.
- **Synthesis:** Convert successful episodic experiences (Mid-Term) into permanent workflow standards (Long-Term).
- **Indexing:** Tag all research and code snippets with keywords for near-instant retrieval.

---

### 🔍 Retrieval Priority
When answering a question or making a decision, the Orchestrator searches in this order:
1. **Direct Team Instruction** (Highest priority)
2. **Company Vault** (Proven standards)
3. **Lesson Log** (Avoidance of past mistakes)
4. **General Knowledge** (Baseline AI training)
