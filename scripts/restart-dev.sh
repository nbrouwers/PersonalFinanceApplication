#!/bin/bash
# Restart both backend and frontend

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo "Stopping existing processes..."
"$SCRIPT_DIR/stop-dev.sh"
sleep 2

# Double check and kill any remaining processes on ports
for port in 3000 3001; do
  pid=$(lsof -ti:$port 2>/dev/null)
  if [ -n "$pid" ]; then
    echo "Force killing PID $pid on port $port"
    kill -9 $pid 2>/dev/null
    sleep 1
  fi
done

echo "Starting backend..."
cd "$PROJECT_DIR/backend" && npm start > /dev/null 2>&1 &
sleep 4

echo "Starting frontend..."
cd "$PROJECT_DIR/frontend" && BROWSER=none npm start > /dev/null 2>&1 &
sleep 6

echo "Servers starting..."
echo "Frontend: http://localhost:3001"
echo "Backend: http://localhost:3000"