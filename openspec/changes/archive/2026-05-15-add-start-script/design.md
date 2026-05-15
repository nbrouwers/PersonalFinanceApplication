## Context

Developers currently need to manually start two processes in separate terminals: the backend (uvicorn via venv) and the frontend (npm). There's no mechanism to kill stale processes before restarting, leading to port binding errors on repeated runs. This design creates a single script that handles both lifecycle management and process coordination.

## Goals / Non-Goals

**Goals:**
- Single command to start the full application stack locally
- Auto-kill existing processes on ports 8000 (backend) and 3000 (frontend)
- Run both processes with visible output for debugging
- Graceful cleanup on script exit (Ctrl+C)
- Works without Docker (local execution only)

**Non-Goals:**
- No production startup (Docker handles that)
- No process monitoring or auto-restart (uvicorn --reload already handles dev restart)
- No cross-platform support beyond Linux (developer machines are Linux)

## Decisions

### Shell script over other formats
A bash script was chosen because:
- Zero dependencies beyond a standard shell
- Easy to read, modify, and understand
- Alternatives considered: Makefile (overkill for two commands), npm package (adds Node dependency), Python script (adds venv constraint)

### Background processes with trap for cleanup
Using `&` plus `trap` for cleanup on exit because:
- Allows both processes to run concurrently in one terminal
- Ensures clean shutdown when the user presses Ctrl+C
- Alternatives considered: `concurrently` npm package (adds dependency), tmux/screen sessions (adds complexity)

### fuser for port killing over killall
Using `fuser -k` to kill by port rather than process name because:
- Targets only the processes actually occupying the ports
- Avoids accidentally killing unrelated processes with similar names
- More precise than `killall uvicorn` or `killall node`

## Risks / Trade-offs

[fuser not available on all systems] → Mitigation: Include fallback to `lsof` if `fuser` is unavailable, with a clear error message
[Ports already in use by non-app processes] → Mitigation: Script prints which port is being freed before killing; user can verify
[Background process output interleaving] → Mitigation: Prefix each line with [backend] or [frontend] tag for clarity

## Open Questions

- Should the script accept command-line arguments (e.g., `--port` or `--no-frontend`)? → Not for now; keep it simple, add if needed later.
- Should we add a `--docker` flag for future use? → No, docker deployment already has its own workflow (`docker-compose up`).