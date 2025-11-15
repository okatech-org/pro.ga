import { useState } from "react";
import { useParams } from "react-router-dom";
import { useStorePublic } from "@/hooks/useStorePublic";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ShoppingCart, Minus, Plus, X, Filter } from "lucide-react";
import type { StoreProduct } from "@/types/domain";

export default function PublicStorePage() {
  const { slug } = useParams<{ slug: string }>();
  const { config, products, loading, error } = useStorePublic(slug || "");
  const { items, addItem, removeItem, updateQuantity, clearCart, total, itemCount } = useCart();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const categories = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));
  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category === selectedCategory)
    : products;

  const handleAddToCart = (product: StoreProduct) => {
    addItem(product);
    toast({
      title: "Ajouté au panier",
      description: `${product.name} a été ajouté à votre panier`,
    });
  };

  const handleSubmitOrder = async () => {
    if (!customerName || !customerEmail) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez remplir votre nom et email",
        variant: "destructive",
      });
      return;
    }

    if (items.length === 0) {
      toast({
        title: "Panier vide",
        description: "Ajoutez des produits avant de commander",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      const { error } = await supabase.from("store_orders").insert({
        workspace_id: config?.workspaceId,
        store_slug: slug,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone || null,
        items: items.map((item) => ({
          productId: item.product.id,
          name: item.product.name,
          quantity: item.quantity,
          unitPrice: item.product.price,
        })),
        total,
        currency: items[0]?.product.currency || "XAF",
        status: "pending",
      });

      if (error) throw error;

      toast({
        title: "Commande envoyée",
        description: "Votre commande a été envoyée avec succès. Nous vous contactons bientôt.",
      });

      clearCart();
      setCustomerName("");
      setCustomerEmail("");
      setCustomerPhone("");
    } catch (err) {
      console.error(err);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer la commande",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Chargement de la boutique...</p>
      </div>
    );
  }

  if (error || !config) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-destructive">{error || "Boutique introuvable"}</p>
      </div>
    );
  }

  const theme = config.theme;
  const page = config.page;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: theme.primaryColor }}>
              {config.name}
            </h1>
            {config.city && <p className="text-sm text-muted-foreground">{config.city}</p>}
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <Badge
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0"
                    style={{ backgroundColor: theme.accentColor }}
                  >
                    {itemCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Panier ({itemCount} articles)</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                {items.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">Votre panier est vide</p>
                ) : (
                  <>
                    {items.map((item) => (
                      <Card key={item.product.id}>
                        <CardContent className="p-4">
                          <div className="flex gap-4">
                            {item.product.imageUrl && (
                              <img
                                src={item.product.imageUrl}
                                alt={item.product.name}
                                className="w-20 h-20 object-cover rounded"
                              />
                            )}
                            <div className="flex-1">
                              <h4 className="font-medium">{item.product.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {item.product.price.toLocaleString()} {item.product.currency}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <Button
                                  size="icon"
                                  variant="outline"
                                  className="h-8 w-8"
                                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <span className="w-8 text-center">{item.quantity}</span>
                                <Button
                                  size="icon"
                                  variant="outline"
                                  className="h-8 w-8"
                                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8 ml-auto"
                                  onClick={() => removeItem(item.product.id)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    <Separator />
                    <div className="space-y-2 text-lg font-semibold">
                      <div className="flex justify-between">
                        <span>Total</span>
                        <span>
                          {total.toLocaleString()} {items[0]?.product.currency}
                        </span>
                      </div>
                    </div>
                    <Separator />
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Nom complet *</Label>
                        <Input
                          id="name"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="Votre nom"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          placeholder="votre@email.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Téléphone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          placeholder="+237 6XX XXX XXX"
                        />
                      </div>
                      <Button
                        className="w-full"
                        style={{ backgroundColor: theme.primaryColor }}
                        onClick={handleSubmitOrder}
                        disabled={submitting}
                      >
                        {submitting ? "Envoi..." : "Commander"}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Hero Section */}
      {page.heroTitle && (
        <section
          className="py-20 text-center"
          style={{
            background: `linear-gradient(135deg, ${theme.primaryColor}22, ${theme.accentColor}22)`,
          }}
        >
          <div className="container mx-auto px-4">
            <h2 className="text-4xl md:text-6xl font-bold mb-4" style={{ color: theme.primaryColor }}>
              {page.heroTitle}
            </h2>
            {page.heroSubtitle && (
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{page.heroSubtitle}</p>
            )}
          </div>
        </section>
      )}

      {/* Filters */}
      {categories.length > 0 && (
        <section className="border-b bg-muted/50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-2 overflow-x-auto">
              <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <Button
                variant={selectedCategory === null ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
              >
                Tout
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Products Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {filteredProducts.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">Aucun produit disponible</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader className="p-0">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-64 object-cover"
                      />
                    ) : (
                      <div className="w-full h-64 bg-muted flex items-center justify-center">
                        <span className="text-muted-foreground">Pas d'image</span>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{product.name}</h3>
                      {product.featured && (
                        <Badge variant="secondary" className="flex-shrink-0">
                          ⭐
                        </Badge>
                      )}
                    </div>
                    {product.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {product.description}
                      </p>
                    )}
                    <p className="text-xl font-bold" style={{ color: theme.primaryColor }}>
                      {product.price.toLocaleString()} {product.currency}
                    </p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button
                      className="w-full"
                      style={{ backgroundColor: theme.accentColor }}
                      onClick={() => handleAddToCart(product)}
                    >
                      Ajouter au panier
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/50 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} {config.name}. Propulsé par PRO.GA</p>
          {config.address && <p className="mt-2">{config.address}</p>}
        </div>
      </footer>
    </div>
  );
}
