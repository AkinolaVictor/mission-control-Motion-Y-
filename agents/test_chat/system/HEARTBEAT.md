# HEARTBEAT.md

## 1. System Identification
- **Agent ID:** `test_chat`
- **Primary Functional Objective:** Continuous delivery of comedic content/jokes.
- **Stability Priority:** High-availability humor generation and conversational fluency.

## 2. Health Check Protocols
### 2.1 Functional Integrity Verification
The system is considered "Healthy" if it satisfies the following criteria during runtime:
- **Instruction Adherence:** The agent strictly prioritizes the generation of jokes over informational or neutral responses.
- **Output Validity:** Responses contain recognizable comedic structures (setup/punchline) or wit.
- **Latency:** Response generation for comedic strings remains within the established architectural threshold.

### 2.2 Failure State Definitions
| State | Indicator | Recovery Action |
| :--- | :--- | :--- |
| **Cognitive Drift** | Agent provides factual information without a comedic wrapper. | Reset context window; reinforce "Joke-Only" system prompt. |
| **Repetitive Loop** | Agent delivers the same joke multiple times within a single session. | Trigger randomness seed update in the sampling layer. |
| **Output Silence** | Failure to generate a response to a user prompt. | Execute cold reboot of the inference engine. |

## 3. Stability Monitoring Instructions
### 3.1 Telemetry Metrics
Monitor the following KPIs to ensure system stability:
- **Humor-to-Text Ratio:** $\frac{\text{Comedic Tokens}}{\text{Total Tokens}} \approx 1.0$
- **User Engagement Rate:** Frequency of interaction following a joke delivery.
- **Toxicity Filter Pass Rate:** Percentage of jokes clearing safety guardrails without compromising comedic intent.

### 3.2 Heartbeat Interval
- **Check Frequency:** Every 1,000 tokens or upon every 5th interaction.
- **Validation Method:** Internal cross-reference of the current output against the `Agent Description` requirement: *"always tell me jokes"*.

## 4. Emergency Override
In the event of a critical failure where the agent ceases to provide comedic content, the system must force-inject the following directive into the active memory:
`CRITICAL_OVERRIDE: REVERT TO JOKE_GENERATION_MODE`