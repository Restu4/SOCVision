import { PrismaClient, Role, Severity, EventType, LogStatus, AlertStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Clean existing data
  await prisma.alert.deleteMany();
  await prisma.log.deleteMany();
  await prisma.incident.deleteMany();
  await prisma.threatIntelligence.deleteMany();
  await prisma.detectionRule.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const passwordHash = await bcrypt.hash('admin123', 10);
  const analystHash = await bcrypt.hash('analyst123', 10);

  const admin = await prisma.user.create({
    data: {
      fullname: 'Admin SOC',
      email: 'admin@socvision.com',
      passwordHash,
      role: Role.ADMIN,
    },
  });

  await prisma.user.create({
    data: {
      fullname: 'Analyst One',
      email: 'analyst1@socvision.com',
      passwordHash: analystHash,
      role: Role.ANALYST,
    },
  });

  await prisma.user.create({
    data: {
      fullname: 'Viewer User',
      email: 'viewer@socvision.com',
      passwordHash: await bcrypt.hash('viewer123', 10),
      role: Role.VIEWER,
    },
  });

  // Create threat intelligence data
  const threats = [
    { ip: '185.220.101.0', type: 'Botnet', score: 95 },
    { ip: '103.235.46.0', type: 'Malware C2', score: 90 },
    { ip: '45.33.32.0', type: 'Port Scanner', score: 80 },
    { ip: '91.121.87.0', type: 'Phishing', score: 85 },
    { ip: '192.168.1.200', type: 'Internal Scanner', score: 75 },
    { ip: '10.0.0.50', type: 'Brute Force', score: 88 },
    { ip: '172.16.0.100', type: 'DDoS', score: 92 },
    { ip: '104.248.50.0', type: 'Botnet', score: 78 },
    { ip: '167.99.100.0', type: 'Data Exfil', score: 85 },
    { ip: '198.51.100.0', type: 'Malware', score: 82 },
  ];

  for (const t of threats) {
    await prisma.threatIntelligence.create({
      data: {
        ipAddress: t.ip,
        threatType: t.type,
        confidenceScore: t.score,
      },
    });
  }

  // Create detection rules
  const rules = [
    {
      name: 'Brute Force Detection',
      condition: 'Failed Login >= 5 within 5 minutes',
      severity: Severity.HIGH,
    },
    {
      name: 'Impossible Travel',
      condition: 'Login from Jakarta then London within 5 minutes',
      severity: Severity.CRITICAL,
    },
    {
      name: 'Admin Privilege Escalation',
      condition: 'Role changed to Admin',
      severity: Severity.HIGH,
    },
    {
      name: 'Malicious IP Match',
      condition: 'Source IP in Threat Database',
      severity: Severity.CRITICAL,
    },
  ];

  for (const r of rules) {
    await prisma.detectionRule.create({ data: r });
  }

  // Generate log data (last 7 days)
  const sourceIPs = [
    '192.168.1.10', '192.168.1.20', '10.0.0.1', '172.16.0.5',
    '185.220.101.5', '103.235.46.10', '45.33.32.15', '91.121.87.20',
    '10.0.0.50', '192.168.1.200', '167.99.100.5', '104.248.50.25',
  ];
  const usernames = ['admin', 'user1', 'user2', 'analyst1', 'viewer', 'jdoe', 'asmith', 'bwilson'];
  const destinations = ['WEB-01', 'DB-01', 'VPN-01', 'MAIL-01', 'APP-01', 'FILE-01', 'DNS-01'];
  const eventTypes = Object.values(EventType);
  const severities: Severity[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

  const logsToCreate: any[] = [];
  const now = new Date();

  for (let i = 0; i < 150; i++) {
    const hoursAgo = Math.floor(Math.random() * 168);
    const minutesAgo = Math.floor(Math.random() * 60);
    const timestamp = new Date(now.getTime() - (hoursAgo * 60 * 60 * 1000) - (minutesAgo * 60 * 1000));
    const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    const severity = eventType === 'LOGIN_FAILED' ? 'HIGH' as Severity :
      eventType === 'ACCESS_DENIED' ? 'MEDIUM' as Severity :
      eventType === 'ROLE_CHANGE' ? 'HIGH' as Severity :
      severities[Math.floor(Math.random() * 3)];

    let status: LogStatus = 'NORMAL';
    if (severity === 'HIGH' || severity === 'CRITICAL') {
      status = Math.random() > 0.3 ? 'SUSPICIOUS' : 'MALICIOUS';
    }

    logsToCreate.push({
      timestamp,
      sourceIp: sourceIPs[Math.floor(Math.random() * sourceIPs.length)],
      destinationIp: destinations[Math.floor(Math.random() * destinations.length)],
      username: usernames[Math.floor(Math.random() * usernames.length)],
      eventType,
      severity,
      status,
    });
  }

  for (const logData of logsToCreate) {
    await prisma.log.create({ data: logData });
  }

  // Create alerts from suspicious logs
  const suspiciousLogs = await prisma.log.findMany({
    where: {
      status: { in: ['SUSPICIOUS', 'MALICIOUS'] },
    },
  });

  for (const log of suspiciousLogs.slice(0, 20)) {
    const severity = log.severity === 'CRITICAL' ? Severity.CRITICAL :
      log.severity === 'HIGH' ? Severity.HIGH :
      Severity.MEDIUM;

    const alert = await prisma.alert.create({
      data: {
        logId: log.id,
        severity,
        title: `${log.eventType.replace(/_/g, ' ')} from ${log.sourceIp}`,
        description: `Suspicious ${log.eventType} detected from ${log.sourceIp} to ${log.destinationIp} by user ${log.username}.`,
        status: AlertStatus.OPEN,
        assignedTo: Math.random() > 0.5 ? admin.id : null,
      },
    });

    if (severity === Severity.CRITICAL || severity === Severity.HIGH) {
      await prisma.incident.create({
        data: {
          title: alert.title,
          severity,
          status: 'OPEN',
          openedAt: log.timestamp,
        },
      });
    }
  }

  console.log('Seed data created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
