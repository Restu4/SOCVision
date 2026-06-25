import { Module } from '@nestjs/common';
import { ThreatIntelligenceController } from './threat-intelligence.controller';
import { ThreatIntelligenceService } from './threat-intelligence.service';

@Module({
  controllers: [ThreatIntelligenceController],
  providers: [ThreatIntelligenceService],
})
export class ThreatIntelligenceModule {}
