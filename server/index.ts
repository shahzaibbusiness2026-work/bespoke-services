import dotenv from 'dotenv';
dotenv.config();

import { app } from './app';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
const HOST = '0.0.0.0';

const server = app.listen(PORT, HOST, () => {
  console.log(`
  ════════════════════════════════════════════════════════════
    🏛️  BOSKI LIMITED ATELIER BACKEND API SERVER
  ════════════════════════════════════════════════════════════
    Local Access:    http://localhost:${PORT}
    Health Status:   http://localhost:${PORT}/api/health
    Products API:    http://localhost:${PORT}/api/products
    Auth API:        http://localhost:${PORT}/api/auth
    Orders API:      http://localhost:${PORT}/api/orders
    Inquiries API:   http://localhost:${PORT}/api/inquiries
  ════════════════════════════════════════════════════════════
  `);
});

const handleShutdown = () => {
  console.log('\n[Server] Received termination signal. Gracefully closing Atelier server...');
  server.close(() => {
    console.log('[Server] Connections closed. Exiting process.');
    process.exit(0);
  });
};

process.on('SIGTERM', handleShutdown);
process.on('SIGINT', handleShutdown);
