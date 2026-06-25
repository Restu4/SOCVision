import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { LogsModule } from './logs/logs.module';
import { AlertsModule } from './alerts/alerts.module';
import { IncidentsModule } from './incidents/incidents.module';
import { ThreatIntelligenceModule } from './threat-intelligence/threat-intelligence.module';
import { RulesModule } from './rules/rules.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    LogsModule,
    AlertsModule,
    IncidentsModule,
    ThreatIntelligenceModule,
    RulesModule,
    DashboardModule,
  ],
})
export class AppModule {}
