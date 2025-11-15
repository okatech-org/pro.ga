import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Store } from "lucide-react";
import type { StoreProduct } from "@/types/domain";

type CatalogManagerProps = {
  products: StoreProduct[];
  onAdd?: (product: Omit<StoreProduct, "id" | "workspaceId" | "createdAt" | "updatedAt" | "status" | "featured"> & Partial<Pick<StoreProduct, "status" | "featured">>) => void;
  onEdit?: (id: string, partial: Partial<StoreProduct>) => void;
  onDelete?: (id: string) => void;
  onToggle?: (id: string) => void;
};

const emptyProduct = {
  name: "",
  price: 0,
  currency: "XOF",
  description: "",
  stock: 0,
  category: "",
};

export const CatalogManager = ({
  products,
  onAdd,
  onEdit,
  onDelete,
  onToggle,
}: CatalogManagerProps) => {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(emptyProduct);

  const handleSubmit = () => {
    onAdd?.({
      name: draft.name,
      price: draft.price,
      currency: draft.currency,
      description: draft.description,
      stock: draft.stock,
      category: draft.category,
    });
    setDraft(emptyProduct);
    setOpen(false);
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Catalogue</CardTitle>
          <CardDescription>Produits visibles dans {products.length > 0 ? "votre boutique" : "l'accueil"}.</CardDescription>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button type="button">Nouveau produit</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <div className="flex items-center gap-4 flex-1 mb-2">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg flex-shrink-0">
                  <Store className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400 mb-2">Boutique</p>
                  <DialogTitle>Ajouter un produit</DialogTitle>
                </div>
              </div>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Nom"
                value={draft.name}
                onChange={(event) => setDraft((prev) => ({ ...prev, name: event.target.value }))}
              />
              <Textarea
                placeholder="Description"
                value={draft.description}
                onChange={(event) => setDraft((prev) => ({ ...prev, description: event.target.value }))}
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="number"
                  placeholder="Prix"
                  value={draft.price}
                  onChange={(event) => setDraft((prev) => ({ ...prev, price: Number(event.target.value) }))}
                />
                <Input
                  placeholder="Devise"
                  value={draft.currency}
                  onChange={(event) => setDraft((prev) => ({ ...prev, currency: event.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="number"
                  placeholder="Stock"
                  value={draft.stock}
                  onChange={(event) => setDraft((prev) => ({ ...prev, stock: Number(event.target.value) }))}
                />
                <Input
                  placeholder="Catégorie"
                  value={draft.category}
                  onChange={(event) => setDraft((prev) => ({ ...prev, category: event.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" onClick={handleSubmit}>
                Ajouter
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {products.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Aucun produit pour le moment. Ajoutez-en pour alimenter la boutique publique et le POS.
          </p>
        ) : (
          <Table>
            <TableCaption>Inventaire synchronisé avec le POS.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Produit</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Prix</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>État</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.description}</p>
                  </TableCell>
                  <TableCell>{product.category || "-"}</TableCell>
                  <TableCell>
                    {product.price.toLocaleString("fr-FR")} {product.currency}
                  </TableCell>
                  <TableCell>{product.stock ?? "∞"}</TableCell>
                  <TableCell>
                    <Badge variant={product.status === "active" ? "default" : "secondary"}>
                      {product.status === "active" ? "Actif" : "Archivé"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => onDelete?.(product.id)}>
                      Supprimer
                    </Button>
                    <Switch
                      checked={product.status === "active"}
                      onCheckedChange={() => onToggle?.(product.id)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

