import { hc } from 'hono/client';
import { type AppType } from '@/api/index';

const client = hc<AppType>(process.env.API_URL!);
// const socket = client.ws.$ws();

export const api = client.api;
// export const ws = socket;

export const ws = new WebSocket('wss://uncomfortable-bison-turuq-1cf13144.koyeb.app/ws');

ws.onopen = () => {
  console.log("opened")
};


