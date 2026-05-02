# Stage 1

## Problem summary

Build a Priority Inbox that displays the top `N` most important unread notifications first. Importance is based on notification type and recency.

## Approach

1. **Notification weights**
   - `Placement` notifications are highest priority because they often carry job or internship opportunities.
   - `Result` notifications are second priority because they inform the student about outcomes.
   - `Event` notifications are lower priority because they are informative but not immediately actionable.

2. **Recency**
   - Newer notifications are more important than older ones.
   - The score includes a recency component that decreases as notification age increases.

3. **Priority score formula**
   - `score = typeWeight + recencyWeight`
   - `typeWeight` examples:
     - `Placement` = 100
     - `Result` = 70
     - `Event` = 40
   - `recencyWeight = max(0, 60 - ageInMinutes)`

4. **Efficient top-N maintenance**
   - For small batches, sorting is simple and fast.
   - For large or streaming notification feeds, a min-heap of size `N` can maintain the top `N` efficiently.
   - This design uses sorting for clarity and correctness while the design document recommends heap-based maintenance for a production system.

## Implementation details

- A sample dataset is stored in the frontend.
- The application computes a priority score for each notification.
- Notifications are sorted by descending score.
- The top `N` notifications are displayed in a table.

## Why this works

- The solution is deterministic and easy to explain.
- It handles mixed notification types and time-based importance.
- It can be extended with more weights, categories, or user preferences.
- New notifications can be inserted into a top-N structure without sorting the full list in a real system. 
