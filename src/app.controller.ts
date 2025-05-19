import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHealthy(): { status: string } {
    return {
      status: 'success ok',
    };
  }
}
