import { hc } from 'hono/client';
import { type AppType } from '@/api/index';

const client = hc<AppType>('http://localhost:3000');

export const api = client.api;
