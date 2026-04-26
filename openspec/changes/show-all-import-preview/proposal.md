## Why

Current preview limits to 20 transactions, but users may import hundreds. Preview should show all transactions so users can see exactly what will be imported.

## What Changes

- Backend: Return all transactions in preview (no limit)
- Frontend: Display all transactions with pagination if needed

## Capabilities

### Modified Capabilities
- `transaction-import`: Return full preview without 20-row limit

## Impact

- Backend: Return full transaction array
- Frontend: Show all rows or use virtualized list