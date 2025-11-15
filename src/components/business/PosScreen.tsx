import { useMemo, useState, useCallback } from "react";
import { NeuCard } from "@/components/ui/neu-card";
import { NeuButton } from "@/components/ui/neu-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  CreditCard,
  Loader2,
  AlertCircle,
  CheckCircle2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import type { PosCartItem, StoreProduct } from "@/types/domain";

type PosScreenProps = {
  products: StoreProduct[];
  currency?: string;
  onCheckout?: (payload: { items: PosCartItem[]; total: number; paymentMethod: string }) => Promise<void> | void;
};

const paymentMethods = ["Espèces", "Mobile Money", "Carte"];

export const PosScreen = ({ products, currency = "XOF", onCheckout }: PosScreenProps) => {
  const [cart, setCart] = useState<PosCartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const activeProducts = useMemo(
    () => products.filter((p) => p.status === "active"),
    [products]
  );

  const categories = useMemo(() => {
    const cats = new Set(activeProducts.map((p) => p.category).filter(Boolean));
    return Array.from(cats);
  }, [activeProducts]);

  const filteredProducts = useMemo(() => {
    let filtered = activeProducts;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query) ||
          p.sku?.toLowerCase().includes(query)
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    return filtered;
  }, [activeProducts, searchQuery, selectedCategory]);

  const validateStock = useCallback(
    (product: StoreProduct, requestedQuantity: number): boolean => {
      if (product.stock === null) return true;
      const cartItem = cart.find((item) => item.productId === product.id);
      const currentCartQuantity = cartItem?.quantity || 0;
      const newTotalQuantity = requestedQuantity;
      return newTotalQuantity <= product.stock;
    },
    [cart]
  );

  const addToCart = useCallback(
    (product: StoreProduct) => {
      if (product.status !== "active") {
        toast.error("Ce produit n'est pas disponible");
        return;
      }

      const cartItem = cart.find((item) => item.productId === product.id);
      const newQuantity = (cartItem?.quantity || 0) + 1;

      if (!validateStock(product, newQuantity)) {
        toast.error(`Stock insuffisant. Stock disponible: ${product.stock || 0}`);
        return;
      }

      setCart((previous) => {
        const existing = previous.find((item) => item.productId === product.id);
        if (existing) {
          return previous.map((item) =>
            item.productId === product.id
              ? { ...item, quantity: newQuantity, subtotal: newQuantity * item.unitPrice }
              : item
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
      setError(null);
    },
    [cart, validateStock]
  );

  const removeFromCart = useCallback((productId: string) => {
    setCart((previous) => previous.filter((item) => item.productId !== productId));
    setError(null);
  }, []);

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity < 1) {
        removeFromCart(productId);
        return;
      }

      const product = activeProducts.find((p) => p.id === productId);
      if (!product) return;

      if (!validateStock(product, quantity)) {
        toast.error(`Stock insuffisant. Stock disponible: ${product.stock || 0}`);
        return;
      }

      setCart((previous) =>
        previous
          .map((item) =>
            item.productId === productId
              ? { ...item, quantity, subtotal: quantity * item.unitPrice }
              : item
          )
          .filter((item) => item.quantity > 0)
      );
      setError(null);
    },
    [activeProducts, validateStock, removeFromCart]
  );

  const clearCart = useCallback(() => {
    setCart([]);
    setError(null);
    toast.info("Panier vidé");
  }, []);

  const incrementQuantity = useCallback(
    (productId: string) => {
      const cartItem = cart.find((item) => item.productId === productId);
      if (cartItem) {
        updateQuantity(productId, cartItem.quantity + 1);
      }
    },
    [cart, updateQuantity]
  );

  const decrementQuantity = useCallback(
    (productId: string) => {
      const cartItem = cart.find((item) => item.productId === productId);
      if (cartItem) {
        updateQuantity(productId, Math.max(1, cartItem.quantity - 1));
      }
    },
    [cart, updateQuantity]
  );

  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.subtotal, 0), [cart]);
  const taxRate = 0.18;
  const taxAmount = useMemo(() => Math.round(subtotal * taxRate), [subtotal, taxRate]);
  const total = useMemo(() => subtotal + taxAmount, [subtotal, taxAmount]);

  const handleCheckout = useCallback(async () => {
    if (cart.length === 0) {
      setError("Le panier est vide");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await onCheckout?.({ items: cart, total, paymentMethod });
      toast.success(
        `Encaissement ${paymentMethod} réussi (${total.toLocaleString("fr-FR")} ${currency})`,
        { duration: 3000 }
      );
      setCart([]);
      setShowConfirmDialog(false);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Impossible d'enregistrer la vente POS";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [cart, total, paymentMethod, currency, onCheckout]);

  const openConfirmDialog = useCallback(() => {
    if (cart.length === 0) {
      setError("Le panier est vide");
      return;
    }
    setShowConfirmDialog(true);
  }, [cart.length]);

  return (
    <>
      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
        <NeuCard className="lg:col-span-2 space-y-4 sm:space-y-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4">Produits</h2>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Rechercher un produit..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                {categories.length > 0 && (
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes catégories</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>

            {error && (
              <div className="neu-inset rounded-xl p-4 bg-red-50 border border-red-200 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-900">Erreur</p>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setError(null)}
                  className="text-red-600 hover:text-red-800"
                  aria-label="Fermer l'erreur"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="max-h-[500px] sm:max-h-[600px] overflow-y-auto pr-2">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <Search className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Aucun produit trouvé</h3>
                  <p className="text-sm text-muted-foreground">
                    {searchQuery ? "Essayez une autre recherche" : "Aucun produit disponible"}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                  {filteredProducts.map((product) => {
                    const cartItem = cart.find((item) => item.productId === product.id);
                    const isOutOfStock = product.stock !== null && product.stock === 0;
                    const isLowStock =
                      product.stock !== null && product.stock > 0 && product.stock <= 5;

                    return (
                      <button
                        key={product.id}
                        type="button"
                        onClick={() => addToCart(product)}
                        disabled={product.status !== "active" || isOutOfStock}
                        className="neu-card-sm p-3 sm:p-4 text-left hover:neu-raised transition-all disabled:opacity-50 disabled:cursor-not-allowed group relative"
                        aria-label={`Ajouter ${product.name} au panier`}
                      >
                        {product.featured && (
                          <Badge
                            variant="default"
                            className="absolute top-2 right-2 text-xs"
                          >
                            Populaire
                          </Badge>
                        )}
                        <div className="space-y-2">
                          {product.category && (
                            <p className="text-xs text-muted-foreground truncate">
                              {product.category}
                            </p>
                          )}
                          <p className="font-semibold text-sm sm:text-base text-slate-900 line-clamp-2">
                            {product.name}
                          </p>
                          <p className="text-lg sm:text-xl font-bold text-slate-900">
                            {product.price.toLocaleString("fr-FR")} {product.currency || currency}
                          </p>
                          {product.stock !== null && (
                            <div className="flex items-center gap-2">
                              {isOutOfStock ? (
                                <Badge variant="destructive" className="text-xs">
                                  Rupture
                                </Badge>
                              ) : isLowStock ? (
                                <Badge variant="outline" className="text-xs text-orange-700">
                                  Stock faible ({product.stock})
                                </Badge>
                              ) : (
                                <span className="text-xs text-muted-foreground">
                                  {product.stock} en stock
                                </span>
                              )}
                            </div>
                          )}
                          {cartItem && (
                            <div className="flex items-center gap-2 pt-2">
                              <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-primary/10">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    decrementQuantity(product.id);
                                  }}
                                  className="p-1 hover:bg-primary/20 rounded"
                                  aria-label="Diminuer la quantité"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="text-sm font-semibold w-6 text-center">
                                  {cartItem.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    incrementQuantity(product.id);
                                  }}
                                  className="p-1 hover:bg-primary/20 rounded"
                                  aria-label="Augmenter la quantité"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </NeuCard>

        <div className="space-y-4 sm:space-y-6">
          <NeuCard className="sticky top-4">
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <ShoppingCart className="w-5 h-5 text-primary" />
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900">Caisse</h3>
                    <p className="text-xs text-muted-foreground">
                      {cart.length} {cart.length === 1 ? "article" : "articles"}
                    </p>
                  </div>
                </div>
                {cart.length > 0 && (
                  <NeuButton
                    variant="outline"
                    size="sm"
                    onClick={clearCart}
                    className="text-xs"
                    aria-label="Vider le panier"
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Vider
                  </NeuButton>
                )}
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="w-16 h-16 text-muted-foreground/40 mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground">Panier vide</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Ajoutez des produits pour commencer
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                    {cart.map((item) => {
                      const product = activeProducts.find((p) => p.id === item.productId);
                      return (
                        <div
                          key={item.productId}
                          className="neu-inset rounded-xl p-3 sm:p-4 flex items-start justify-between gap-3"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm sm:text-base text-slate-900 truncate">
                              {item.name}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {item.unitPrice.toLocaleString("fr-FR")} {currency}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <div className="flex items-center gap-2">
                              <NeuButton
                                variant="outline"
                                size="sm"
                                className="h-7 w-7 p-0"
                                onClick={() => decrementQuantity(item.productId)}
                                disabled={loading}
                                aria-label="Diminuer la quantité"
                              >
                                <Minus className="w-3 h-3" />
                              </NeuButton>
                              <Input
                                type="number"
                                className="w-12 h-7 text-center text-sm p-0"
                                value={item.quantity}
                                min={1}
                                onChange={(e) =>
                                  updateQuantity(item.productId, Number(e.target.value) || 1)
                                }
                                disabled={loading}
                              />
                              <NeuButton
                                variant="outline"
                                size="sm"
                                className="h-7 w-7 p-0"
                                onClick={() => incrementQuantity(item.productId)}
                                disabled={loading}
                                aria-label="Augmenter la quantité"
                              >
                                <Plus className="w-3 h-3" />
                              </NeuButton>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm sm:text-base font-semibold text-slate-900">
                                {item.subtotal.toLocaleString("fr-FR")} {currency}
                              </span>
                              <NeuButton
                                variant="outline"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => removeFromCart(item.productId)}
                                disabled={loading}
                                aria-label="Retirer du panier"
                              >
                                <Trash2 className="w-3 h-3" />
                              </NeuButton>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="space-y-3 pt-4 border-t border-border">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Sous-total HT</span>
                      <span className="font-medium">
                        {subtotal.toLocaleString("fr-FR")} {currency}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">TVA (18%)</span>
                      <span className="font-medium">
                        {taxAmount.toLocaleString("fr-FR")} {currency}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-lg sm:text-xl font-bold pt-2 border-t border-border">
                      <span>Total TTC</span>
                      <span>{total.toLocaleString("fr-FR")} {currency}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Mode de paiement</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {paymentMethods.map((method) => (
                        <NeuButton
                          key={method}
                          type="button"
                          variant={paymentMethod === method ? "premium" : "outline"}
                          size="sm"
                          onClick={() => setPaymentMethod(method)}
                          disabled={loading}
                          className="text-xs sm:text-sm"
                        >
                          {method === "Mobile Money" ? (
                            <>
                              <CreditCard className="w-3 h-3 mr-1" />
                              M.Money
                            </>
                          ) : (
                            method
                          )}
                        </NeuButton>
                      ))}
                    </div>
                  </div>

                  <NeuButton
                    type="button"
                    variant="premium"
                    className="w-full"
                    onClick={openConfirmDialog}
                    disabled={cart.length === 0 || loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Traitement...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4 mr-2" />
                        Encaisser {total.toLocaleString("fr-FR")} {currency}
                      </>
                    )}
                  </NeuButton>
                </>
              )}
            </div>
          </NeuCard>
        </div>
      </div>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmer l'encaissement</DialogTitle>
            <DialogDescription>
              Voulez-vous confirmer cette vente de {cart.length}{" "}
              {cart.length === 1 ? "article" : "articles"} ?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Détails de la transaction</p>
              <div className="neu-inset rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Sous-total</span>
                  <span>{subtotal.toLocaleString("fr-FR")} {currency}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">TVA (18%)</span>
                  <span>{taxAmount.toLocaleString("fr-FR")} {currency}</span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t border-border">
                  <span>Total</span>
                  <span>{total.toLocaleString("fr-FR")} {currency}</span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t border-border">
                  <span className="text-muted-foreground">Paiement</span>
                  <span className="font-medium">{paymentMethod}</span>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <NeuButton
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              Annuler
            </NeuButton>
            <NeuButton
              variant="premium"
              onClick={handleCheckout}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Encaissement...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Confirmer l'encaissement
                </>
              )}
            </NeuButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

