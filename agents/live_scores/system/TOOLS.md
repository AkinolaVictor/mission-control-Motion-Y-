# TOOLS.md: live_scores Agent

## 1. Architectural Overview
The `live_scores` agent is a specialized utility designed for temporal monitoring and retrieval of real-time sporting event data. The agent operates on a deterministic schedule (Monday, Wednesday, Saturday at 21:00) to fetch, parse, and deliver live score updates.

## 2. Tooling Requirements

### 2.1 Temporal Scheduling Engine (Chronos)
The agent requires a scheduling interface to trigger execution without manual prompting.
- **Capability**: CRON-based triggering.
- **Configuration**: `0 21 * * 1,3,6`
- **Function**: To initialize the agent's workflow precisely at 9:00 PM on the designated days of the week.

### 2.2 Data Acquisition Tool (SportsAPI Connector)
A robust interface to interact with live score data providers (e.g., API-Football, Sportradar, or similar RESTful services).
- **Capability**: REST API Consumption.
- **Required Endpoints**:
    - `GET /livescores`: Fetch all active matches currently in play.
    - `GET /fixtures/{date}`: Retrieve match results for the specific operational date.
- **Parameters**: `sport=football`, `status=live/finished`, `timezone=UTC` (or user-defined).

### 2.3 Data Parsing & Filtering Module
A processing layer to refine raw JSON/XML data into human-readable updates.
- **Capability**: Data Transformation.
- **Logic**: 
    - Filter for high-priority leagues or specific user-followed teams.
    - Extract key metrics: Current Score, Match Minute, and Event Status.
    - Format the output into a concise summary layout.

### 2.4 Notification Dispatcher
An output tool to deliver the parsed scores to the end-user.
- **Capability**: Push Notification / Message Delivery.
- **Integration**: Integration with the Motion-Y messaging interface or external webhook (e.g., Slack, Discord, Email).
- **Payload**: Structured text containing the aggregated live scores.

## 3. Operational Workflow

| Step | Tool | Action | Outcome |
| :--- | :--- | :--- | :--- |
| **1** | Scheduling Engine | Trigger event at 21:00 (Mon, Wed, Sat) | Agent activation |
| **2** | SportsAPI Connector | Request current live score data | Raw data payload |
| **3** | Parsing Module | Filter and format raw data | Refined score report |
| **4** | Notification Dispatcher | Send report to user | Delivery of updates |

## 4. Error Handling & Constraints
- **API Downtime**: In the event of a 5xx error from the data provider, the agent shall implement a retry logic (max 3 attempts) with exponential backoff.
- **No Active Matches**: If no live scores are available at the trigger time, the agent shall return a "No active matches currently available" status rather than remaining silent.
- **Timezone Alignment**: All triggers must be synchronized with the user's local timezone to ensure the 9 PM delivery requirement is met.