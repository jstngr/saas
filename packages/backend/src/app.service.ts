import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getStatus() {
    return {
      status: 'ok',
      message: 'Hello World!',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    };
  }
}
