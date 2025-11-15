import { useMemo, useState, useCallback } from "react";
import { NeuCard } from "@/components/ui/neu-card";
import { NeuButton } from "@/components/ui/neu-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShoppingCart, Minus, Plus, X, Loader2 } from "lucide-react";
import type { StoreProduct } from "@/types/domain";

type OrderItem = {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
};

type OrderFormProps = {
  items: OrderItem[];
  onUpdate?: (items: OrderItem[]) => void;
  onSubmit?: (payload: { customerName: string; customerEmail: string; items: OrderItem[]; total: number }) => void;
  currency?: string;
  submitting?: boolean;
};

export const OrderForm = ({ items, onUpdate, onSubmit, currency = "XOF", submitting = false }: OrderFormProps) => {
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0),
    [items],
  );

  const updateQuantity = useCallback(
    (productId: string, delta: number) => {
      const nextItems = items
        .map((item) => {
          if (item.productId === productId) {
            const newQuantity = Math.max(0, item.quantity + delta);
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
      onUpdate?.(nextItems);
    },
    [items, onUpdate],
  );

  const removeItem = useCallback(
    (productId: string) => {
      const nextItems = items.filter((item) => item.productId !== productId);
      onUpdate?.(nextItems);
    },
    [items, onUpdate],
  );

  const handleSubmit = useCallback(() => {
    if (!customerName.trim()) {
      return;
    }

    if (items.length === 0) {
      return;
    }

    onSubmit?.({ customerName: customerName.trim(), customerEmail: customerEmail.trim(), items, total });
    setCustomerName("");
    setCustomerEmail("");
  }, [customerName, customerEmail, items, total, onSubmit]);

  return (
    <NeuCard className="p-6 h-full">
      <div className="space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-border">
          <ShoppingCart className="w-5 h-5 text-primary" />
          <div>
            <h3 className="text-lg font-bold text-slate-900">Panier</h3>
            <p className="text-xs text-muted-foreground">
              {items.length} {items.length === 1 ? "article" : "articles"}
            </p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-8">
            <ShoppingCart className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">Votre panier est vide</p>
            <p className="text-xs text-muted-foreground mt-1">Ajoutez des produits pour continuer</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
            {items.map((item) => (
              <div
                key={item.productId}
                className="neu-inset rounded-xl p-3 flex items-start gap-3"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-slate-900 truncate">{item.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {item.unitPrice.toLocaleString("fr-FR")} {currency}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2">
                    <NeuButton
                      size="sm"
                      variant="outline"
                      className="h-7 w-7 p-0"
                      onClick={() => updateQuantity(item.productId, -1)}
                      disabled={submitting}
                      aria-label="Réduire la quantité"
                    >
                      <Minus className="w-3 h-3" />
                    </NeuButton>
                    <span className="text-sm font-semibold w-6 text-center">{item.quantity}</span>
                    <NeuButton
                      size="sm"
                      variant="outline"
                      className="h-7 w-7 p-0"
                      onClick={() => updateQuantity(item.productId, 1)}
                      disabled={submitting}
                      aria-label="Augmenter la quantité"
                    >
                      <Plus className="w-3 h-3" />
                    </NeuButton>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-900">
                      {(item.quantity * item.unitPrice).toLocaleString("fr-FR")} {currency}
                    </span>
                    <NeuButton
                      size="sm"
                      variant="outline"
                      className="h-6 w-6 p-0"
                      onClick={() => removeItem(item.productId)}
                      disabled={submitting}
                      aria-label="Retirer du panier"
                    >
                      <X className="w-3 h-3" />
                    </NeuButton>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {items.length > 0 && (
          <>
            <div className="space-y-3 pt-4 border-t border-border">
              <div>
                <Label htmlFor="customerName" className="text-xs font-semibold">
                  Nom complet <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="customerName"
                  placeholder="Votre nom complet"
                  value={customerName}
                  onChange={(event) => setCustomerName(event.target.value)}
                  disabled={submitting}
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="customerEmail" className="text-xs font-semibold">
                  Email <span className="text-muted-foreground">(optionnel)</span>
                </Label>
                <Input
                  id="customerEmail"
                  type="email"
                  placeholder="votre@email.com"
                  value={customerEmail}
                  onChange={(event) => setCustomerEmail(event.target.value)}
                  disabled={submitting}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-900">Total</span>
                <span className="text-xl font-bold text-slate-900">
                  {total.toLocaleString("fr-FR")} {currency}
                </span>
              </div>

              <NeuButton
                type="button"
                variant="premium"
                className="w-full"
                disabled={items.length === 0 || !customerName.trim() || submitting}
                onClick={handleSubmit}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Traitement...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Passer la commande
                  </>
                )}
              </NeuButton>
            </div>
          </>
        )}
      </div>
    </NeuCard>
  );
};

