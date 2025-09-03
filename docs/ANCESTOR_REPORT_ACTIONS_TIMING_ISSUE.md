# Understanding getAllAncestorReportActions and updateOptimisticParentReportAction Relationship

## Problem Statement

The question "Why do we need to `getAllAncestorReportActions` to `updateOptimisticParentReportAction`?" reveals a common misconception about the relationship between these two functions. This document clarifies their actual relationship and explains the timing issue that necessitates passing updated report data to `getAllAncestorReportActions`.

## Function Relationships

### Direct Relationship
- `updateOptimisticParentReportAction` is used by `getOptimisticDataForParentReportAction`
- `getOptimisticDataForParentReportAction` uses `getAllAncestorReportActionIDs` (not `getAllAncestorReportActions`)
- These functions work together to update parent report actions when child reports change

### Indirect Relationship  
- `getAllAncestorReportActions` is used in UI components (like `ReportActionItemParentAction.tsx`) to display ancestor reports
- Both functions deal with report hierarchies but serve different purposes

## The Core Issue: Timing and Stale Data

### The Problem

In `ReportActionItemParentAction.tsx`, there are Onyx subscriptions that listen for changes to ancestor reports:

```typescript
unsubscribeReports.push(
    onyxSubscribe({
        key: `${ONYXKEYS.COLLECTION.REPORT}${ancestorReportID}`,
        callback: (val) => {
            ancestorReports.current[ancestorReportID] = val;
            // getAllAncestorReportActions use getReportOrDraftReport to get parent reports which gets the report from allReports that
            // holds the report collection. However, allReports is not updated by the time this current callback is called.
            // Therefore we need to pass the up-to-date report to getAllAncestorReportActions so that it uses the up-to-date report value
            // to calculate, for instance, unread marker.
            setAllAncestors(getAllAncestorReportActions(report, val));
        },
    }),
);
```

### Why This Happens

1. **Onyx Subscription Timing**: When a report changes, the Onyx subscription callback fires immediately with the fresh data (`val`)
2. **Global State Update Delay**: However, the global `allReports` collection hasn't been updated yet
3. **Stale Data Access**: If `getAllAncestorReportActions` calls `getReportOrDraftReport()` internally, it will get stale data from `allReports`
4. **Incorrect Calculations**: This stale data can lead to incorrect calculations, such as unread markers

### The Solution

The `getAllAncestorReportActions` function accepts an optional `currentUpdatedReport` parameter:

```typescript
function getAllAncestorReportActions(
    report: Report | null | undefined, 
    currentUpdatedReport?: OnyxEntry<Report>
): Ancestor[]
```

Inside the function, it checks if the fresh report should be used:

```typescript
const parentReport = currentUpdatedReport && currentUpdatedReport.reportID === parentReportID 
    ? currentUpdatedReport 
    : getReportOrDraftReport(parentReportID);
```

This ensures that when traversing the ancestor hierarchy, if the updated report matches the current ancestor being processed, the fresh data is used instead of potentially stale data from the global store.

## Use Cases

### 1. Optimistic Updates (`updateOptimisticParentReportAction`)
- Updates parent report action counts when child reports change
- Uses `getAllAncestorReportActionIDs` to get the hierarchy
- Applies optimistic updates before server confirmation

### 2. UI Display (`getAllAncestorReportActions`)  
- Gets ancestor reports for display in UI components
- Calculates unread markers and other display properties
- Needs fresh data to avoid displaying stale information

## Key Insights

1. **Different Purposes**: The functions serve different but related purposes in the report hierarchy system
2. **Timing is Critical**: The fresh report parameter solves a race condition between Onyx subscriptions and global state updates
3. **Data Consistency**: Ensures UI components always work with the most current data available
4. **Performance**: Avoids unnecessary re-renders or incorrect displays due to stale data

## Example Scenario

1. User adds a comment to a child report
2. Onyx subscription fires with updated report data
3. UI component needs to update ancestor display
4. Without fresh data: `getAllAncestorReportActions` would use stale data → incorrect unread markers
5. With fresh data: `getAllAncestorReportActions` uses current data → correct unread markers

This pattern is essential for maintaining data consistency in the offline-first, optimistic update architecture of the Expensify app.