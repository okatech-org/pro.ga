import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import type { StorePageContent } from "@/types/domain";

type StoreHomepageEditorProps = {
  page?: StorePageContent;
  content?: StorePageContent;
  onChange?: (content: StorePageContent) => void;
  onSave?: (page: StorePageContent) => void;
  saving?: boolean;
};

const defaultHighlight = { title: "", description: "" };

const defaultPage: StorePageContent = {
  heroTitle: "Votre boutique PRO.GA",
  heroSubtitle: "Présentez vos offres, encaissez et gérez vos commandes en quelques clics.",
  heroImage: null,
  highlights: [
    { title: "Paiements sécurisés", description: "Support mobile money et cartes Visa." },
    { title: "Stocks synchronisés", description: "Connecté à vos ventes POS." },
    { title: "Livraison locale", description: "Tarification dynamique par zone." },
  ],
  trustBadges: ["Paiement sécurisé", "Support 7/7", "Collecte TVA prête"],
};

export const StoreHomepageEditor = ({ page, content, onChange, onSave, saving }: StoreHomepageEditorProps) => {
  const pageContent = page || content || defaultPage;
  const [localContent, setLocalContent] = useState(pageContent);

  useEffect(() => {
    if (page || content) {
      setLocalContent(page || content || defaultPage);
    }
  }, [page, content]);

  const update = (partial: Partial<StorePageContent>) => {
    const next = { ...localContent, ...partial };
    setLocalContent(next);
    onChange?.(next);
    onSave?.(next);
  };

  const updateHighlight = (index: number, field: "title" | "description", value: string) => {
    const nextHighlights = [...localContent.highlights];
    nextHighlights[index] = { ...nextHighlights[index], [field]: value };
    update({ highlights: nextHighlights });
  };

  const addHighlight = () => {
    update({ highlights: [...localContent.highlights, defaultHighlight] });
  };

  const removeHighlight = (index: number) => {
    update({ highlights: localContent.highlights.filter((_, i) => i !== index) });
  };

  const addBadge = () => {
    update({ trustBadges: [...localContent.trustBadges, "Nouvelle preuve"] });
  };

  const updateBadge = (index: number, value: string) => {
    const nextBadges = [...localContent.trustBadges];
    nextBadges[index] = value;
    update({ trustBadges: nextBadges });
  };

  const removeBadge = (index: number) => {
    update({ trustBadges: localContent.trustBadges.filter((_, i) => i !== index) });
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Page d'accueil</CardTitle>
        <CardDescription>Hero, promesses et éléments de preuve sociale.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          <div>
            <Label>Titre hero</Label>
            <Input
              value={localContent.heroTitle}
              onChange={(event) => update({ heroTitle: event.target.value })}
            />
          </div>
          <div>
            <Label>Sous-titre</Label>
            <Textarea
              value={localContent.heroSubtitle}
              onChange={(event) => update({ heroSubtitle: event.target.value })}
            />
          </div>
          <div>
            <Label>Image hero (URL)</Label>
            <Input
              value={localContent.heroImage ?? ""}
              onChange={(event) => update({ heroImage: event.target.value })}
              placeholder="https://..."
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="font-medium">Points forts</p>
              <p className="text-sm text-muted-foreground">3 promesses max recommandées</p>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addHighlight}>
              Ajouter
            </Button>
          </div>
          <div className="space-y-4">
            {localContent.highlights.map((highlight, index) => (
              <div key={index} className="rounded-xl border border-border p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">Point #{index + 1}</p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeHighlight(index)}
                  >
                    Supprimer
                  </Button>
                </div>
                <Input
                  value={highlight.title}
                  placeholder="Titre"
                  onChange={(event) => updateHighlight(index, "title", event.target.value)}
                />
                <Textarea
                  value={highlight.description}
                  placeholder="Description"
                  onChange={(event) => updateHighlight(index, "description", event.target.value)}
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="font-medium">Badges de confiance</p>
              <p className="text-sm text-muted-foreground">Affichés sous la zone hero</p>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addBadge}>
              Ajouter
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {localContent.trustBadges.map((badge, index) => (
              <Badge key={index} variant="secondary" className="gap-2">
                <input
                  className="bg-transparent border-none focus:outline-none text-xs"
                  value={badge}
                  onChange={(event) => updateBadge(index, event.target.value)}
                />
                <button
                  type="button"
                  onClick={() => removeBadge(index)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
        </div>

        {saving && <p className="text-sm text-muted-foreground">Enregistrement...</p>}
      </CardContent>
    </Card>
  );
};

