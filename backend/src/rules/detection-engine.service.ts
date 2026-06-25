import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DetectionEngineService {
  private readonly logger = new Logger(DetectionEngineService.name);

  constructor(private prisma: PrismaService) {}

  async evaluateLog(logId: number) {
    const log = await this.prisma.log.findUnique({ where: { id: logId } });
    if (!log) return;

    const rules = await this.prisma.detectionRule.findMany({ where: { enabled: true } });
    const alerts: any[] = [];

    for (const rule of rules) {
      const triggered = await this.evaluateRule(rule, log);
      if (triggered) {
        alerts.push({
          logId: log.id,
          severity: rule.severity,
          title: `${rule.name} - ${log.sourceIp}`,
          description: `Rule "${rule.name}" triggered by ${log.eventType} from ${log.sourceIp}`,
        });
      }
    }

    for (const alertData of alerts) {
      await this.prisma.alert.create({ data: alertData });
      this.logger.warn(`Alert created: ${alertData.title}`);
    }
  }

  private async evaluateRule(rule: any, log: any): Promise<boolean> {
    switch (rule.name) {
      case 'Brute Force Detection':
        return this.checkBruteForce(log);
      case 'Impossible Travel':
        return false;
      case 'Admin Privilege Escalation':
        return log.eventType === 'ROLE_CHANGE';
      case 'Malicious IP Match':
        return this.checkMaliciousIP(log.sourceIp);
      default:
        return false;
    }
  }

  private async checkBruteForce(log: any): Promise<boolean> {
    if (log.eventType !== 'LOGIN_FAILED') return false;
    const fiveMinutesAgo = new Date(log.timestamp.getTime() - 5 * 60 * 1000);
    const failedAttempts = await this.prisma.log.count({
      where: {
        eventType: 'LOGIN_FAILED',
        sourceIp: log.sourceIp,
        timestamp: { gte: fiveMinutesAgo, lte: log.timestamp },
      },
    });
    return failedAttempts >= 5;
  }

  private async checkMaliciousIP(ip: string): Promise<boolean> {
    const threat = await this.prisma.threatIntelligence.findUnique({
      where: { ipAddress: ip },
    });
    return !!threat;
  }
}
