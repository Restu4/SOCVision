import { Module } from '@nestjs/common';
import { RulesController } from './rules.controller';
import { RulesService } from './rules.service';
import { DetectionEngineService } from './detection-engine.service';

@Module({
  controllers: [RulesController],
  providers: [RulesService, DetectionEngineService],
  exports: [DetectionEngineService],
})
export class RulesModule {}
