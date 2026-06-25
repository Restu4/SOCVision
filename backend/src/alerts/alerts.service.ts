import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateAlertDto } from './dto/update-alert.dto';

@Injectable()
export class AlertsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: any) {
    const where: any = {};

    if (query.severity) where.severity = query.severity;
    if (query.status) where.status = query.status;

    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.alert.findMany({
        where,
        include: {
          log: true,
          assigned: { select: { id: true, fullname: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.alert.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: number) {
    const alert = await this.prisma.alert.findUnique({
      where: { id },
      include: {
        log: true,
        assigned: { select: { id: true, fullname: true, email: true } },
      },
    });
    if (!alert) throw new NotFoundException('Alert not found');
    return alert;
  }

  async update(id: number, dto: UpdateAlertDto, user: any) {
    const data: any = {};
    if (dto.status) data.status = dto.status;
    if (dto.assignedTo !== undefined) data.assignedTo = dto.assignedTo;

    return this.prisma.alert.update({
      where: { id },
      data,
      include: {
        log: true,
        assigned: { select: { id: true, fullname: true, email: true } },
      },
    });
  }
}
