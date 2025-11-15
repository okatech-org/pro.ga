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

    let query = supabase
      .from("audit_events")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    if (filters?.userId) {
      query = query.eq("user_id", filters.userId);
    }
    if (filters?.workspaceId) {
      query = query.eq("workspace_id", filters.workspaceId);
    }
    if (filters?.eventType) {
      query = query.eq("event_type", filters.eventType);
    }
    if (filters?.startDate) {
      query = query.gte("created_at", filters.startDate);
    }
    if (filters?.endDate) {
      query = query.lte("created_at", filters.endDate);
    }

    const { data, error: queryError } = await query;

    if (queryError) {
      setError(queryError.message);
      setEvents([]);
    } else if (data) {
      setEvents(data as AuditEvent[]);
    }

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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error: insertError } = await supabase.from("audit_events").insert({
        user_id: user.id,
        workspace_id: workspaceId || null,
        event_type: eventType,
        event_data: eventData || {},
      });

      if (insertError) {
        console.error("Failed to log audit event:", insertError);
      } else {
        await fetchEvents();
      }
    },
    [fetchEvents],
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

