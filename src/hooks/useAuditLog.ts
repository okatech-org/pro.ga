import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type AuditEvent = {
  id: string;
  user_id: string | null;
  workspace_id: string | null;
  event_type: string;
  event_data: Record<string, unknown>;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
};

export type AuditFilters = {
  userId?: string;
  workspaceId?: string;
  eventType?: string;
  startDate?: string;
  endDate?: string;
};

export const useAuditLog = (filters?: AuditFilters) => {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);

    // Mock data for now - table doesn't exist yet
    setEvents([]);
    setLoading(false);
  }, [filters]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const logEvent = useCallback(
    async (
      eventType: string,
      eventData?: Record<string, unknown>,
      workspaceId?: string,
    ) => {
      // Mock implementation - table doesn't exist yet
      console.log("Audit log:", { eventType, eventData, workspaceId });
    },
    [],
  );

  return useMemo(
    () => ({
      events,
      loading,
      error,
      refresh: fetchEvents,
      logEvent,
    }),
    [events, loading, error, fetchEvents, logEvent],
  );
};

