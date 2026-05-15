## Why

The application has no single command to start both the backend and frontend together. Developers must manually start two separate terminals and remember to kill stale processes before restarting. This slows down iteration and leads to port conflicts.

## What Changes

- Create a `start-app.sh` script at the repository root that:
  - Kills any existing backend (port 8000) and frontend (port 3000) processes
  - Starts the backend via uvicorn using the Python virtual environment
  - Starts the frontend via npm
  - Runs both processes in the foreground (or background) with clean shutdown
- Add a `dev` entry to `frontend/package.json` scripts if needed to ensure consistent port binding

## Capabilities

### New Capabilities
<!-- No new software capabilities are being introduced as this is a developer tooling improvement -->

### Modified Capabilities
<!-- No existing capabilities are being modified -->

## Impact

- New file: `start-app.sh` at repository root
- No changes to source code, architecture, or application behavior
- Only affects local development workflow