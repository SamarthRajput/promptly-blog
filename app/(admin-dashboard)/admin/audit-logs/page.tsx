"use client";
import React, { useEffect, useState } from 'react'
interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
};
interface Data {
  id: string;
  action: "create" | "update" | "delete" | "submit" | "approve" | "reject" | "publish" | "archive" | "invite" | "invite_accept" | "invite_decline" | "invite_revoke" | "login" | "logout";
  createdAt: Date;
}

interface Actor {
  id: string | null;
  name: string | null;
  email: string | null;
  avatarUrl: string | null;
  siteRole: "user" | "admin" | null;
}

interface AuditLogs {
  data: Data[];
  metadata: unknown;
  actor: Actor;
  target: {
    id: string | null;
    type: "user" | "invitation" | "other" | null;
    name?: string | null;
    email?: string | null;
    avatar?: string | null;
  };
  pagination: Pagination;
}

const AuditLogsPage = () => {
  const [auditLogs, setAuditLogs] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/audit-logs');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setAuditLogs(data);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [])

  return (
    <div>
      <h1>Audit Logs</h1>
      <p>This is the audit logs page under the admin dashboard.</p>
      {loading ? <p>Loading...</p> : null}
      {JSON.stringify(auditLogs)}
    </div>
  )
}

export default AuditLogsPage
