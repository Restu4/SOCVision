import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { ThreatIntelligenceService } from './threat-intelligence.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('threat-intelligence')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ThreatIntelligenceController {
  constructor(private readonly service: ThreatIntelligenceService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Post()
  @Roles('ADMIN')
  create(@Body() body: any) {
    return this.service.create(body);
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
