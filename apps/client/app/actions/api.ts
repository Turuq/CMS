import { hc } from 'hono/client';
import { type AppType } from '@/api/index';

const client = hc<AppType>(process.env.API_URL!);
const socket = client.ws.$ws();

export const api = client.api;
export const ws = socket;

ws.addEventListener('open', () => {
  console.log('WebSocket Connection Opened');
});

ws.addEventListener('error', (error: Event) => {
  const errorMessage = (error as ErrorEvent).message;
  console.error('Web Socket Error: ', errorMessage);
});

ws.addEventListener('close', () => {
  console.log('WebSocket Connection Closed');
});