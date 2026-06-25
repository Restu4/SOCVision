import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryLogDto } from './dto/query-log.dto';

@Injectable()
export class LogsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: QueryLogDto) {
    const where: any = {};

    if (query.severity) where.severity = query.severity;
    if (query.username) where.username = { contains: query.username, mode: 'insensitive' };
    if (query.eventType) where.eventType = query.eventType;
    if (query.search) {
      where.OR = [
        { sourceIp: { contains: query.search, mode: 'insensitive' } },
        { destinationIp: { contains: query.search, mode: 'insensitive' } },
        { username: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    if (query.startDate || query.endDate) {
      where.timestamp = {};
      if (query.startDate) where.timestamp.gte = new Date(query.startDate);
      if (query.endDate) where.timestamp.lte = new Date(query.endDate);
    }

    const page = query.page || 1;
    const limit = query.limit || 50;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.log.findMany({
        where,
        orderBy: { timestamp: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.log.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getStats() {
    const [
      totalEvents,
      totalAlerts,
      criticalAlerts,
      activeIncidents,
      topAssets,
      eventsPerHour,
      alertsBySeverity,
      topEventTypes,
      failedLoginTrend,
      topSourceIPs,
    ] = await Promise.all([
      this.prisma.log.count(),
      this.prisma.alert.count(),
      this.prisma.alert.count({ where: { severity: 'CRITICAL' } }),
      this.prisma.incident.count({ where: { status: 'OPEN' } }),
      this.prisma.log.groupBy({
        by: ['destinationIp'],
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 5,
      }),
      this.prisma.log.findMany({
        select: { timestamp: true },
        orderBy: { timestamp: 'desc' },
        take: 200,
      }),
      this.prisma.alert.groupBy({
        by: ['severity'],
        _count: { id: true },
      }),
      this.prisma.log.groupBy({
        by: ['eventType'],
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 5,
      }),
      this.prisma.log.findMany({
        where: { eventType: 'LOGIN_FAILED' },
        select: { timestamp: true },
        orderBy: { timestamp: 'desc' },
        take: 168,
      }),
      this.prisma.log.groupBy({
        by: ['sourceIp'],
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 10,
      }),
    ]);

    const criticalCount = criticalAlerts;
    const highCount = await this.prisma.alert.count({ where: { severity: 'HIGH' } });
    const securityScore = Math.max(0, 100 - (criticalCount * 5 + highCount * 2));

    const now = new Date();
    const hourlyCounts: { hour: string; count: number }[] = [];
    for (let i = 23; i >= 0; i--) {
      const hour = new Date(now.getTime() - i * 60 * 60 * 1000);
      const hourEnd = new Date(hour.getTime() + 60 * 60 * 1000);
      const count = eventsPerHour.filter(
        (e) => e.timestamp >= hour && e.timestamp < hourEnd,
      ).length;
      hourlyCounts.push({
        hour: hour.toISOString().substring(0, 13),
        count,
      });
    }

    const dailyFailedLogin: { date: string; count: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const day = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dayEnd = new Date(day.getTime() + 24 * 60 * 60 * 1000);
      const count = failedLoginTrend.filter(
        (e) => e.timestamp >= day && e.timestamp < dayEnd,
      ).length;
      dailyFailedLogin.push({
        date: day.toISOString().substring(0, 10),
        count,
      });
    }

    return {
      totalEvents,
      totalAlerts,
      criticalAlerts: criticalCount,
      activeIncidents,
      securityScore,
      topAssets: topAssets.map((a) => ({
        asset: a.destinationIp,
        count: a._count.id,
      })),
      eventsPerHour: hourlyCounts,
      alertsBySeverity: alertsBySeverity.map((a) => ({
        severity: a.severity,
        count: a._count.id,
      })),
      topEventTypes: topEventTypes.map((e) => ({
        eventType: e.eventType,
        count: e._count.id,
      })),
      failedLoginTrend: dailyFailedLogin,
      topSourceIPs: topSourceIPs.map((s) => ({
        ip: s.sourceIp,
        count: s._count.id,
      })),
    };
  }
}
