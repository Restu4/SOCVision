export interface User {
  id: number;
  fullname: string;
  email: string;
  role: 'ADMIN' | 'ANALYST' | 'VIEWER';
  createdAt?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: { id: number; email: string; role: string };
}

export interface Log {
  id: number;
  timestamp: string;
  sourceIp: string;
  destinationIp: string;
  username: string;
  eventType: string;
  severity: string;
  status: string;
}

export interface Alert {
  id: number;
  logId: number;
  severity: string;
  title: string;
  description: string;
  status: string;
  assignedTo: number | null;
  createdAt: string;
  log?: Log;
  assigned?: { id: number; fullname: string; email: string };
}

export interface Incident {
  id: number;
  title: string;
  severity: string;
  status: string;
  openedAt: string;
  closedAt: string | null;
}

export interface ThreatIntel {
  id: number;
  ipAddress: string;
  threatType: string;
  confidenceScore: number;
}

export interface DetectionRule {
  id: number;
  name: string;
  condition: string;
  severity: string;
  enabled: boolean;
}

export interface DashboardStats {
  totalEvents: number;
  totalAlerts: number;
  criticalAlerts: number;
  activeIncidents: number;
  securityScore: number;
  topAssets: { asset: string; count: number }[];
  alertsBySeverity: { severity: string; count: number }[];
  topEventTypes: { eventType: string; count: number }[];
  recentLogs: Log[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
