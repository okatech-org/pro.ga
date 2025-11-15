import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { PosCartItem, StoreProduct } from "@/types/domain";

type PosScreenProps = {
  products: StoreProduct[];
  currency?: string;
  onCheckout?: (payload: { items: PosCartItem[]; total: number; paymentMethod: string }) => void;
};

const paymentMethods = ["Espèces", "Mobile Money", "Carte"];

export const PosScreen = ({ products, currency = "XOF", onCheckout }: PosScreenProps) => {
  const [cart, setCart] = useState<PosCartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0]);

  const addToCart = (product: StoreProduct) => {
    setCart((previous) => {
      const existing = previous.find((item) => item.productId === product.id);
      if (existing) {
        return previous.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * item.unitPrice }
            : item,
        );
      }
      return [
        ...previous,
        {
          productId: product.id,
          name: product.name,
          quantity: 1,
          unitPrice: product.price,
          subtotal: product.price,
        },
      ];
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setCart((previous) =>
      previous
        .map((item) =>
          item.productId === productId
            ? { ...item, quantity, subtotal: quantity * item.unitPrice }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const total = useMemo(() => cart.reduce((sum, item) => sum + item.subtotal, 0), [cart]);

  const handleCheckout = () => {
    onCheckout?.({ items: cart, total, paymentMethod });
    setCart([]);
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Produits</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <div className="grid md:grid-cols-3 gap-4">
              {products.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  className="border border-border rounded-lg p-4 text-left hover:border-primary"
                  onClick={() => addToCart(product)}
                  disabled={product.status !== "active"}
                >
                  <p className="font-semibold">{product.name}</p>
                  <p className="text-sm text-muted-foreground">{product.category}</p>
                  <p className="text-lg mt-2">
                    {product.price.toLocaleString("fr-FR")} {product.currency}
                  </p>
                </button>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Caisse</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {cart.length === 0 && (
              <p className="text-sm text-muted-foreground">Ajoutez des articles pour encaisser.</p>
            )}
            {cart.map((item) => (
              <div key={item.productId} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.unitPrice.toLocaleString("fr-FR")} {currency}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    className="w-16"
                    value={item.quantity}
                    min={1}
                    onChange={(event) => updateQuantity(item.productId, Number(event.target.value))}
                  />
                  <p className="font-semibold">
                    {item.subtotal.toLocaleString("fr-FR")} {currency}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Mode de paiement</p>
            <div className="flex gap-2">
              {paymentMethods.map((method) => (
                <Button
                  key={method}
                  type="button"
                  variant={paymentMethod === method ? "default" : "outline"}
                  onClick={() => setPaymentMethod(method)}
                >
                  {method}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-lg font-semibold">
            <span>Total</span>
            <span>
              {total.toLocaleString("fr-FR")} {currency}
            </span>
          </div>

          <Button type="button" className="w-full" onClick={handleCheckout} disabled={cart.length === 0}>
            Encaisser
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

