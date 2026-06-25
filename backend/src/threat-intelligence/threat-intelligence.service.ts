import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ThreatIntelligenceService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.threatIntelligence.findMany({ orderBy: { confidenceScore: 'desc' } });
  }

  async findOne(id: number) {
    const item = await this.prisma.threatIntelligence.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Threat intel not found');
    return item;
  }

  async create(data: { ipAddress: string; threatType: string; confidenceScore: number }) {
    return this.prisma.threatIntelligence.create({ data });
  }

  async remove(id: number) {
    await this.prisma.threatIntelligence.delete({ where: { id } });
    return { message: 'Deleted successfully' };
  }
}
