import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Building2, TrendingUp, Users, Package } from "lucide-react";

type WorkspaceStats = {
  id: string;
  name: string;
  owner_email: string;
  type: string;
  scope: "personal" | "business";
  status: "active" | "suspended";
  created_at: string;
  stats: {
    invoices: number;
    products: number;
    contracts: number;
    exports: number;
  };
};

export const WorkspaceMonitoring = () => {
  const workspaces: WorkspaceStats[] = [
    {
      id: "ws-1",
      name: "Espace Personnel - Jean",
      owner_email: "particulier@example.com",
      type: "household",
      scope: "personal",
      status: "active",
      created_at: "2025-01-11T10:00:00Z",
      stats: { invoices: 0, products: 0, contracts: 2, exports: 1 },
    },
    {
      id: "ws-2",
      name: "Boutique Vêtements",
      owner_email: "commerce@example.com",
      type: "commerce",
      scope: "business",
      status: "active",
      created_at: "2025-01-12T14:30:00Z",
      stats: { invoices: 45, products: 120, contracts: 0, exports: 3 },
    },
    {
      id: "ws-3",
      name: "Restaurant Le Gourmet",
      owner_email: "resto@example.com",
      type: "hospitality",
      scope: "business",
      status: "active",
      created_at: "2025-01-13T09:15:00Z",
      stats: { invoices: 230, products: 85, contracts: 0, exports: 5 },
    },
  ];

  const getScopeBadge = (scope: "personal" | "business") => {
    return scope === "personal" ? (
      <Badge variant="secondary">Personnel</Badge>
    ) : (
      <Badge variant="default">Entreprise</Badge>
    );
  };

  const getStatusBadge = (status: "active" | "suspended") => {
    return status === "active" ? (
      <Badge>Actif</Badge>
    ) : (
      <Badge variant="destructive">Suspendu</Badge>
    );
  };

  const totalStats = workspaces.reduce(
    (acc, ws) => ({
      invoices: acc.invoices + ws.stats.invoices,
      products: acc.products + ws.stats.products,
      contracts: acc.contracts + ws.stats.contracts,
      exports: acc.exports + ws.stats.exports,
    }),
    { invoices: 0, products: 0, contracts: 0, exports: 0 },
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Building2 className="w-4 h-4 text-primary" />
              Workspaces
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{workspaces.length}</p>
            <p className="text-xs text-muted-foreground">Total actifs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-success" />
              Factures
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalStats.invoices}</p>
            <p className="text-xs text-muted-foreground">Tous workspaces</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Package className="w-4 h-4 text-info" />
              Produits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalStats.products}</p>
            <p className="text-xs text-muted-foreground">Catalogues actifs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-warning" />
              Contrats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalStats.contracts}</p>
            <p className="text-xs text-muted-foreground">Emploi domicile</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tous les workspaces</CardTitle>
          <CardDescription>Vue détaillée des espaces créés</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Workspace</TableHead>
                  <TableHead>Propriétaire</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Factures</TableHead>
                  <TableHead>Produits</TableHead>
                  <TableHead>Contrats</TableHead>
                  <TableHead>Exports</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workspaces.map((ws) => (
                  <TableRow key={ws.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{ws.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Créé le {new Date(ws.created_at).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{ws.owner_email}</p>
                    </TableCell>
                    <TableCell>{getScopeBadge(ws.scope)}</TableCell>
                    <TableCell>{ws.stats.invoices}</TableCell>
                    <TableCell>{ws.stats.products}</TableCell>
                    <TableCell>{ws.stats.contracts}</TableCell>
                    <TableCell>{ws.stats.exports}</TableCell>
                    <TableCell>{getStatusBadge(ws.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

