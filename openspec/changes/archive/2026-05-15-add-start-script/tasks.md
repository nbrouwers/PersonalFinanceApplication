## 1. Start Script Implementation

- [x] 1.1 Create `start-app.sh` with port killing logic using `fuser`
- [x] 1.2 Add backend startup via venv uvicorn in background
- [x] 1.3 Add frontend startup via npm in background
- [x] 1.4 Add trap for clean shutdown on Ctrl+C
- [x] 1.5 Add output prefixing to distinguish backend/frontend logs
- [x] 1.6 Make script executable
- [x] 1.7 Test that script starts both services and cleans up on exit