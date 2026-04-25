#!/bin/bash
# Stop backend and frontend development servers

echo "Stopping backend and frontend..."
pkill -f "npm run dev" 2>/dev/null
pkill -f "ts-node-dev" 2>/dev/null
pkill -f "react-scripts start" 2>/dev/null

echo "Servers stopped."