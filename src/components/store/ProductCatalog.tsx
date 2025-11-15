import { useCallback } from "react";
import { NeuCard } from "@/components/ui/neu-card";
import { NeuButton } from "@/components/ui/neu-button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Package, TrendingUp } from "lucide-react";
import type { StoreProduct } from "@/types/domain";

type ProductCatalogProps = {
  products: StoreProduct[];
  onAddToCart?: (product: StoreProduct) => void;
  currency?: string;
};

export const ProductCatalog = ({ products, onAddToCart, currency = "XOF" }: ProductCatalogProps) => {
  const handleAddToCart = useCallback(
    (product: StoreProduct) => {
      if (product.status === "active") {
        onAddToCart?.(product);
      }
    },
    [onAddToCart],
  );

  if (!products.length) {
    return (
      <NeuCard className="p-12 text-center">
        <Package className="w-16 h-16 text-muted-foreground/40 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-slate-900 mb-2">Aucun produit disponible</h3>
        <p className="text-sm text-muted-foreground">
          Les produits seront bientôt disponibles dans cette boutique.
        </p>
      </NeuCard>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {products.map((product) => (
        <NeuCard key={product.id} className="p-5 flex flex-col">
          <div className="flex-1 space-y-3">
            {product.featured && (
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <Badge variant="default" className="text-xs">
                  Populaire
                </Badge>
              </div>
            )}
            
            {product.imageUrl && (
              <div className="aspect-square w-full rounded-xl overflow-hidden bg-muted mb-3">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            )}

            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-1 line-clamp-2">{product.name}</h3>
              {product.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{product.description}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-slate-900">
                  {product.price.toLocaleString("fr-FR")} {product.currency || currency}
                </span>
                {product.stock != null && (
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    product.stock > 10
                      ? "bg-green-100 text-green-700"
                      : product.stock > 0
                      ? "bg-orange-100 text-orange-700"
                      : "bg-red-100 text-red-700"
                  }`}>
                    {product.stock > 0 ? `${product.stock} en stock` : "Rupture"}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="pt-4 mt-auto border-t border-border">
            <NeuButton
              type="button"
              variant="premium"
              className="w-full"
              disabled={product.status !== "active" || (product.stock != null && product.stock === 0)}
              onClick={() => handleAddToCart(product)}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {product.stock === 0 ? "Rupture" : "Ajouter au panier"}
            </NeuButton>
          </div>
        </NeuCard>
      ))}
    </div>
  );
};

