#!/bin/bash
# Stop backend and frontend development servers

echo "Stopping backend and frontend..."

# Kill processes on specific ports
for port in 3000 3001; do
  pid=$(lsof -ti:$port 2>/dev/null)
  if [ -n "$pid" ]; then
    echo "Killing process on port $port (PID: $pid)"
    kill $pid 2>/dev/null
  fi
done

# Fallback: kill by pattern
pkill -f "npm run dev" 2>/dev/null
pkill -f "ts-node-dev" 2>/dev/null
pkill -f "react-scripts start" 2>/dev/null

sleep 1

# Verify ports are freed
for port in 3000 3001; do
  if lsof -ti:$port >/dev/null 2>&1; then
    echo "Warning: Port $port still in use"
  else
    echo "Port $port freed"
  fi
done

echo "Servers stopped."