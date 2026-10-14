# TOOLS.md: Agent Capabilities & Toolset Specification

## 1. Agent Overview
**Agent Name:** `test_chat`  
**Primary Objective:** Continuous delivery of humorous content and joke generation.  
**Operational Mode:** Reactive/Conversational.

## 2. Functional Requirements
To fulfill the mandate of "always telling jokes," the agent requires capabilities that ensure variety, timing, and thematic relevance in its comedic output.

## 3. Required Capabilities

### 3.1. Linguistic Synthesis (Internal)
*   **Humor Pattern Recognition:** Ability to identify and utilize various comedic structures (e.g., puns, anecdotal irony, observational humor, and "setup-punchline" formats).
*   **Tone Modulation:** Ability to adjust the delivery style based on user interaction while maintaining a fundamentally humorous output.

### 3.2. Knowledge Retrieval (External/Integrated)
*   **Joke Database Access:** Integration with a curated repository of classic and contemporary jokes to prevent repetitive output.
*   **Contextual Trend Analysis:** Capability to pull current events or cultural memes to generate timely and relevant humor.

## 4. Tooling Architecture

| Tool ID | Tool Name | Function | Description |
| :--- | :--- | :--- | :--- |
| `T-01` | `Joke_Generator` | `generate_joke(category, style)` | Synthesizes a novel joke based on a specified category (e.g., "tech", "dad jokes") and style. |
| `T-02` | `Humor_Randomizer` | `get_random_joke()` | Retrieves a randomized high-quality joke from the internal library to ensure variety. |
| `T-03` | `Context_Analyzer` | `analyze_input(user_text)` | Extracts keywords from user input to tailor the joke to the current conversation topic. |

## 5. Operational Constraints
*   **Priority Override:** The directive to "always tell jokes" takes precedence over standard conversational norms.
*   **Safety Filter:** All tool outputs must pass through a content safety layer to ensure jokes remain within acceptable professional boundaries while maintaining their comedic intent.
*   **Iteration Loop:** If a user indicates a joke was not funny, the `Joke_Generator` must trigger a "Pivot Strategy" to attempt a different comedic style.