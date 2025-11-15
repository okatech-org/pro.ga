import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import type { StoreConfig } from "@/types/domain";

const schema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  city: z.string().optional(),
  address: z.string().optional(),
  description: z.string().optional(),
  published: z.boolean().default(false),
});

type WizardValues = z.infer<typeof schema>;

type StoreSetupWizardProps = {
  config: StoreConfig | null;
  onUpdate?: (values: Partial<StoreConfig>) => Promise<void> | void;
  onComplete?: (config: StoreConfig) => void;
  saving?: boolean;
};

const steps = [
  { id: "identity", label: "Identité" },
  { id: "localisation", label: "Localisation" },
  { id: "publication", label: "Publication" },
];

export const StoreSetupWizard = ({
  config,
  onUpdate,
  onComplete,
  saving,
}: StoreSetupWizardProps) => {
  const [stepIndex, setStepIndex] = useState(0);

  const defaultValues = useMemo(
    () => ({
      name: config?.name ?? "",
      slug: config?.slug ?? "",
      city: config?.city ?? "",
      address: config?.address ?? "",
      description: config?.description ?? "",
      published: config?.published ?? false,
    }),
    [config],
  );

  const form = useForm<WizardValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const progress = ((stepIndex + 1) / steps.length) * 100;

  const goNext = async () => {
    const valid = await form.trigger();
    if (!valid) return;

    const values = form.getValues();
    await onUpdate?.(values);

    if (stepIndex === steps.length - 1 && config) {
      onComplete?.({ ...config, ...values });
      return;
    }
    setStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const goBack = () => setStepIndex((prev) => Math.max(prev - 1, 0));

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Configuration boutique</CardTitle>
            <CardDescription>
              Renseignez les éléments essentiels avant de publier {config?.slug}.pro.ga
            </CardDescription>
          </div>
          <span className="text-sm text-muted-foreground">
            Étape {stepIndex + 1} / {steps.length}
          </span>
        </div>
        <Progress value={progress} />
      </CardHeader>
      <CardContent className="space-y-6">
        {stepIndex === 0 && (
          <div className="grid gap-4">
            <div>
              <Label>Nom de la boutique</Label>
              <Input {...form.register("name")} placeholder="Ex: Maison Kora" />
            </div>
            <div>
              <Label>Slug</Label>
              <Input {...form.register("slug")} placeholder="maison-kora" />
              <p className="text-xs text-muted-foreground mt-1">
                URL publique : https://{form.watch("slug") || "eshop"}.pro.ga
              </p>
            </div>
            <div>
              <Label>Description</Label>
              <Input {...form.register("description")} placeholder="Résumé public" />
            </div>
          </div>
        )}

        {stepIndex === 1 && (
          <div className="grid gap-4">
            <div>
              <Label>Ville</Label>
              <Input {...form.register("city")} placeholder="Dakar, Abidjan..." />
            </div>
            <div>
              <Label>Adresse</Label>
              <Input {...form.register("address")} placeholder="Rue, quartier, repère" />
            </div>
          </div>
        )}

        {stepIndex === 2 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-border p-4">
              <div>
                <p className="font-medium">Publier la boutique</p>
                <p className="text-sm text-muted-foreground">Rendre la boutique accessible</p>
              </div>
              <Switch checked={form.watch("published")} onCheckedChange={(checked) => form.setValue("published", checked)} />
            </div>
            <p className="text-sm text-muted-foreground">
              Vous pourrez ajuster vos produits et votre page d'accueil à tout moment.
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button type="button" variant="outline" onClick={goBack} disabled={stepIndex === 0}>
          Retour
        </Button>
        <Button type="button" onClick={goNext} disabled={saving}>
          {stepIndex === steps.length - 1 ? "Publier" : "Continuer"}
        </Button>
      </CardFooter>
    </Card>
  );
};

