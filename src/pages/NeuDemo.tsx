import { NeuCard, NeuCardContent, NeuCardDescription, NeuCardHeader, NeuCardTitle } from "@/components/ui/neu-card";
import { NeuButton } from "@/components/ui/neu-button";
import { Clock, TrendingUp, Book, Trophy } from "lucide-react";

export default function NeuDemo() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Design System Neomorphique</h1>
          <p className="text-muted-foreground">Découvrez les composants du design system</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <NeuCard>
            <NeuCardHeader>
              <div className="flex items-center justify-between">
                <NeuCardTitle className="text-lg">Total Study Hours</NeuCardTitle>
                <div className="icon-pill">
                  <Clock className="h-5 w-5 text-info" />
                </div>
              </div>
            </NeuCardHeader>
            <NeuCardContent>
              <div className="text-4xl font-bold mt-4">0.0</div>
            </NeuCardContent>
          </NeuCard>

          <NeuCard>
            <NeuCardHeader>
              <div className="flex items-center justify-between">
                <NeuCardTitle className="text-lg">Overall Progress</NeuCardTitle>
                <div className="icon-pill">
                  <TrendingUp className="h-5 w-5 text-success" />
                </div>
              </div>
            </NeuCardHeader>
            <NeuCardContent>
              <div className="text-4xl font-bold mt-4">0.0%</div>
            </NeuCardContent>
          </NeuCard>

          <NeuCard>
            <NeuCardHeader>
              <div className="flex items-center justify-between">
                <NeuCardTitle className="text-lg">Chapters Completed</NeuCardTitle>
                <div className="icon-pill">
                  <Book className="h-5 w-5 text-primary" />
                </div>
              </div>
            </NeuCardHeader>
            <NeuCardContent>
              <div className="text-4xl font-bold mt-4">0</div>
            </NeuCardContent>
          </NeuCard>

          <NeuCard>
            <NeuCardHeader>
              <div className="flex items-center justify-between">
                <NeuCardTitle className="text-lg">Tests Taken</NeuCardTitle>
                <div className="icon-pill">
                  <Trophy className="h-5 w-5 text-warning" />
                </div>
              </div>
            </NeuCardHeader>
            <NeuCardContent>
              <div className="text-4xl font-bold mt-4">0</div>
            </NeuCardContent>
          </NeuCard>
        </div>

        <NeuCard>
          <NeuCardHeader>
            <NeuCardTitle>Exemples de boutons</NeuCardTitle>
            <NeuCardDescription>Différents styles de boutons neomorphiques</NeuCardDescription>
          </NeuCardHeader>
          <NeuCardContent>
            <div className="flex flex-wrap gap-4 mt-6">
              <NeuButton variant="default">Bouton Standard</NeuButton>
              <NeuButton variant="admin">Espace Admin</NeuButton>
              <NeuButton variant="citizen">Espace Citoyen</NeuButton>
            </div>
          </NeuCardContent>
        </NeuCard>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <NeuCard variant="default">
            <NeuCardHeader>
              <NeuCardTitle>Carte Standard</NeuCardTitle>
              <NeuCardDescription>Effet neomorphique classique</NeuCardDescription>
            </NeuCardHeader>
            <NeuCardContent>
              <p className="mt-4 text-muted-foreground">Cette carte utilise l'effet neomorphique standard avec des ombres douces.</p>
            </NeuCardContent>
          </NeuCard>

          <NeuCard variant="sm">
            <NeuCardHeader>
              <NeuCardTitle>Carte Petite</NeuCardTitle>
              <NeuCardDescription>Ombres réduites</NeuCardDescription>
            </NeuCardHeader>
            <NeuCardContent>
              <p className="mt-4 text-muted-foreground">Variante avec des ombres plus petites pour un effet plus subtil.</p>
            </NeuCardContent>
          </NeuCard>

          <NeuCard variant="inset">
            <NeuCardHeader>
              <NeuCardTitle>Carte Inset</NeuCardTitle>
              <NeuCardDescription>Effet enfoncé</NeuCardDescription>
            </NeuCardHeader>
            <NeuCardContent>
              <p className="mt-4 text-muted-foreground">Cette carte semble enfoncée dans la surface.</p>
            </NeuCardContent>
          </NeuCard>
        </div>

        <NeuCard>
          <NeuCardHeader>
            <NeuCardTitle>Icônes en pilule</NeuCardTitle>
            <NeuCardDescription>Conteneurs circulaires avec effet neomorphique</NeuCardDescription>
          </NeuCardHeader>
          <NeuCardContent>
            <div className="flex gap-4 mt-6">
              <div className="icon-pill">
                <Clock className="h-5 w-5 text-info" />
              </div>
              <div className="icon-pill">
                <TrendingUp className="h-5 w-5 text-success" />
              </div>
              <div className="icon-pill">
                <Book className="h-5 w-5 text-primary" />
              </div>
              <div className="icon-pill">
                <Trophy className="h-5 w-5 text-warning" />
              </div>
            </div>
          </NeuCardContent>
        </NeuCard>
      </div>
    </div>
  );
}

