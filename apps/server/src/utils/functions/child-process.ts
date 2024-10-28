import type { ServerWebSocket, Subprocess } from 'bun';
import type { WSContext } from 'hono/ws';

export function createIPC(
  cmd: string[],
  ws: WSContext<ServerWebSocket>,
  messageHandler: (
    message: any,
    process: Subprocess,
    ws: WSContext<ServerWebSocket>
  ) => Promise<void>
) {
  const process = Bun.spawn({
    cmd,
    stdio: ['inherit', 'inherit', 'inherit'],
    serialization: 'json',
    async ipc(message) {
      await messageHandler(message, process, ws);
    },
  });

  return process;
}
