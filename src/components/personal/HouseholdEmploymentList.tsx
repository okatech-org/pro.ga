import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { EmploymentContract, ContractStatus } from "@/types/domain";

type HouseholdEmploymentListProps = {
  contracts: EmploymentContract[];
  onSelect?: (contract: EmploymentContract) => void;
  onTerminate?: (contract: EmploymentContract) => void;
  emptyStateMessage?: string;
};

const statusVariant: Record<ContractStatus, "default" | "secondary" | "outline"> = {
  DRAFT: "secondary",
  ACTIVE: "default",
  ENDED: "outline",
};

export const HouseholdEmploymentList = ({
  contracts,
  onSelect,
  onTerminate,
  emptyStateMessage = "Aucun contrat enregistré pour cet espace.",
}: HouseholdEmploymentListProps) => {
  if (!contracts.length) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Contrats d'emploi à domicile</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{emptyStateMessage}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Contrats d'emploi à domicile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {contracts.map((contract) => (
          <div
            key={contract.id}
            className="rounded-xl border border-border p-4 space-y-2 hover:border-primary cursor-pointer transition-colors"
            onClick={() => onSelect?.(contract)}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">{contract.employeeName}</p>
                <p className="text-sm text-muted-foreground">{contract.role}</p>
              </div>
              <Badge variant={statusVariant[contract.status]}>
                {contract.status === "ACTIVE" ? "Actif" : contract.status}
              </Badge>
            </div>

            <div className="grid md:grid-cols-3 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground">Type</p>
                <p className="font-medium capitalize">{contract.contractType}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Taux horaire</p>
                <p className="font-medium">{contract.hourlyRate.toLocaleString("fr-FR")} FCFA</p>
              </div>
              <div>
                <p className="text-muted-foreground">Heures / semaine</p>
                <p className="font-medium">{contract.weeklyHours} h</p>
              </div>
            </div>

            {onTerminate && contract.status === "ACTIVE" && (
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={(event) => {
                    event.stopPropagation();
                    onTerminate(contract);
                  }}
                >
                  Terminer
                </Button>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

