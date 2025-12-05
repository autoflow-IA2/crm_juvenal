import app from './app';

const PORT = process.env.PORT || 3001;

// ========================================
// Start Server (apenas para desenvolvimento)
// ========================================
app.listen(PORT, () => {
  console.log('');
  console.log('🚀 Juvenal CRM Backend API');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📡 Server running on: http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔐 CORS enabled for: ${process.env.ALLOWED_ORIGINS || 'http://localhost:5173'}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
  console.log('Available endpoints:');
  console.log('  GET    /api/v1/health           - Health check');
  console.log('  POST   /api/v1/api-keys         - Create API key');
  console.log('  GET    /api/v1/api-keys         - List API keys');
  console.log('  GET    /api/v1/api-keys/:id     - Get API key');
  console.log('  PATCH  /api/v1/api-keys/:id     - Update API key');
  console.log('  DELETE /api/v1/api-keys/:id     - Delete API key');
  console.log('');
  console.log('⏳ Waiting for requests...');
  console.log('');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('👋 SIGINT received, shutting down gracefully...');
  process.exit(0);
});
