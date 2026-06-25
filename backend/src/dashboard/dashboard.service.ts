import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const [
      totalEvents,
      totalAlerts,
      criticalAlerts,
      activeIncidents,
    ] = await Promise.all([
      this.prisma.log.count(),
      this.prisma.alert.count(),
      this.prisma.alert.count({ where: { severity: 'CRITICAL' } }),
      this.prisma.incident.count({ where: { status: 'OPEN' } }),
    ]);

    const highCount = await this.prisma.alert.count({ where: { severity: 'HIGH' } });
    const securityScore = Math.max(0, 100 - (criticalAlerts * 5 + highCount * 2));

    const topAssets = await this.prisma.log.groupBy({
      by: ['destinationIp'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 5,
    });

    const alertsBySeverity = await this.prisma.alert.groupBy({
      by: ['severity'],
      _count: { id: true },
    });

    const topEventTypes = await this.prisma.log.groupBy({
      by: ['eventType'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 5,
    });

    const recentLogs = await this.prisma.log.findMany({
      orderBy: { timestamp: 'desc' },
      take: 7,
    });

    return {
      totalEvents,
      totalAlerts,
      criticalAlerts,
      activeIncidents,
      securityScore,
      topAssets: topAssets.map((a) => ({ asset: a.destinationIp, count: a._count.id })),
      alertsBySeverity: alertsBySeverity.map((a) => ({ severity: a.severity, count: a._count.id })),
      topEventTypes: topEventTypes.map((e) => ({ eventType: e.eventType, count: e._count.id })),
      recentLogs,
    };
  }
}
