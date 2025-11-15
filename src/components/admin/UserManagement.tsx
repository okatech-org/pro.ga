import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, UserPlus, Shield, Ban } from "lucide-react";

type User = {
  id: string;
  email: string;
  full_name: string | null;
  account_type: string;
  created_at: string;
  workspaces_count: number;
  last_login: string | null;
  status: "active" | "suspended" | "banned";
};

export const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users] = useState<User[]>([
    {
      id: "1",
      email: "admin@proga.ga",
      full_name: "Admin PRO.GA",
      account_type: "admin",
      created_at: "2025-01-10T10:00:00Z",
      workspaces_count: 5,
      last_login: "2025-01-14T15:30:00Z",
      status: "active",
    },
    {
      id: "2",
      email: "particulier@example.com",
      full_name: "Jean Dupont",
      account_type: "individual",
      created_at: "2025-01-11T14:22:00Z",
      workspaces_count: 1,
      last_login: "2025-01-14T12:15:00Z",
      status: "active",
    },
    {
      id: "3",
      email: "commerce@example.com",
      full_name: "Marie Martin",
      account_type: "business",
      created_at: "2025-01-12T09:00:00Z",
      workspaces_count: 2,
      last_login: "2025-01-13T18:45:00Z",
      status: "active",
    },
  ]);

  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getStatusBadge = (status: User["status"]) => {
    const variants: Record<User["status"], "default" | "destructive" | "secondary"> = {
      active: "default",
      suspended: "secondary",
      banned: "destructive",
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  const getAccountTypeBadge = (type: string) => {
    const labels: Record<string, string> = {
      admin: "Admin",
      individual: "Particulier",
      business: "Entreprise",
    };
    return <Badge variant="outline">{labels[type] || type}</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Gestion des utilisateurs</CardTitle>
            <CardDescription>Liste complète des utilisateurs PRO.GA</CardDescription>
          </div>
          <Button variant="default">
            <UserPlus className="w-4 h-4 mr-2" />
            Créer utilisateur
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Rechercher par email ou nom..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Workspaces</TableHead>
                <TableHead>Dernière connexion</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{user.full_name || "Sans nom"}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>{getAccountTypeBadge(user.account_type)}</TableCell>
                  <TableCell>{user.workspaces_count}</TableCell>
                  <TableCell>
                    {user.last_login
                      ? new Date(user.last_login).toLocaleDateString("fr-FR")
                      : "Jamais"}
                  </TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Shield className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Ban className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <p>
            {filteredUsers.length} utilisateur(s) sur {users.length}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

