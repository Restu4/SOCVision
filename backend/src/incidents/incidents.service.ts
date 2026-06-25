import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class IncidentsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.incident.findMany({ orderBy: { openedAt: 'desc' } });
  }

  async findOne(id: number) {
    const incident = await this.prisma.incident.findUnique({ where: { id } });
    if (!incident) throw new NotFoundException('Incident not found');
    return incident;
  }

  async update(id: number, dto: any) {
    const data: any = {};
    if (dto.status) data.status = dto.status;
    if (dto.title) data.title = dto.title;
    if (dto.status === 'RESOLVED') data.closedAt = new Date();

    return this.prisma.incident.update({ where: { id }, data });
  }
}
