# Build stage for backend
FROM node:20-alpine AS backend-builder

WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install

COPY backend/ ./
RUN npm run build

# Build stage for frontend  
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy backend
COPY --from=backend-builder /app/backend/dist ./backend/dist
COPY --from=backend-builder /app/backend/node_modules ./backend/node_modules
COPY --from=backend-builder /app/backend/package.json ./backend/package.json

# Create data directory for SQLite
RUN mkdir -p /app/data

# Copy frontend build
COPY --from=frontend-builder /app/frontend/build ./frontend/build

# Install production dependencies
RUN npm install -g serve

# Expose ports
EXPOSE 3000 3001

# Start both backend and frontend
CMD ["sh", "-c", "mkdir -p /app/data && cd backend && DATABASE_URL='' node dist/index.js & serve -s frontend/build -l 3001 & wait"]