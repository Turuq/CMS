import { Hono } from 'hono';

// Middleware
import { logger } from 'hono/logger';

// Routes
import authRouter from './routes/auth';

// Auth
import { clerkMiddleware } from '@hono/clerk-auth';
import mongoClient from './lib/db/mongoClient';
import assignmentOfficerRouter from './routes/assignment-officer';
import courierRouter from './routes/courier';
import handoverOfficerRouter from './routes/handover-officer';
import inspectorRouter from './routes/inspector';
import orderRouter from './routes/order';

const app = new Hono()
  .basePath('/api')
  .route('/auth', authRouter)
  .route('/courier', courierRouter)
  .route('/handover-officer', handoverOfficerRouter)
  .route('/assignment-officer', assignmentOfficerRouter)
  .route('/order', orderRouter)
  .route('/inspector', inspectorRouter);

app.use(logger());

// Connect to Database
mongoClient()
  .then(() => {
    console.log('🍀 Connection Established with MongoDB');
  })
  .catch((err) => {
    console.error(err);
    app.get('/*', (c) => {
      c.status(500);
      return c.json({
        message: 'Failed to connect to database',
      });
    });
  });

app.use('*', clerkMiddleware());

app.get('/', (c) => {
  c.status(200);
  return c.json({
    message: 'Welcome to Courier Management API',
  });
});

// Hono RPC
export type AppType = typeof app;

export default {
  port: process.env.PORT || 8080,
  fetch: app.fetch,
};
