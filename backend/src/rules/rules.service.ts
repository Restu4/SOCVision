import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Severity } from '@prisma/client';

@Injectable()
export class RulesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.detectionRule.findMany();
  }

  async findOne(id: number) {
    const rule = await this.prisma.detectionRule.findUnique({ where: { id } });
    if (!rule) throw new NotFoundException('Rule not found');
    return rule;
  }

  async create(data: { name: string; condition: string; severity: string; enabled?: boolean }) {
    return this.prisma.detectionRule.create({
      data: { ...data, severity: data.severity as Severity },
    });
  }

  async update(id: number, data: any) {
    return this.prisma.detectionRule.update({ where: { id }, data });
  }
}
