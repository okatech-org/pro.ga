# 🎨 Guide du Design System Neomorphique

Ce projet utilise un design system neomorphique complet inspiré des maquettes ADMIN.GA.

## 📁 Structure des fichiers

### Fichiers CSS principaux

- **`src/index.css`** : Point d'entrée qui importe tous les styles
- **`src/assets/asted-design-core.css`** : Variables CSS et styles de base
- **`src/assets/asted-design-components.css`** : Composants neomorphiques (cartes, boutons, inputs, etc.)
- **`src/assets/asted-design-utilities.css`** : Classes utilitaires
- **`src/assets/proga-brand-colors.css`** : Personnalisation des couleurs PRO.GA

### Composants React

#### Composants de base
- **`NeuCard`** : Cartes neomorphiques avec variantes (default, sm, inset, raised)
- **`NeuButton`** : Boutons neomorphiques avec variantes (default, admin, citizen)
- **`NeuIconPill`** : Icônes circulaires colorées avec effet neomorphique
- **`NeuStatCard`** : Cartes de statistiques avec icône et valeur
- **`NeuProfileCard`** : Cartes de profils avec attributions

## 🎯 Classes CSS principales

### Cartes

```tsx
// Carte standard élevée
<div className="asted-card">...</div>

// Carte plus petite
<div className="asted-card-sm">...</div>

// Carte enfoncée (inset)
<div className="asted-card-inset">...</div>

// Carte avec hover effect
<div className="asted-card asted-card-hover">...</div>

// Carte pressée (enfoncée)
<div className="asted-card-pressed">...</div>
```

### Boutons

```tsx
// Bouton neomorphique standard
<button className="asted-button">Cliquez</button>

// Variantes de couleur
<button className="asted-button asted-button-primary">Primary</button>
<button className="asted-button asted-button-success">Success</button>
<button className="asted-button asted-button-warning">Warning</button>
<button className="asted-button asted-button-danger">Danger</button>

// Bouton ghost (sans relief)
<button className="asted-button asted-button-ghost">Ghost</button>

// Tailles
<button className="asted-button asted-button-sm">Small</button>
<button className="asted-button asted-button-lg">Large</button>
```

### Inputs

```tsx
// Input neomorphique
<input className="asted-input" />

// Input avec erreur
<input className="asted-input asted-input-error" />

// Label
<label className="asted-label">Mon label</label>

// Textarea
<textarea className="asted-textarea"></textarea>

// Select
<select className="asted-select">...</select>
```

### Icônes et Pills

```tsx
// Icône circulaire
<div className="asted-pill-icon">
  <Icon className="w-5 h-5" />
</div>

// Tailles de pills
<div className="asted-pill-icon asted-pill-icon-sm">...</div>
<div className="asted-pill-icon asted-pill-icon-lg">...</div>
```

### Navigation

```tsx
// Barre de navigation
<nav className="asted-nav">
  <button className="asted-nav-item">Item 1</button>
  <button className="asted-nav-item active">Item 2</button>
</nav>
```

### Badges

```tsx
<span className="asted-badge">Badge</span>
<span className="asted-badge asted-badge-primary">Primary</span>
<span className="asted-badge asted-badge-success">Success</span>
```

### Progress Bar

```tsx
<div className="asted-progress">
  <div className="asted-progress-bar" style={{ width: '60%' }}></div>
</div>
```

## ⚛️ Composants React

### NeuCard

```tsx
import { NeuCard, NeuCardHeader, NeuCardTitle, NeuCardContent } from "@/components/ui";

<NeuCard variant="default">
  <NeuCardHeader>
    <NeuCardTitle>Titre</NeuCardTitle>
  </NeuCardHeader>
  <NeuCardContent>
    Contenu
  </NeuCardContent>
</NeuCard>

// Variantes
<NeuCard variant="sm">...</NeuCard>      // Petite
<NeuCard variant="inset">...</NeuCard>   // Enfoncée
<NeuCard variant="raised">...</NeuCard>  // Surélevée ronde
```

### NeuButton

```tsx
import { NeuButton } from "@/components/ui";

<NeuButton variant="default">Standard</NeuButton>
<NeuButton variant="admin">Admin (Bleu)</NeuButton>
<NeuButton variant="citizen">Citoyen (Vert)</NeuButton>
```

### NeuIconPill

```tsx
import { NeuIconPill } from "@/components/ui";
import { Users } from "lucide-react";

<NeuIconPill 
  icon={Users} 
  color="primary"    // primary, success, warning, info, danger
  size="md"          // sm, md, lg, xl
/>
```

### NeuStatCard

```tsx
import { NeuStatCard } from "@/components/ui";
import { Users } from "lucide-react";

<NeuStatCard
  title="Total Agents"
  value="92 000+"
  subtitle="Fonctionnaires et contractuels"
  icon={Users}
  iconColor="success"
/>
```

### NeuProfileCard

```tsx
import { NeuProfileCard } from "@/components/ui";
import { Crown } from "lucide-react";

<NeuProfileCard
  title="Ministre de la Fonction Publique"
  subtitle="MINISTRE"
  description="Autorité politique suprême du ministère"
  icon={Crown}
  iconColor="primary"
  attributions={[
    "Vision stratégique",
    "Validation des réformes",
    "Arbitrage des décisions"
  ]}
/>
```

## 🎨 Palette de couleurs

### Couleurs principales

- **Primary (Vert)** : `hsl(142 69% 26%)` - Couleur principale inspirée du drapeau gabonais
- **Secondary (Bleu)** : `hsl(214 84% 56%)` - Pour les actions admin/autorité
- **Accent (Jaune)** : `hsl(47 96% 53%)` - Accents et highlights

### Couleurs sémantiques

- **Success** : `hsl(142 69% 26%)` - Vert pour succès
- **Warning** : `hsl(38 92% 50%)` - Orange pour alertes
- **Destructive** : `hsl(0 84% 60%)` - Rouge pour erreurs
- **Info** : `hsl(214 84% 56%)` - Bleu pour informations

### Mode sombre

Le système bascule automatiquement en mode sombre avec la classe `.dark` sur l'élément racine.

```tsx
// Utiliser le ThemeToggle component
import { ThemeToggle } from "@/components/ThemeToggle";

<ThemeToggle />
```

## 🚀 Pages de démonstration

### Routes disponibles

- **`/admin-ga-landing`** : Landing page ADMIN.GA
- **`/admin-ga-demo`** : Démonstration complète du design ADMIN.GA
- **`/neu-demo`** : Showcase des composants neomorphiques
- **`/dashboard`** : Dashboard FormForge (exemple original)

### Accéder aux démos

```bash
# Lancer le serveur de développement
npm run dev

# Puis visiter :
# http://localhost:5173/admin-ga-landing
# http://localhost:5173/admin-ga-demo
# http://localhost:5173/neu-demo
```

## 📐 Principes du design neomorphique

### Ombres

Le neomorphisme utilise deux ombres opposées pour créer un effet 3D :

```css
/* Effet surélevé */
box-shadow: 
  8px 8px 16px hsl(var(--shadow-dark)),
  -8px -8px 16px hsl(var(--shadow-light));

/* Effet enfoncé (inset) */
box-shadow: 
  inset 6px 6px 12px hsl(var(--shadow-dark)),
  inset -6px -6px 12px hsl(var(--shadow-light));
```

### Background

Le background doit être uniforme pour que l'effet neomorphique fonctionne :

```css
background: hsl(var(--background));
```

### Bordures

Évitez les bordures classiques. Utilisez plutôt les ombres pour créer la séparation.

```css
border: none;
```

## 🎯 Best Practices

1. **Utilisez les composants React** plutôt que les classes CSS directement
2. **Respectez la hiérarchie visuelle** : cartes surélevées pour le contenu principal, inset pour les inputs
3. **Mode sombre** : Toujours tester vos interfaces en mode clair ET sombre
4. **Accessibilité** : Les boutons ont une taille minimale de 44x44px
5. **Responsive** : Le design s'adapte automatiquement aux mobiles

## 🔧 Variables CSS personnalisables

Vous pouvez personnaliser le design en modifiant les variables dans `src/assets/proga-brand-colors.css` :

```css
:root {
  --asted-primary-500: #votre-couleur;
  --asted-bg-base: #votre-background;
  /* etc. */
}
```

## 📚 Ressources

- **Maquettes de référence** : Voir les images fournies (ADMIN.GA)
- **Lucide Icons** : https://lucide.dev
- **Tailwind CSS** : https://tailwindcss.com

---

**Créé avec ❤️ pour PRO.GA / ADMIN.GA**

