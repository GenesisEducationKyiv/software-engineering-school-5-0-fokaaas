## Alerting Strategy for Application Monitoring

### Key Alerts
Below is a list of alerts that are recommend configuring for the effective monitoring of the application.

1. **High Error Rate**
  - **Description:** Triggered when the number of error logs exceeds a threshold (e.g., >5% of all logs in 5 minutes).
  - **Importance:** Indicates application malfunctions or unexpected behaviors. Helps identify bugs or external service issues early.

2. **Increased Response Time**
  - **Description:** Alert if the average response time exceeds 500ms for more than 5 minutes.
  - **Importance:** Detects performance degradation. Ensures a quick response to user-impacting slowdowns.

3. **Service Downtime**
  - **Description:** No incoming requests or all requests fail (status 5xx) for a defined period (e.g., 1 minute).
  - **Importance:** Signals total service outage. Enables immediate investigation and recovery.

4. **Database Connection Failures**
  - **Description:** Alert when the application logs repeated database connection errors.
  - **Importance:** Crucial for maintaining data consistency and availability. Early alerting prevents cascading failures.

5. **High Memory Usage**
  - **Description:** Memory usage > 80% over 10 minutes.
  - **Importance:** Prevents application crashes and helps in capacity planning.


### Justification
These alerts were selected because they cover the main operational aspects:
- Stability (errors, downtime)
- Performance (latency, memory)
- Dependencies (DB)

They allow proactive detection of issues and minimize mean time to recovery (MTTR).
