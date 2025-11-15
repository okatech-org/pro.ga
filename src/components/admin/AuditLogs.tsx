import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Activity } from "lucide-react";
import { useAuditLog } from "@/hooks/useAuditLog";

export const AuditLogs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [eventTypeFilter, setEventTypeFilter] = useState<string>("all");
  const { events, loading } = useAuditLog();

  const eventTypes = [
    { value: "all", label: "Tous les événements" },
    { value: "auth.login", label: "Connexions" },
    { value: "auth.logout", label: "Déconnexions" },
    { value: "workspace.created", label: "Workspaces créés" },
    { value: "workspace.updated", label: "Workspaces modifiés" },
    { value: "export.generated", label: "Exports générés" },
    { value: "invoice.created", label: "Factures créées" },
  ];

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      searchTerm === "" ||
      event.event_type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = eventTypeFilter === "all" || event.event_type === eventTypeFilter;
    return matchesSearch && matchesType;
  });

  const getEventBadge = (type: string) => {
    if (type.startsWith("auth.")) return <Badge variant="default">Auth</Badge>;
    if (type.startsWith("workspace.")) return <Badge variant="secondary">Workspace</Badge>;
    if (type.startsWith("export.")) return <Badge>Export</Badge>;
    if (type.startsWith("invoice.")) return <Badge variant="outline">Facture</Badge>;
    return <Badge variant="secondary">Autre</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          <div>
            <CardTitle>Logs d'audit</CardTitle>
            <CardDescription>Traçabilité complète des actions utilisateurs</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 flex-1">
            <Search className="w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Rechercher un événement..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={eventTypeFilter} onValueChange={setEventTypeFilter}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Type d'événement" />
            </SelectTrigger>
            <SelectContent>
              {eventTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="text-center py-8 text-muted-foreground">
            Chargement des événements...
          </div>
        ) : (
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Événement</TableHead>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Workspace</TableHead>
                  <TableHead>Détails</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      Aucun événement trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>
                        {new Date(event.created_at).toLocaleString("fr-FR")}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getEventBadge(event.event_type)}
                          <span className="text-sm">{event.event_type}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-mono">
                          {event.user_id?.slice(0, 8) || "N/A"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-mono">
                          {event.workspace_id?.slice(0, 8) || "N/A"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {JSON.stringify(event.event_data).slice(0, 50)}...
                        </code>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <p>
            {filteredEvents.length} événement(s) sur {events.length}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

