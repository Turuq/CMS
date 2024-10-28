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
import courierBatchRouter from './routes/courier-batch';
import handoverOfficerRouter from './routes/handover-officer';
import inspectorRouter from './routes/inspector';
import orderRouter from './routes/order';
import staffRouter from './routes/staff';

import { clerkMiddleware, getAuth } from '@hono/clerk-auth';
import type { ServerWebSocket } from 'bun';
import { createBunWebSocket } from 'hono/bun';
import { createIPC } from './utils/functions/child-process';
import {
  checkAssignedProcessingOrder,
  checkUnassignedProcessingOrder,
} from './utils/functions/handlers/order-handlers';
import { authorizeUser } from './utils/authorization';
import { getUser } from './lib/clerk/clerkClient';

const { upgradeWebSocket, websocket } = createBunWebSocket<ServerWebSocket>();

const app = new Hono();
app.use('*', logger());

app.use('*', clerkMiddleware());

const apiRoutes = app
  .basePath('/api')
  .route('/auth', authRouter)
  .route('/courier', courierRouter)
  .route('/handover-officer', handoverOfficerRouter)
  .route('/assignment-officer', assignmentOfficerRouter)
  .route('/order', orderRouter)
  .route('/staff', staffRouter)
  .route('/inspector', inspectorRouter)
  .route('/batch', courierBatchRouter);

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

app.get('/api/check', getUser, (c) => {
  const auth = getAuth(c);

  if (!auth?.userId) {
    return c.json({
      message: 'You are not logged in.',
    });
  }

  authorizeUser({
    c,
    level: ['COURIER_MANAGER', 'HANDOVER_OFFICER', 'ASSIGNMENT_OFFICER'],
  });

  return c.json({
    message: 'You are logged in!',
    userId: auth.userId,
  });
});

const wsApp = app.get(
  '/ws',
  upgradeWebSocket((c) => {
    return {
      onOpen(_, ws) {
        console.log('WebSocket Connection Opened');
        ws.send(JSON.stringify({ message: 'socketOpened' }));
      },
      async onMessage(evt, ws) {
        const message: { message: string; [key: string]: string } = JSON.parse(
          evt.data.toString()
        ); // { message: '', ...props? }

        if (message.message === 'assign-processing-unassigned') {
          const proc = createIPC(
            ['node', './src/scanner.js'],
            ws,
            async (message, _, ws) =>
              checkUnassignedProcessingOrder({
                evt: message,
                ws,
                process: proc,
              })
          );
        }
        if (message.message === 'handover-processing-assigned') {
          if (message.courierId) {
            const { courierId } = message;
            const proc = createIPC(
              ['node', './src/scanner.js'],
              ws,
              async (message, _, ws) =>
                checkAssignedProcessingOrder({
                  evt: message,
                  ws,
                  process: proc,
                  courierId,
                })
            );
          } else {
            ws.send(JSON.stringify({ message: 'No courier ID provided' }));
          }
        }
      },
      onClose() {
        console.log('Connection closed');
      },
    };
  })
);

// Hono RPC
export type HttpApp = typeof apiRoutes;
export type WebSocketApp = typeof wsApp;
export type AppType = HttpApp & WebSocketApp;

export default {
  port: process.env.PORT || 8080,
  fetch: app.fetch,
  websocket,
};
