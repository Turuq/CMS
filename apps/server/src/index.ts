import { Hono } from 'hono';

// Middleware
import { logger } from 'hono/logger';

// Routes
import authRouter from './routes/auth';

// Auth
import { cors } from 'hono/cors';
import mongoClient from './lib/db/mongoClient';
import assignmentOfficerRouter from './routes/assignment-officer';
import courierRouter from './routes/courier';
import handoverOfficerRouter from './routes/handover-officer';
import inspectorRouter from './routes/inspector';
import orderRouter from './routes/order';
import staffRouter from './routes/staff';

const app = new Hono();

const apiRoutes = app
  .basePath('/api')
  .route('/auth', authRouter)
  .route('/courier', courierRouter)
  .route('/handover-officer', handoverOfficerRouter)
  .route('/assignment-officer', assignmentOfficerRouter)
  .route('/order', orderRouter)
  .route('/staff', staffRouter)
  .route('/inspector', inspectorRouter);

app.use('*', logger());
app.use(
  '/api/*',
  cors({
    origin: 'http://localhost:3000',
  })
);

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

app.get('/api', (c) => {
  c.status(200);
  return c.json({
    message: 'Welcome to Courier Management API',
  });
});

// Hono RPC
export type AppType = typeof apiRoutes;

export default {
  port: process.env.PORT || 8080,
  fetch: app.fetch,
};
