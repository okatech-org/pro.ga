import { useState, useCallback } from "react";
import { NeuCard } from "@/components/ui/neu-card";
import { NeuButton } from "@/components/ui/neu-button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Package,
  CheckCircle2,
  XCircle,
  Trash2,
  Eye,
  TrendingUp,
  Clock,
  Truck,
} from "lucide-react";
import type { StoreOrder } from "@/types/domain";
import type { OrderStatus } from "@/hooks/useStoreOrders";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

type OrdersManagerProps = {
  orders: StoreOrder[];
  loading?: boolean;
  onUpdateStatus?: (orderId: string, status: OrderStatus) => void;
  onDelete?: (orderId: string) => void;
  stats?: {
    total: number;
    pending: number;
    confirmed: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
    totalRevenue: number;
  };
};

const statusLabels: Record<OrderStatus, string> = {
  pending: "En attente",
  confirmed: "Confirmée",
  processing: "En traitement",
  shipped: "Expédiée",
  delivered: "Livrée",
  cancelled: "Annulée",
};

const statusColors: Record<OrderStatus, string> = {
  pending: "bg-yellow-500/10 text-yellow-700 border-yellow-500/20",
  confirmed: "bg-blue-500/10 text-blue-700 border-blue-500/20",
  processing: "bg-purple-500/10 text-purple-700 border-purple-500/20",
  shipped: "bg-indigo-500/10 text-indigo-700 border-indigo-500/20",
  delivered: "bg-green-500/10 text-green-700 border-green-500/20",
  cancelled: "bg-red-500/10 text-red-700 border-red-500/20",
};

const statusIcons: Record<OrderStatus, typeof Clock> = {
  pending: Clock,
  confirmed: CheckCircle2,
  processing: Package,
  shipped: Truck,
  delivered: CheckCircle2,
  cancelled: XCircle,
};

export const OrdersManager = ({
  orders,
  loading = false,
  onUpdateStatus,
  onDelete,
  stats,
}: OrdersManagerProps) => {
  const [selectedOrder, setSelectedOrder] = useState<StoreOrder | null>(null);
  const [filterStatus, setFilterStatus] = useState<OrderStatus | "all">("all");

  const filteredOrders = orders.filter(
    (order) => filterStatus === "all" || order.status === filterStatus
  );

  const handleViewOrder = useCallback((order: StoreOrder) => {
    setSelectedOrder(order);
  }, []);

  const handleStatusChange = useCallback(
    (orderId: string, newStatus: OrderStatus) => {
      onUpdateStatus?.(orderId, newStatus);
    },
    [onUpdateStatus]
  );

  const handleDelete = useCallback(
    (orderId: string) => {
      if (window.confirm("Êtes-vous sûr de vouloir supprimer cette commande ?")) {
        onDelete?.(orderId);
      }
    },
    [onDelete]
  );

  if (loading && orders.length === 0) {
    return (
      <NeuCard className="p-12 text-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-muted-foreground">Chargement des commandes...</p>
      </NeuCard>
    );
  }

  return (
    <div className="space-y-4">
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <NeuCard className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Total</p>
                <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
              </div>
              <Package className="w-8 h-8 text-primary opacity-50" />
            </div>
          </NeuCard>

          <NeuCard className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">En attente</p>
                <p className="text-2xl font-bold text-yellow-700">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600 opacity-50" />
            </div>
          </NeuCard>

          <NeuCard className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Livrées</p>
                <p className="text-2xl font-bold text-green-700">{stats.delivered}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-600 opacity-50" />
            </div>
          </NeuCard>

          <NeuCard className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">CA Total</p>
                <p className="text-2xl font-bold text-slate-900">
                  {stats.totalRevenue.toLocaleString("fr-FR")} XOF
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary opacity-50" />
            </div>
          </NeuCard>
        </div>
      )}

      <NeuCard className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-1">Gestion des commandes</h2>
            <p className="text-sm text-muted-foreground">
              Gérez et suivez toutes les commandes de votre boutique
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Label htmlFor="status-filter" className="text-sm">
              Filtrer :
            </Label>
            <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as OrderStatus | "all")}>
              <SelectTrigger id="status-filter" className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="confirmed">Confirmées</SelectItem>
                <SelectItem value="processing">En traitement</SelectItem>
                <SelectItem value="shipped">Expédiées</SelectItem>
                <SelectItem value="delivered">Livrées</SelectItem>
                <SelectItem value="cancelled">Annulées</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-muted-foreground/40 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-2">Aucune commande</h3>
            <p className="text-sm text-muted-foreground">
              {filterStatus === "all"
                ? "Vous n'avez pas encore reçu de commandes."
                : `Aucune commande avec le statut "${statusLabels[filterStatus as OrderStatus]}"`}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Articles</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => {
                  const StatusIcon = statusIcons[order.status];
                  return (
                    <TableRow key={order.id}>
                      <TableCell>
                        <div className="text-sm">
                          <p className="font-medium text-slate-900">
                            {format(new Date(order.createdAt), "dd MMM yyyy", { locale: fr })}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(order.createdAt), "HH:mm", { locale: fr })}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-slate-900">{order.customerName}</p>
                          {order.customerEmail && (
                            <p className="text-xs text-muted-foreground">{order.customerEmail}</p>
                          )}
                          {order.customerPhone && (
                            <p className="text-xs text-muted-foreground">{order.customerPhone}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {order.items.slice(0, 2).map((item, idx) => (
                            <p key={idx} className="text-sm text-slate-900">
                              {item.quantity}x {item.name}
                            </p>
                          ))}
                          {order.items.length > 2 && (
                            <p className="text-xs text-muted-foreground">
                              +{order.items.length - 2} autre(s)
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-slate-900">
                          {order.total.toLocaleString("fr-FR")} {order.currency}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <StatusIcon className="w-4 h-4" />
                          <Badge className={statusColors[order.status]}>
                            {statusLabels[order.status]}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <NeuButton
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewOrder(order)}
                          >
                            <Eye className="w-4 h-4" />
                          </NeuButton>
                          <Select
                            value={order.status}
                            onValueChange={(value) => handleStatusChange(order.id, value as OrderStatus)}
                          >
                            <SelectTrigger className="w-36 h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">En attente</SelectItem>
                              <SelectItem value="confirmed">Confirmée</SelectItem>
                              <SelectItem value="processing">En traitement</SelectItem>
                              <SelectItem value="shipped">Expédiée</SelectItem>
                              <SelectItem value="delivered">Livrée</SelectItem>
                              <SelectItem value="cancelled">Annulée</SelectItem>
                            </SelectContent>
                          </Select>
                          <NeuButton
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(order.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </NeuButton>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </NeuCard>

      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedOrder && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg flex-shrink-0">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400 mb-1">Commande</p>
                    <h3 className="text-xl font-bold text-slate-900">
                      Commande #{selectedOrder.id.slice(0, 8)}
                    </h3>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Date</Label>
                    <p className="text-sm font-medium">
                      {format(new Date(selectedOrder.createdAt), "dd MMMM yyyy 'à' HH:mm", { locale: fr })}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Statut</Label>
                    <div className="flex items-center gap-2 mt-1">
                      {(() => {
                        const StatusIcon = statusIcons[selectedOrder.status];
                        return <StatusIcon className="w-4 h-4" />;
                      })()}
                      <Badge className={statusColors[selectedOrder.status]}>
                        {statusLabels[selectedOrder.status]}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground mb-2 block">Client</Label>
                  <NeuCard className="p-4">
                    <div className="space-y-2">
                      <p className="font-medium text-slate-900">{selectedOrder.customerName}</p>
                      {selectedOrder.customerEmail && (
                        <p className="text-sm text-muted-foreground">
                          Email: {selectedOrder.customerEmail}
                        </p>
                      )}
                      {selectedOrder.customerPhone && (
                        <p className="text-sm text-muted-foreground">
                          Téléphone: {selectedOrder.customerPhone}
                        </p>
                      )}
                    </div>
                  </NeuCard>
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground mb-2 block">Articles</Label>
                  <NeuCard className="p-4">
                    <div className="space-y-3">
                      {selectedOrder.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between pb-3 border-b border-border last:border-0 last:pb-0">
                          <div>
                            <p className="font-medium text-slate-900">{item.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {item.quantity} × {item.unitPrice.toLocaleString("fr-FR")} {selectedOrder.currency}
                            </p>
                          </div>
                          <p className="font-semibold text-slate-900">
                            {(item.quantity * item.unitPrice).toLocaleString("fr-FR")} {selectedOrder.currency}
                          </p>
                        </div>
                      ))}
                      <div className="flex items-center justify-between pt-3 border-t border-border">
                        <p className="font-bold text-lg text-slate-900">Total</p>
                        <p className="font-bold text-lg text-slate-900">
                          {selectedOrder.total.toLocaleString("fr-FR")} {selectedOrder.currency}
                        </p>
                      </div>
                    </div>
                  </NeuCard>
                </div>
              </div>

              <DialogFooter>
                <NeuButton variant="outline" onClick={() => setSelectedOrder(null)}>
                  Fermer
                </NeuButton>
                {selectedOrder.status !== "delivered" && selectedOrder.status !== "cancelled" && (
                  <Select
                    value={selectedOrder.status}
                    onValueChange={(value) => {
                      handleStatusChange(selectedOrder.id, value as OrderStatus);
                      setSelectedOrder({ ...selectedOrder, status: value as OrderStatus });
                    }}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">En attente</SelectItem>
                      <SelectItem value="confirmed">Confirmée</SelectItem>
                      <SelectItem value="processing">En traitement</SelectItem>
                      <SelectItem value="shipped">Expédiée</SelectItem>
                      <SelectItem value="delivered">Livrée</SelectItem>
                      <SelectItem value="cancelled">Annulée</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
