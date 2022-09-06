import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import { of } from 'rxjs';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/public/:name')
  getImages(@Param('name') name: string, @Res() res: Response) {
    return of(res.sendFile(join(process.cwd(), 'src/public/uploads', name)));
  }
}
