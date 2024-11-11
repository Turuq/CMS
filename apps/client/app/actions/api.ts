import { hc } from 'hono/client';
import { type AppType } from '@/api/index';

const client = hc<AppType>('http://localhost:8001');
// const socket = client.ws.$ws();

export const api = client.api;
// export const ws = socket;

export const ws = new WebSocket('ws://localhost:8001/ws');

ws.onopen = () => {
  console.log("opened")
};


