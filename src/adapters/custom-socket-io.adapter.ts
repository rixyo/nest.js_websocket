// src/adapters/custom-socket-io.adapter.ts
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
export class CustomSocketIoAdapter extends IoAdapter {
  createIOServer(port: number, options?: ServerOptions): any {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const server = super.createIOServer(port, options);
    // You can add custom configuration here if needed
    return server;
  }
}
