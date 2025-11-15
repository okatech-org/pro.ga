import { useState, useCallback } from "react";
import { NeuCard } from "@/components/ui/neu-card";
import { NeuButton } from "@/components/ui/neu-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
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
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Store, Plus, Edit2, Trash2, Image as ImageIcon, Upload } from "lucide-react";
import type { StoreProduct } from "@/types/domain";
import { toast } from "sonner";

type CatalogManagerProps = {
  products: StoreProduct[];
  onAdd?: (product: Omit<StoreProduct, "id" | "workspaceId" | "createdAt" | "updatedAt" | "status" | "featured"> & Partial<Pick<StoreProduct, "status" | "featured">>) => void;
  onUpdate?: (id: string, partial: Partial<StoreProduct>) => void;
  onDelete?: (id: string) => void;
};

const emptyProduct = {
  name: "",
  price: 0,
  currency: "XOF",
  description: "",
  stock: null,
  category: "",
  imageUrl: "",
  sku: "",
};

export const CatalogManager = ({
  products,
  onAdd,
  onUpdate,
  onDelete,
}: CatalogManagerProps) => {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState(emptyProduct);
  const [uploadingImage, setUploadingImage] = useState(false);

  const editingProduct = editingId ? products.find((p) => p.id === editingId) : null;

  const handleOpenAdd = useCallback(() => {
    setEditingId(null);
    setDraft(emptyProduct);
    setOpen(true);
  }, []);

  const handleOpenEdit = useCallback((product: StoreProduct) => {
    setEditingId(product.id);
    setDraft({
      name: product.name,
      price: product.price,
      currency: product.currency,
      description: product.description || "",
      stock: product.stock ?? null,
      category: product.category || "",
      imageUrl: product.imageUrl || "",
      sku: product.sku || "",
    });
    setOpen(true);
  }, []);

  const handleImageUpload = useCallback(async (file: File) => {
    setUploadingImage(true);
    try {
      const objectUrl = URL.createObjectURL(file);
      setDraft((prev) => ({ ...prev, imageUrl: objectUrl }));
      toast.success("Image ajoutée avec succès");
    } catch (error) {
      toast.error("Erreur lors de l'upload de l'image");
      console.error(error);
    } finally {
      setUploadingImage(false);
    }
  }, []);

  const handleSubmit = useCallback(() => {
    if (!draft.name.trim()) {
      toast.error("Le nom du produit est requis");
      return;
    }
    if (draft.price <= 0) {
      toast.error("Le prix doit être supérieur à 0");
      return;
    }

    const productData = {
      name: draft.name,
      price: draft.price,
      currency: draft.currency,
      description: draft.description || null,
      stock: draft.stock && draft.stock > 0 ? draft.stock : null,
      category: draft.category || null,
      imageUrl: draft.imageUrl || null,
      sku: draft.sku || null,
    };

    if (editingId) {
      onUpdate?.(editingId, productData);
      toast.success("Produit mis à jour avec succès");
    } else {
      onAdd?.(productData);
      toast.success("Produit ajouté avec succès");
    }
    setDraft(emptyProduct);
    setEditingId(null);
    setOpen(false);
  }, [draft, editingId, onAdd, onUpdate]);

  const handleDelete = useCallback((id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      onDelete?.(id);
      toast.success("Produit supprimé");
    }
  }, [onDelete]);

  const toggleStatus = useCallback((product: StoreProduct) => {
    const newStatus = product.status === "active" ? "archived" : "active";
    onUpdate?.(product.id, { status: newStatus });
    toast.success(`Produit ${newStatus === "active" ? "activé" : "archivé"}`);
  }, [onUpdate]);

  return (
    <div className="space-y-4">
      <NeuCard className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-1">Catalogue des produits</h2>
            <p className="text-sm text-muted-foreground">
              Gérez vos produits, prix, catégories et images
            </p>
          </div>
          <NeuButton onClick={handleOpenAdd} variant="premium" className="gap-2">
            <Plus className="w-4 h-4" />
            Nouveau produit
          </NeuButton>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <Store className="w-16 h-16 text-muted-foreground/40 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-2">Aucun produit</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Commencez par ajouter votre premier produit à la boutique
            </p>
            <NeuButton onClick={handleOpenAdd} variant="premium">
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un produit
            </NeuButton>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">Image</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Prix</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                          <ImageIcon className="w-5 h-5 text-muted-foreground" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-slate-900">{product.name}</p>
                        {product.description && (
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {product.description}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {product.category ? (
                        <Badge variant="outline">{product.category}</Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-slate-900">
                        {product.price.toLocaleString("fr-FR")} {product.currency}
                      </span>
                    </TableCell>
                    <TableCell>
                      {product.stock != null ? (
                        <span className={product.stock === 0 ? "text-destructive font-semibold" : ""}>
                          {product.stock}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">∞</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={product.status === "active" ? "default" : "secondary"}
                      >
                        {product.status === "active" ? "Actif" : "Archivé"}
                      </Badge>
                      {product.featured && (
                        <Badge variant="outline" className="ml-2">Featured</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <NeuButton
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenEdit(product)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </NeuButton>
                        <Switch
                          checked={product.status === "active"}
                          onCheckedChange={() => toggleStatus(product)}
                        />
                        <NeuButton
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </NeuButton>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </NeuCard>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg flex-shrink-0">
                <Store className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400 mb-1">Boutique</p>
                <h3 className="text-xl font-bold text-slate-900">
                  {editingId ? "Modifier le produit" : "Nouveau produit"}
                </h3>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom du produit *</Label>
                <Input
                  id="name"
                  placeholder="Ex: Robe wax"
                  value={draft.name}
                  onChange={(e) => setDraft((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sku">Référence (SKU)</Label>
                <Input
                  id="sku"
                  placeholder="Ex: RB-WAX-001"
                  value={draft.sku}
                  onChange={(e) => setDraft((prev) => ({ ...prev, sku: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Décrivez votre produit..."
                rows={3}
                value={draft.description}
                onChange={(e) => setDraft((prev) => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Prix *</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0"
                  value={draft.price || ""}
                  onChange={(e) => setDraft((prev) => ({ ...prev, price: Number(e.target.value) }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Devise</Label>
                <Input
                  id="currency"
                  placeholder="XOF"
                  value={draft.currency}
                  onChange={(e) => setDraft((prev) => ({ ...prev, currency: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  placeholder="Illimité"
                  value={draft.stock ?? ""}
                  onChange={(e) => setDraft((prev) => ({ ...prev, stock: e.target.value ? Number(e.target.value) : null }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Catégorie</Label>
              <Input
                id="category"
                placeholder="Ex: Vêtements, Accessoires"
                value={draft.category}
                onChange={(e) => setDraft((prev) => ({ ...prev, category: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Image du produit</Label>
              <div className="flex items-center gap-4">
                {draft.imageUrl && (
                  <img
                    src={draft.imageUrl}
                    alt="Preview"
                    className="w-24 h-24 object-cover rounded-lg border border-border"
                  />
                )}
                <div className="flex-1">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    disabled={uploadingImage}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleImageUpload(file);
                      }
                    }}
                    className="hidden"
                  />
                  <Label
                    htmlFor="image"
                    className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-accent"
                  >
                    <Upload className="w-4 h-4" />
                    {draft.imageUrl ? "Changer l'image" : "Ajouter une image"}
                  </Label>
                  {draft.imageUrl && (
                    <NeuButton
                      variant="outline"
                      size="sm"
                      className="ml-2"
                      onClick={() => setDraft((prev) => ({ ...prev, imageUrl: "" }))}
                    >
                      Supprimer
                    </NeuButton>
                  )}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <NeuButton variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </NeuButton>
            <NeuButton variant="premium" onClick={handleSubmit} disabled={uploadingImage}>
              {editingId ? "Mettre à jour" : "Ajouter"}
            </NeuButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};