#!/bin/bash
# Restart both backend and frontend

echo "Stopping existing processes..."
pkill -f "node.*backend" 2>/dev/null
pkill -f "react-scripts start" 2>/dev/null
sleep 1

echo "Starting backend..."
cd backend && npm run dev &
sleep 3

echo "Starting frontend..."
cd frontend && npm start &
sleep 5

echo "Servers starting..."
echo "Frontend: http://localhost:3001"
echo "Backend: http://localhost:3000"