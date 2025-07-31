## Log Retention Policy

### Purpose
This policy defines how long different types of logs (info, warn, error) should be retained, archived, or deleted when stored in **Loki**. The goal is to balance observability needs with storage costs and compliance requirements.

### Log Categories and Retention Periods (in Loki)

1. **Error Logs**
  - **Retention:** 90 days
  - **Reason:** Crucial for debugging, incident analysis, and auditing. Retaining them supports post-mortem and compliance activities.

2. **Warning Logs (warn)**
  - **Retention:** 30 days
  - **Reason:** Useful for detecting potential issues before they escalate. Medium volume, provides insight into degradations.

3. **Information Logs (info)**
  - **Retention:** 14 days
  - **Reason:** Helpful for understanding normal application flow and usage patterns. High volume, but low long-term value.

### Deletion and Archival
- In **Loki**, logs are automatically managed via retention policies defined in the configuration.
- After the specified retention period, logs are:
  - **Deleted** for low-priority logs (e.g., info)
  - **Archived externally** (optional, e.g., using object storage) for audit-relevant logs (e.g., error logs), if enabled via compactor settings

### Justification
This policy was chosen based on:
- Log importance for debugging and analysis
- Volume generated and relevance over time
- Loki’s native capabilities for managing time-based retention
- Cost and performance considerations

Debug-level logs are **not ingested** into Loki to reduce volume and noise. This ensures efficient use of resources while preserving actionable insights.
