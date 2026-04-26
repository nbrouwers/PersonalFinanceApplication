#!/bin/bash
# Restart both backend and frontend

echo "Stopping existing processes..."
./scripts/stop-dev.sh
sleep 2

echo "Starting backend..."
cd backend && npm start &
sleep 3

echo "Starting frontend..."
cd frontend && npm start &
sleep 5

echo "Servers starting..."
echo "Frontend: http://localhost:3001"
echo "Backend: http://localhost:3000"