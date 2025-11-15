# 📱 Analyse des Patterns Responsive - Page Taxes

Ce document analyse en détail les patterns responsive utilisés dans la page Taxes (`src/pages/TaxesPage.tsx`) pour servir de référence pour l'implémentation des autres pages.

## 🏗️ Structure Générale

### Architecture de Layout

```tsx
<SidebarProvider>
  <div className="flex min-h-screen bg-background">
    <DashboardSidebar />
    <SidebarInset className="flex-1 bg-background pl-2 sm:pl-4 lg:pl-6">
      {/* Contenu principal */}
    </SidebarInset>
  </div>
</SidebarProvider>
```

**Points clés :**
- `SidebarProvider` : Enveloppe toute la page
- `flex min-h-screen` : Layout flex vertical sur toute la hauteur
- `SidebarInset` : Zone de contenu principal avec padding gauche adaptatif
- Padding gauche sidebar : `pl-2` (mobile) → `sm:pl-4` (tablette) → `lg:pl-6` (desktop)

---

## 📐 Breakpoints Tailwind Utilisés

| Breakpoint | Valeur | Usage |
|------------|--------|-------|
| **Base** | 0px+ | Mobile (par défaut) |
| **sm:** | 640px+ | Tablette portrait / Grand mobile |
| **lg:** | 1024px+ | Desktop / Tablette landscape |
| **xl:** | 1280px+ | Grand desktop |

---

## 🎨 Patterns Responsive par Élément

### 1. HEADER - En-tête Principal

#### Structure du Header

```tsx
<header className="px-3 sm:px-4 lg:px-6 xl:px-8 pt-4 sm:pt-6 lg:pt-8">
  <NeuCard className="p-4 sm:p-6 lg:p-8">
    {/* Contenu */}
  </NeuCard>
</header>
```

#### Padding Horizontal (px)
- **Mobile** : `px-3` (12px)
- **Tablette** : `sm:px-4` (16px)
- **Desktop** : `lg:px-6` (24px)
- **Grand Desktop** : `xl:px-8` (32px)

#### Padding Vertical (pt)
- **Mobile** : `pt-4` (16px)
- **Tablette** : `sm:pt-6` (24px)
- **Desktop** : `lg:pt-8` (32px)

#### Padding Card Interne (p)
- **Mobile** : `p-4` (16px)
- **Tablette** : `sm:p-6` (24px)
- **Desktop** : `lg:p-8` (32px)

#### Layout du Header (flex)

```tsx
<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 lg:gap-6">
```

- **Direction** : `flex-col` (mobile) → `sm:flex-row` (tablette+)
- **Alignement** : `items-start` (mobile) → `sm:items-center` (tablette+)
- **Espacement** : `gap-3` (12px) → `sm:gap-4` (16px) → `lg:gap-6` (24px)

---

### 2. ICÔNE DE TITRE

```tsx
<div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 rounded-2xl ...">
  <Calculator className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" />
</div>
```

#### Tailles d'icône conteneur
- **Mobile** : `w-10 h-10` (40px)
- **Tablette** : `sm:w-12 sm:h-12` (48px)
- **Desktop** : `lg:w-16 lg:h-16` (64px)

#### Tailles d'icône interne
- **Mobile** : `w-5 h-5` (20px)
- **Tablette** : `sm:w-6 sm:h-6` (24px)
- **Desktop** : `lg:w-8 lg:h-8` (32px)

**Ratio constant** : L'icône interne fait toujours la moitié de la taille du conteneur.

---

### 3. TYPOGRAPHIE RESPONSIVE

#### Titre Principal (h1)

```tsx
<h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-slate-900 mb-0.5 sm:mb-1 truncate">
```

- **Mobile** : `text-lg` (18px)
- **Tablette** : `sm:text-xl` (20px)
- **Desktop** : `lg:text-2xl` (24px)
- **Grand Desktop** : `xl:text-3xl` (30px)
- **Margin bottom** : `mb-0.5` (2px) → `sm:mb-1` (4px)

#### Sous-titre / Label

```tsx
<p className="text-[9px] sm:text-[10px] lg:text-xs uppercase tracking-[0.3em] text-slate-400 mb-0.5 sm:mb-1 lg:mb-2 truncate">
```

- **Mobile** : `text-[9px]` (9px) - taille personnalisée
- **Tablette** : `sm:text-[10px]` (10px)
- **Desktop** : `lg:text-xs` (12px)
- **Margin bottom** : `mb-0.5` → `sm:mb-1` → `lg:mb-2`

#### Description

```tsx
<p className="text-[10px] sm:text-xs lg:text-sm text-slate-500 line-clamp-2">
```

- **Mobile** : `text-[10px]` (10px)
- **Tablette** : `sm:text-xs` (12px)
- **Desktop** : `lg:text-sm` (14px)
- **Gestion overflow** : `line-clamp-2` (max 2 lignes)

---

### 4. BOUTONS RESPONSIVE

```tsx
<NeuButton
  className="flex-1 sm:flex-none text-[11px] sm:text-xs lg:text-sm"
  aria-label="..."
>
  <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 flex-shrink-0" />
  <span className="truncate">Retour</span>
</NeuButton>
```

#### Largeur de bouton
- **Mobile** : `flex-1` (pleine largeur dans le conteneur)
- **Tablette+** : `sm:flex-none` (largeur automatique)

#### Taille de texte
- **Mobile** : `text-[11px]` (11px)
- **Tablette** : `sm:text-xs` (12px)
- **Desktop** : `lg:text-sm` (14px)

#### Icône dans bouton
- **Taille** : `w-3 h-3` (12px) → `sm:w-4 sm:h-4` (16px)
- **Margin right** : `mr-1.5` (6px) → `sm:mr-2` (8px)
- **Flex shrink** : `flex-shrink-0` (empêche le rétrécissement)

#### Conteneur de boutons

```tsx
<div className="flex gap-2 flex-shrink-0 w-full sm:w-auto">
```

- **Mobile** : `w-full` (pleine largeur) - boutons empilés
- **Tablette+** : `sm:w-auto` (largeur automatique) - boutons côte à côte
- **Gap** : `gap-2` (8px) constant

---

### 5. MESSAGES D'ERREUR/SUCCÈS

```tsx
<div className="mt-4 neu-inset rounded-xl p-3 sm:p-4 bg-red-50 border border-red-200 flex items-start gap-2 sm:gap-3">
  <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 flex-shrink-0 mt-0.5" />
  <div className="flex-1 min-w-0">
    <p className="text-xs sm:text-sm font-medium text-red-900 mb-0.5 sm:mb-1">Erreur</p>
    <p className="text-[10px] sm:text-xs text-red-700 break-words">{error}</p>
  </div>
  <button className="text-red-600 hover:text-red-800 flex-shrink-0 text-lg sm:text-xl leading-none">×</button>
</div>
```

#### Padding
- **Mobile** : `p-3` (12px)
- **Tablette+** : `sm:p-4` (16px)

#### Espacement interne
- **Mobile** : `gap-2` (8px)
- **Tablette+** : `sm:gap-3` (12px)

#### Taille d'icône
- **Mobile** : `w-4 h-4` (16px)
- **Tablette+** : `sm:w-5 sm:h-5` (20px)

#### Typographie
- **Titre** : `text-xs` → `sm:text-sm`
- **Message** : `text-[10px]` → `sm:text-xs`
- **Break words** : `break-words` pour éviter les débordements

#### Bouton de fermeture
- **Taille** : `text-lg` → `sm:text-xl` (18px → 20px)
- **Leading** : `leading-none` (pas d'espacement vertical)

---

### 6. MAIN CONTENT AREA

```tsx
<main className="px-3 sm:px-4 lg:px-6 xl:px-8 pt-3 sm:pt-4 lg:pt-6 pb-6 sm:pb-8 lg:pb-10 space-y-3 sm:space-y-4 lg:space-y-6 max-w-7xl mx-auto w-full">
```

#### Padding Horizontal (px)
- **Mobile** : `px-3` (12px)
- **Tablette** : `sm:px-4` (16px)
- **Desktop** : `lg:px-6` (24px)
- **Grand Desktop** : `xl:px-8` (32px)

#### Padding Vertical
- **Top** : `pt-3` → `sm:pt-4` → `lg:pt-6` (12px → 16px → 24px)
- **Bottom** : `pb-6` → `sm:pb-8` → `lg:pb-10` (24px → 32px → 40px)

#### Espacement Vertical (space-y)
- **Mobile** : `space-y-3` (12px entre enfants)
- **Tablette** : `sm:space-y-4` (16px)
- **Desktop** : `lg:space-y-6` (24px)

#### Conteneur Max Width
- `max-w-7xl` : Largeur max 80rem (1280px)
- `mx-auto` : Centrage horizontal
- `w-full` : Largeur 100% jusqu'au max-width

---

### 7. GRILLE PRINCIPALE (2 Colonnes)

```tsx
<div className="grid lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
```

#### Colonnes
- **Mobile/Tablette** : 1 colonne (par défaut)
- **Desktop** : `lg:grid-cols-2` (2 colonnes à partir de 1024px)

#### Gap (espacement entre colonnes)
- **Mobile** : `gap-3` (12px)
- **Tablette** : `sm:gap-4` (16px)
- **Desktop** : `lg:gap-6` (24px)

**Pattern :** Mobile empilé (1 colonne), Desktop côte à côte (2 colonnes).

---

### 8. CARTES (NeuCard)

```tsx
<NeuCard className="p-4 sm:p-6">
```

#### Padding interne
- **Mobile** : `p-4` (16px)
- **Tablette+** : `sm:p-6` (24px)

#### Sections dans la carte

```tsx
<div className="mb-4 sm:mb-6">
  <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-1">Titre</h2>
  <p className="text-xs sm:text-sm text-muted-foreground">Description</p>
</div>
```

#### Margin bottom section
- **Mobile** : `mb-4` (16px)
- **Tablette+** : `sm:mb-6` (24px)

#### Titre section (h2)
- **Mobile** : `text-lg` (18px)
- **Tablette+** : `sm:text-xl` (20px)

---

### 9. FORMULAIRES - Inputs et Labels

#### Label

```tsx
<Label htmlFor="..." className="text-xs sm:text-sm">
  Collectée (FCFA)
</Label>
```

- **Mobile** : `text-xs` (12px)
- **Tablette+** : `sm:text-sm` (14px)

#### Input

```tsx
<Input
  className="text-xs sm:text-sm"
  disabled={saving || loading}
  aria-label="..."
/>
```

- **Taille de texte** : `text-xs` → `sm:text-sm`
- Toujours désactivable
- Toujours avec `aria-label`

#### Espacement Label/Input

```tsx
<div className="space-y-1.5">
  <Label>...</Label>
  <Input>...</Input>
</div>
```

- `space-y-1.5` : 6px d'espacement vertical constant

---

### 10. GRILLES DE CHAMPS (2 Colonnes)

```tsx
<div className="grid grid-cols-2 gap-3">
  <div className="space-y-1.5">
    <Label>...</Label>
    <Input>...</Input>
  </div>
  <div className="space-y-1.5">
    <Label>...</Label>
    <Input>...</Input>
  </div>
</div>
```

- **Colonnes** : `grid-cols-2` (2 colonnes constantes)
- **Gap** : `gap-3` (12px constant)

**Note** : Les champs sont toujours en 2 colonnes, même sur mobile, car ils sont généralement courts.

---

### 11. SECTIONS AVEC SEPARATEUR

```tsx
<div className="space-y-3 pt-4 border-t border-border">
  <h3 className="text-sm sm:text-base font-semibold text-slate-900">TVA</h3>
  {/* Contenu */}
</div>
```

#### Padding top
- `pt-4` : 16px (constant)

#### Border top
- `border-t border-border` : Bordure supérieure de séparation

#### Espacement interne
- `space-y-3` : 12px entre éléments enfants

#### Titre section (h3)
- **Mobile** : `text-sm` (14px)
- **Tablette+** : `sm:text-base` (16px)

---

### 12. TAX SIMULATION PANEL

```tsx
<NeuCard className="p-4 sm:p-6">
  <div className="mb-4 sm:mb-6">
    <div className="flex items-center gap-2 sm:gap-3 mb-2">
      <Calculator className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
      <h2 className="text-lg sm:text-xl font-bold text-slate-900">Simulations fiscales</h2>
    </div>
    <p className="text-xs sm:text-sm text-muted-foreground">Description</p>
  </div>

  <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
    {/* TaxCards */}
  </div>
</NeuCard>
```

#### Grille des TaxCards
- **Mobile** : 1 colonne
- **Tablette+** : `sm:grid-cols-2` (2 colonnes)

#### Gap
- **Mobile** : `gap-3` (12px)
- **Tablette+** : `sm:gap-4` (16px)

---

## 🎯 Patterns Clés à Retenir

### 1. Mobile-First Approach

Toujours définir les styles de base (mobile), puis ajouter les variantes pour les écrans plus grands :

```tsx
// ❌ Mauvais (Desktop-first)
className="text-xl lg:text-lg"

// ✅ Bon (Mobile-first)
className="text-lg lg:text-xl"
```

### 2. Tailles de Texte Progressive

**Règle générale :** Augmenter de 2px par breakpoint

| Élément | Mobile | Tablette | Desktop | Grand Desktop |
|---------|--------|----------|---------|---------------|
| Titre principal (h1) | `text-lg` (18px) | `sm:text-xl` (20px) | `lg:text-2xl` (24px) | `xl:text-3xl` (30px) |
| Sous-titre (h2) | `text-base` (16px) | `sm:text-lg` (18px) | `lg:text-xl` (20px) | - |
| Texte normal | `text-xs` (12px) | `sm:text-sm` (14px) | `lg:text-base` (16px) | - |
| Petit texte | `text-[10px]` | `sm:text-xs` (12px) | `lg:text-sm` (14px) | - |

### 3. Padding Progressive

**Règle générale :** Multiplier par 1.5 à chaque breakpoint

| Zone | Mobile | Tablette | Desktop | Grand Desktop |
|------|--------|----------|---------|---------------|
| Header px | `px-3` (12px) | `sm:px-4` (16px) | `lg:px-6` (24px) | `xl:px-8` (32px) |
| Header pt | `pt-4` (16px) | `sm:pt-6` (24px) | `lg:pt-8` (32px) | - |
| Main px | `px-3` (12px) | `sm:px-4` (16px) | `lg:px-6` (24px) | `xl:px-8` (32px) |
| Card p | `p-4` (16px) | `sm:p-6` (24px) | `lg:p-8` (32px) | - |

### 4. Icônes Responsives

**Règle :** Icône = 50% de la taille du conteneur

| Conteneur | Icône |
|-----------|-------|
| `w-10 h-10` (40px) | `w-5 h-5` (20px) |
| `sm:w-12 sm:h-12` (48px) | `sm:w-6 sm:h-6` (24px) |
| `lg:w-16 lg:h-16` (64px) | `lg:w-8 lg:h-8` (32px) |

### 5. Grilles Adaptatives

#### Pattern 1 : Empilé → Côte à côte

```tsx
<div className="grid lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
  {/* 1 colonne mobile, 2 colonnes desktop */}
</div>
```

#### Pattern 2 : 1 → 2 Colonnes

```tsx
<div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
  {/* 1 colonne mobile, 2 colonnes tablette+ */}
</div>
```

#### Pattern 3 : Colonnes fixes

```tsx
<div className="grid grid-cols-2 gap-3">
  {/* Toujours 2 colonnes */}
</div>
```

### 6. Boutons Responsives

```tsx
<NeuButton
  className="flex-1 sm:flex-none text-[11px] sm:text-xs lg:text-sm"
>
  <Icon className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 flex-shrink-0" />
  <span className="truncate">Texte</span>
</NeuButton>
```

**Points clés :**
- Mobile : `flex-1` (pleine largeur)
- Desktop : `sm:flex-none` (largeur auto)
- Texte : `truncate` pour éviter débordement
- Icône : `flex-shrink-0` pour empêcher rétrécissement

### 7. Gestion du Texte Long

```tsx
{/* Titre */}
<h1 className="truncate">Long Title...</h1>

{/* Description */}
<p className="line-clamp-2">Long description...</p>

{/* Message d'erreur */}
<p className="break-words">Long error message...</p>
```

- `truncate` : Coupe avec ellipsis (1 ligne)
- `line-clamp-2` : Limite à 2 lignes avec ellipsis
- `break-words` : Casse les mots longs si nécessaire

### 8. Min-Width et Flex

```tsx
<div className="flex-1 min-w-0">
  <h1 className="truncate">...</h1>
</div>
```

- `flex-1` : Prend l'espace disponible
- `min-w-0` : Permet au contenu de se rétrécir en dessous de sa taille naturelle
- Essentiel pour que `truncate` fonctionne dans un flex container

---

## 📏 Checklist d'Implémentation Responsive

Pour chaque nouvelle page, vérifier :

### ✅ Structure de Base
- [ ] `SidebarProvider` englobe toute la page
- [ ] `DashboardSidebar` présent
- [ ] `SidebarInset` avec padding gauche adaptatif : `pl-2 sm:pl-4 lg:pl-6`

### ✅ Header
- [ ] Padding horizontal : `px-3 sm:px-4 lg:px-6 xl:px-8`
- [ ] Padding vertical : `pt-4 sm:pt-6 lg:pt-8`
- [ ] Card interne : `p-4 sm:p-6 lg:p-8`
- [ ] Layout flex : `flex-col sm:flex-row`
- [ ] Espacement : `gap-3 sm:gap-4 lg:gap-6`

### ✅ Typographie
- [ ] Titre h1 : `text-lg sm:text-xl lg:text-2xl xl:text-3xl`
- [ ] Sous-titre : `text-[9px] sm:text-[10px] lg:text-xs`
- [ ] Description : `text-[10px] sm:text-xs lg:text-sm`
- [ ] Utilisation de `truncate`, `line-clamp`, ou `break-words` selon besoin

### ✅ Icônes
- [ ] Conteneur : `w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16`
- [ ] Icône : 50% de la taille du conteneur
- [ ] `flex-shrink-0` sur les icônes dans flex containers

### ✅ Boutons
- [ ] Largeur : `flex-1 sm:flex-none`
- [ ] Texte : `text-[11px] sm:text-xs lg:text-sm`
- [ ] Icône : `w-3 h-3 sm:w-4 sm:h-4`
- [ ] `truncate` sur le texte

### ✅ Main Content
- [ ] Padding horizontal : `px-3 sm:px-4 lg:px-6 xl:px-8`
- [ ] Padding vertical : `pt-3 sm:pt-4 lg:pt-6 pb-6 sm:pb-8 lg:pb-10`
- [ ] Espacement : `space-y-3 sm:space-y-4 lg:space-y-6`
- [ ] Max-width : `max-w-7xl mx-auto w-full`

### ✅ Grilles
- [ ] Colonnes adaptatives : `grid lg:grid-cols-2` ou `grid sm:grid-cols-2`
- [ ] Gap adaptatif : `gap-3 sm:gap-4 lg:gap-6`

### ✅ Cards
- [ ] Padding : `p-4 sm:p-6`
- [ ] Margin bottom sections : `mb-4 sm:mb-6`

### ✅ Messages (Erreur/Succès)
- [ ] Padding : `p-3 sm:p-4`
- [ ] Gap : `gap-2 sm:gap-3`
- [ ] Icône : `w-4 h-4 sm:w-5 sm:h-5`
- [ ] Texte avec `break-words`

---

## 🎨 Template de Page Standard

```tsx
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { NeuCard } from "@/components/ui/neu-card";
import { NeuButton } from "@/components/ui/neu-button";

const MyPage = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <DashboardSidebar />
        <SidebarInset className="flex-1 bg-background pl-2 sm:pl-4 lg:pl-6">
          {/* Header */}
          <header className="px-3 sm:px-4 lg:px-6 xl:px-8 pt-4 sm:pt-6 lg:pt-8">
            <NeuCard className="p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 lg:gap-6">
                {/* Icône + Titre */}
                <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-1 min-w-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] sm:text-[10px] lg:text-xs uppercase tracking-[0.3em] text-slate-400 mb-0.5 sm:mb-1 lg:mb-2 truncate">
                      Section · Sous-section
                    </p>
                    <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-slate-900 mb-0.5 sm:mb-1 truncate">
                      Titre de la Page
                    </h1>
                    <p className="text-[10px] sm:text-xs lg:text-sm text-slate-500 line-clamp-2">
                      Description de la page
                    </p>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex gap-2 flex-shrink-0 w-full sm:w-auto">
                  <NeuButton
                    variant="outline"
                    size="sm"
                    className="flex-1 sm:flex-none text-[11px] sm:text-xs lg:text-sm"
                  >
                    <Icon className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 flex-shrink-0" aria-hidden="true" />
                    <span className="truncate">Action</span>
                  </NeuButton>
                </div>
              </div>
            </NeuCard>
          </header>

          {/* Main Content */}
          <main className="px-3 sm:px-4 lg:px-6 xl:px-8 pt-3 sm:pt-4 lg:pt-6 pb-6 sm:pb-8 lg:pb-10 space-y-3 sm:space-y-4 lg:space-y-6 max-w-7xl mx-auto w-full">
            {/* Contenu principal */}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};
```

---

## 🔍 Points d'Attention

### 1. Utilisation de `min-w-0`

Nécessaire dans les flex containers pour permettre au texte de se rétrécir :

```tsx
<div className="flex-1 min-w-0">
  <h1 className="truncate">Titre long...</h1>
</div>
```

### 2. `flex-shrink-0` sur les Icônes

Empêche les icônes de se rétrécir dans un flex container :

```tsx
<Icon className="w-4 h-4 flex-shrink-0" />
```

### 3. `truncate` vs `line-clamp` vs `break-words`

- `truncate` : 1 ligne avec ellipsis
- `line-clamp-2` : 2 lignes max avec ellipsis
- `break-words` : Casse les mots longs si nécessaire

### 4. Grilles Responsives

Toujours commencer par 1 colonne (mobile-first) :

```tsx
// ✅ Bon
<div className="grid lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">

// ❌ Mauvais
<div className="grid grid-cols-2 lg:grid-cols-1">
```

### 5. Boutons pleine largeur sur mobile

Sur mobile, les boutons doivent prendre toute la largeur disponible :

```tsx
<NeuButton className="flex-1 sm:flex-none">
```

---

## 📊 Résumé des Tailles

### Espacements (spacing)

| Breakpoint | px-3 | sm:px-4 | lg:px-6 | xl:px-8 |
|------------|------|---------|---------|---------|
| **Valeur** | 12px | 16px | 24px | 32px |

### Typographie

| Breakpoint | text-lg | sm:text-xl | lg:text-2xl | xl:text-3xl |
|------------|---------|------------|-------------|-------------|
| **Valeur** | 18px | 20px | 24px | 30px |

### Icônes

| Breakpoint | w-10 | sm:w-12 | lg:w-16 |
|------------|------|---------|---------|
| **Valeur** | 40px | 48px | 64px |

---

**Document créé le :** 2025-01-XX  
**Version :** 1.0  
**Référence :** `src/pages/TaxesPage.tsx`

