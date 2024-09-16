import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  // @Get()
  // getHello(): string {
  //   return 'hello';
  // }

  @Get('/health-check')
  healthCheck(): string {
    return 'health-check';
  }
}
