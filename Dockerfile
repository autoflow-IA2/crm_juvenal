# ==============================================
# Dockerfile Multi-Stage para Juvenal CRM
# Backend (Express) + Frontend (React + Vite)
# ==============================================

# -----------------
# Stage 1: Build Frontend
# -----------------
FROM node:18-alpine AS frontend-builder

WORKDIR /app

# Copy frontend package files
COPY package*.json ./
COPY tsconfig*.json ./
COPY vite.config.ts ./
COPY postcss.config.js ./
COPY tailwind.config.js ./

# Install frontend dependencies
RUN npm ci --only=production=false

# Copy frontend source
COPY src ./src
COPY public ./public
COPY index.html ./

# Build frontend
RUN npm run build

# -----------------
# Stage 2: Build Backend
# -----------------
FROM node:18-alpine AS backend-builder

WORKDIR /app

# Copy backend package files
COPY backend/package*.json ./
COPY backend/tsconfig.json ./

# Install backend dependencies
RUN npm ci --only=production=false

# Copy backend source
COPY backend/src ./src

# Build backend
RUN npm run build

# -----------------
# Stage 3: Production Runtime
# -----------------
FROM node:18-alpine AS production

WORKDIR /app

# Install production dependencies for backend
COPY backend/package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy built backend from builder stage
COPY --from=backend-builder /app/dist ./dist

# Copy built frontend from builder stage
COPY --from=frontend-builder /app/dist ./public

# Copy serve script that combines backend + frontend
COPY --from=backend-builder /app/src/server.ts ./src/server.ts

# Create a production server that serves both frontend and backend
RUN cat > serve.js << 'EOF'
const express = require('express');
const path = require('path');
const app = require('./dist/server').default;

// Serve static frontend files (before API routes, but with lower priority)
app.use(express.static(path.join(__dirname, 'public'), {
  index: false, // Don't serve index.html automatically
  maxAge: '1y', // Cache static assets for 1 year
}));

// SPA fallback - serve index.html for all non-API routes
// This must be AFTER all API routes are registered
app.get('*', (req, res, next) => {
  // Skip if it's an API route
  if (req.path.startsWith('/api')) {
    return next();
  }

  // Serve index.html for all other routes (SPA routing)
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log('');
  console.log('🚀 Juvenal CRM - Production Server');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📡 Server: http://localhost:${PORT}`);
  console.log(`📱 Frontend: http://localhost:${PORT}`);
  console.log(`🔌 API: http://localhost:${PORT}/api/v1`);
  console.log(`❤️  Health: http://localhost:${PORT}/api/v1/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'production'}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('👋 SIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});
EOF

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/api/v1/health', (r) => r.statusCode === 200 ? process.exit(0) : process.exit(1))"

# Start application
CMD ["node", "serve.js"]
