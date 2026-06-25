import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { LogsService } from './logs.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { QueryLogDto } from './dto/query-log.dto';

@Controller('logs')
@UseGuards(JwtAuthGuard)
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Get()
  findAll(@Query() query: QueryLogDto) {
    return this.logsService.findAll(query);
  }

  @Get('stats')
  getStats() {
    return this.logsService.getStats();
  }
}
