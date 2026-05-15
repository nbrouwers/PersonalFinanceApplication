#!/usr/bin/env bash
set -e

# ─── Configuration ──────────────────────────────────────────
BACKEND_PORT=8000
FRONTEND_PORT=3000
BACKEND_DIR="$(cd "$(dirname "$0")/backend" && pwd)"
FRONTEND_DIR="$(cd "$(dirname "$0")/frontend" && pwd)"

# ─── Cleanup function ───────────────────────────────────────
cleanup() {
    echo ""
    echo "🛑 Shutting down..."
    kill "$BACKEND_PID" 2>/dev/null || true
    kill "$FRONTEND_PID" 2>/dev/null || true
    wait "$BACKEND_PID" 2>/dev/null || true
    wait "$FRONTEND_PID" 2>/dev/null || true
    echo "✅ All processes stopped."
    exit 0
}
trap cleanup SIGINT SIGTERM

# ─── Kill processes on target ports ─────────────────────────
kill_port() {
    local port=$1
    local name=$2
    local pid
    pid=$(fuser "$port/tcp" 2>/dev/null || true)
    if [ -n "$pid" ]; then
        echo "🔧 Killing existing process on port $port ($name)..."
        fuser -k "$port/tcp" 2>/dev/null || true
        sleep 1
    fi
}

kill_port "$BACKEND_PORT" "backend"
kill_port "$FRONTEND_PORT" "frontend"

# ─── Start backend ──────────────────────────────────────────
echo "🚀 Starting backend on port $BACKEND_PORT..."
cd "$BACKEND_DIR"
source venv/bin/activate
PYTHONPATH="$BACKEND_DIR" uvicorn app.main:app --reload --host 0.0.0.0 --port "$BACKEND_PORT" &
BACKEND_PID=$!
cd - > /dev/null

# ─── Start frontend ─────────────────────────────────────────
echo "🚀 Starting frontend on port $FRONTEND_PORT..."
cd "$FRONTEND_DIR"
PORT="$FRONTEND_PORT" npm start &
FRONTEND_PID=$!
cd - > /dev/null

echo ""
echo "✅ Both services are running."
echo "   Backend:  http://localhost:$BACKEND_PORT"
echo "   Frontend: http://localhost:$FRONTEND_PORT"
echo "   API docs: http://localhost:$BACKEND_PORT/docs"
echo ""
echo "Press Ctrl+C to stop both services."
echo ""

# Wait for either process to exit
wait