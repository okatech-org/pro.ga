import { useState, useCallback, useMemo } from "react";
import { NeuCard } from "@/components/ui/neu-card";
import { NeuButton } from "@/components/ui/neu-button";
import { ProductCatalog } from "./ProductCatalog";
import { OrderForm } from "./OrderForm";
import { ShoppingBag, CheckCircle2 } from "lucide-react";
import type { StoreConfig, StoreProduct } from "@/types/domain";

type StorePublicPageProps = {
  config: StoreConfig;
  products: StoreProduct[];
  onOrderSubmit?: (payload: {
    customerName: string;
    customerEmail: string;
    items: { productId: string; name: string; quantity: number; unitPrice: number }[];
    total: number;
  }) => void;
  submitting?: boolean;
};

export const StorePublicPage = ({ config, products, onOrderSubmit, submitting = false }: StorePublicPageProps) => {
  const [cartItems, setCartItems] = useState<
    { productId: string; name: string; quantity: number; unitPrice: number }[]
  >([]);

  const activeProducts = useMemo(() => products.filter((p) => p.status === "active"), [products]);
  const currency = useMemo(() => products[0]?.currency || "XOF", [products]);

  const addToCart = useCallback((product: StoreProduct) => {
    if (product.status !== "active") return;
    
    setCartItems((previous) => {
      const existing = previous.find((item) => item.productId === product.id);
      if (existing) {
        return previous.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...previous, { productId: product.id, name: product.name, quantity: 1, unitPrice: product.price }];
    });
  }, []);

  const updateCartItems = useCallback((items: typeof cartItems) => {
    setCartItems(items);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-background border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-lg">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900">{config.name}</h1>
                {config.city && <p className="text-xs text-muted-foreground">{config.city}</p>}
              </div>
            </div>
            {config.address && (
              <p className="text-xs text-muted-foreground hidden sm:block">{config.address}</p>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 sm:space-y-12">
        <NeuCard className="p-6 sm:p-8 lg:p-12 bg-gradient-to-br from-primary/5 to-accent/5">
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900">
                {config.page.heroTitle}
              </h1>
              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
                {config.page.heroSubtitle}
              </p>
            </div>
            
            {config.page.trustBadges && config.page.trustBadges.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3 pt-4">
                {config.page.trustBadges.map((badge, index) => (
                  <div
                    key={index}
                    className="neu-card-sm px-4 py-2 rounded-full flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-slate-700">{badge}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </NeuCard>

        {config.page.highlights && config.page.highlights.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {config.page.highlights.map((highlight, index) => (
              <NeuCard key={index} className="p-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-slate-900">{highlight.title}</h3>
                  <p className="text-sm text-muted-foreground">{highlight.description}</p>
                </div>
              </NeuCard>
            ))}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6">Catalogue</h2>
              <ProductCatalog
                products={activeProducts}
                onAddToCart={addToCart}
                currency={currency}
              />
            </div>
          </div>
          
          <div className="lg:sticky lg:top-20 lg:self-start">
            <OrderForm
              items={cartItems}
              onUpdate={updateCartItems}
              onSubmit={onOrderSubmit}
              currency={currency}
              submitting={submitting}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

