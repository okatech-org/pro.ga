# 🚀 Guide de Référence Rapide - Patterns Responsive

Référence rapide des patterns responsive utilisés dans la page Taxes, pour une implémentation cohérente sur toutes les pages.

---

## 📐 Breakpoints Tailwind

| Breakpoint | Valeur | Usage |
|------------|--------|-------|
| **Base** | 0px+ | Mobile (par défaut) |
| **sm:** | 640px+ | Tablette portrait |
| **lg:** | 1024px+ | Desktop |
| **xl:** | 1280px+ | Grand desktop |

---

## 🎨 Patterns par Composant

### 1. STRUCTURE DE BASE

```tsx
<SidebarProvider>
  <div className="flex min-h-screen bg-background">
    <DashboardSidebar />
    <SidebarInset className="flex-1 bg-background pl-2 sm:pl-4 lg:pl-6">
      {/* Contenu */}
    </SidebarInset>
  </div>
</SidebarProvider>
```

**Points clés :**
- Padding gauche sidebar : `pl-2 sm:pl-4 lg:pl-6` (8px → 16px → 24px)

---

### 2. HEADER

```tsx
<header className="px-3 sm:px-4 lg:px-6 xl:px-8 pt-4 sm:pt-6 lg:pt-8">
  <NeuCard className="p-4 sm:p-6 lg:p-8">
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 lg:gap-6">
      {/* Contenu */}
    </div>
  </NeuCard>
</header>
```

**Patterns :**
- Padding horizontal : `px-3 sm:px-4 lg:px-6 xl:px-8` (12px → 16px → 24px → 32px)
- Padding vertical : `pt-4 sm:pt-6 lg:pt-8` (16px → 24px → 32px)
- Card padding : `p-4 sm:p-6 lg:p-8` (16px → 24px → 32px)
- Layout : `flex-col sm:flex-row` (empilé → horizontal)
- Gap : `gap-3 sm:gap-4 lg:gap-6` (12px → 16px → 24px)

---

### 3. ICÔNE DE TITRE

```tsx
<div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 rounded-2xl ...">
  <Icon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" />
</div>
```

**Tailles :**
- Conteneur : 40px → 48px → 64px
- Icône : 20px → 24px → 32px (50% du conteneur)
- Ratio constant : Icône = 50% de la taille du conteneur

---

### 4. TYPOGRAPHIE

#### Titre Principal (h1)

```tsx
<h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold ... truncate">
```

**Progression :** 18px → 20px → 24px → 30px

#### Sous-titre / Label

```tsx
<p className="text-[9px] sm:text-[10px] lg:text-xs uppercase tracking-[0.3em] ... truncate">
```

**Progression :** 9px → 10px → 12px

#### Description

```tsx
<p className="text-[10px] sm:text-xs lg:text-sm ... line-clamp-2">
```

**Progression :** 10px → 12px → 14px

#### Gestion Overflow
- `truncate` : 1 ligne avec ellipsis
- `line-clamp-2` : 2 lignes max avec ellipsis
- `break-words` : Casse les mots longs

---

### 5. BOUTONS

```tsx
<NeuButton
  className="flex-1 sm:flex-none text-[11px] sm:text-xs lg:text-sm"
>
  <Icon className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 flex-shrink-0" />
  <span className="truncate">Texte</span>
</NeuButton>
```

**Patterns :**
- Largeur : `flex-1` (mobile) → `sm:flex-none` (tablette+)
- Texte : `text-[11px] sm:text-xs lg:text-sm` (11px → 12px → 14px)
- Icône : `w-3 h-3 sm:w-4 sm:h-4` (12px → 16px)
- Margin icône : `mr-1.5 sm:mr-2` (6px → 8px)
- Icône : `flex-shrink-0` (empêche rétrécissement)
- Texte : `truncate` (évite débordement)

---

### 6. CONTENEUR DE BOUTONS

```tsx
<div className="flex gap-2 flex-shrink-0 w-full sm:w-auto">
```

**Patterns :**
- Gap constant : `gap-2` (8px)
- Largeur : `w-full` (mobile) → `sm:w-auto` (tablette+)

---

### 7. MAIN CONTENT

```tsx
<main className="px-3 sm:px-4 lg:px-6 xl:px-8 pt-3 sm:pt-4 lg:pt-6 pb-6 sm:pb-8 lg:pb-10 space-y-3 sm:space-y-4 lg:space-y-6 max-w-7xl mx-auto w-full">
```

**Patterns :**
- Padding horizontal : `px-3 sm:px-4 lg:px-6 xl:px-8` (12px → 16px → 24px → 32px)
- Padding top : `pt-3 sm:pt-4 lg:pt-6` (12px → 16px → 24px)
- Padding bottom : `pb-6 sm:pb-8 lg:pb-10` (24px → 32px → 40px)
- Espacement vertical : `space-y-3 sm:space-y-4 lg:space-y-6` (12px → 16px → 24px)
- Conteneur : `max-w-7xl mx-auto w-full` (max 1280px, centré)

---

### 8. GRILLE 2 COLONNES (Desktop)

```tsx
<div className="grid lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
```

**Patterns :**
- Colonnes : 1 (mobile/tablette) → 2 (desktop)
- Gap : `gap-3 sm:gap-4 lg:gap-6` (12px → 16px → 24px)

---

### 9. GRILLE 2 COLONNES (Tablette+)

```tsx
<div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
```

**Patterns :**
- Colonnes : 1 (mobile) → 2 (tablette+)
- Gap : `gap-3 sm:gap-4` (12px → 16px)

---

### 10. CARTES (NeuCard)

```tsx
<NeuCard className="p-4 sm:p-6">
  <div className="mb-4 sm:mb-6">
    <h2 className="text-lg sm:text-xl font-semibold ...">Titre</h2>
    <p className="text-xs sm:text-sm text-muted-foreground">Description</p>
  </div>
</NeuCard>
```

**Patterns :**
- Padding : `p-4 sm:p-6` (16px → 24px)
- Margin bottom section : `mb-4 sm:mb-6` (16px → 24px)
- Titre h2 : `text-lg sm:text-xl` (18px → 20px)
- Description : `text-xs sm:text-sm` (12px → 14px)

---

### 11. FORMULAIRES

#### Label

```tsx
<Label className="text-xs sm:text-sm">Label</Label>
```

**Progression :** 12px → 14px

#### Input

```tsx
<Input className="text-xs sm:text-sm" />
```

**Progression :** 12px → 14px

#### Container Label/Input

```tsx
<div className="space-y-1.5">
  <Label>...</Label>
  <Input>...</Input>
</div>
```

**Espacement :** `space-y-1.5` (6px constant)

---

### 12. GRILLE DE CHAMPS (2 Colonnes fixes)

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

**Patterns :**
- Colonnes : `grid-cols-2` (2 colonnes constantes)
- Gap : `gap-3` (12px constant)

---

### 13. SECTIONS AVEC SEPARATEUR

```tsx
<div className="space-y-3 pt-4 border-t border-border">
  <h3 className="text-sm sm:text-base font-semibold ...">Titre Section</h3>
  {/* Contenu */}
</div>
```

**Patterns :**
- Espacement interne : `space-y-3` (12px constant)
- Padding top : `pt-4` (16px constant)
- Bordure : `border-t border-border`
- Titre h3 : `text-sm sm:text-base` (14px → 16px)

---

### 14. MESSAGES (Erreur/Succès)

```tsx
<div className="mt-4 neu-inset rounded-xl p-3 sm:p-4 bg-red-50 border border-red-200 flex items-start gap-2 sm:gap-3">
  <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 flex-shrink-0 mt-0.5" />
  <div className="flex-1 min-w-0">
    <p className="text-xs sm:text-sm font-medium ... mb-0.5 sm:mb-1">Titre</p>
    <p className="text-[10px] sm:text-xs ... break-words">Message</p>
  </div>
  <button className="text-red-600 ... text-lg sm:text-xl leading-none">×</button>
</div>
```

**Patterns :**
- Padding : `p-3 sm:p-4` (12px → 16px)
- Gap : `gap-2 sm:gap-3` (8px → 12px)
- Icône : `w-4 h-4 sm:w-5 sm:h-5` (16px → 20px)
- Titre : `text-xs sm:text-sm` (12px → 14px)
- Message : `text-[10px] sm:text-xs` (10px → 12px)
- Bouton : `text-lg sm:text-xl` (18px → 20px)
- `break-words` : Pour éviter débordements
- `min-w-0` : Permet rétrécissement dans flex

---

### 15. TAX CARDS (Grille dans Panel)

```tsx
<div className="grid sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
  <TaxCard ... />
  <TaxCard ... />
</div>
```

**Patterns :**
- Colonnes : 1 (mobile) → 2 (tablette+)
- Gap : `gap-3 sm:gap-4` (12px → 16px)
- Margin bottom : `mb-4 sm:mb-6` (16px → 24px)

---

### 16. TAX CARD INTERNE

```tsx
<div className="neu-inset rounded-xl p-3 sm:p-4 hover:neu-raised transition-all">
  <div className="flex items-start justify-between gap-2 mb-2">
    <div className="flex items-center gap-2 min-w-0 flex-1">
      <Icon className="w-8 h-8 sm:w-10 sm:h-10 ..." />
      <p className="text-xs sm:text-sm font-semibold ... truncate">Titre</p>
    </div>
  </div>
  <p className="text-lg sm:text-xl lg:text-2xl font-bold ... truncate">Montant</p>
  <p className="text-[10px] sm:text-xs ... line-clamp-2">Subtitle</p>
</div>
```

**Patterns :**
- Padding : `p-3 sm:p-4` (12px → 16px)
- Gap : `gap-2` (8px constant)
- Icône : `w-8 h-8 sm:w-10 sm:h-10` (32px → 40px)
- Titre : `text-xs sm:text-sm` (12px → 14px)
- Montant : `text-lg sm:text-xl lg:text-2xl` (18px → 20px → 24px)
- Subtitle : `text-[10px] sm:text-xs` (10px → 12px)

---

## 🎯 Règles d'Or

### 1. Mobile-First

Toujours définir le style de base (mobile), puis ajouter les variantes :

```tsx
// ✅ Bon
className="text-lg lg:text-xl"

// ❌ Mauvais
className="text-xl lg:text-lg"
```

### 2. Progression de Tailles

**Typographie :** Augmenter de 2px par breakpoint

**Padding :** Multiplier par 1.5 à chaque breakpoint

**Icônes :** Icône = 50% de la taille du conteneur

### 3. Gestion Overflow

- **Titre long** : `truncate` (1 ligne, ellipsis)
- **Description longue** : `line-clamp-2` (2 lignes max, ellipsis)
- **Message long** : `break-words` (casse les mots)

### 4. Flex Containers

Toujours utiliser `min-w-0` sur les éléments flex pour permettre le rétrécissement :

```tsx
<div className="flex-1 min-w-0">
  <h1 className="truncate">Long Title...</h1>
</div>
```

### 5. Icônes dans Flex

Toujours ajouter `flex-shrink-0` sur les icônes :

```tsx
<Icon className="w-4 h-4 flex-shrink-0" />
```

---

## 📊 Tableau de Référence Rapide

| Élément | Mobile | Tablette | Desktop | Grand Desktop |
|---------|--------|----------|---------|---------------|
| **Padding Header px** | `px-3` (12px) | `sm:px-4` (16px) | `lg:px-6` (24px) | `xl:px-8` (32px) |
| **Padding Header pt** | `pt-4` (16px) | `sm:pt-6` (24px) | `lg:pt-8` (32px) | - |
| **Padding Card** | `p-4` (16px) | `sm:p-6` (24px) | `lg:p-8` (32px) | - |
| **Padding Main px** | `px-3` (12px) | `sm:px-4` (16px) | `lg:px-6` (24px) | `xl:px-8` (32px) |
| **Padding Main pt** | `pt-3` (12px) | `sm:pt-4` (16px) | `lg:pt-6` (24px) | - |
| **Padding Main pb** | `pb-6` (24px) | `sm:pb-8` (32px) | `lg:pb-10` (40px) | - |
| **Space-y Main** | `space-y-3` (12px) | `sm:space-y-4` (16px) | `lg:space-y-6` (24px) | - |
| **Titre h1** | `text-lg` (18px) | `sm:text-xl` (20px) | `lg:text-2xl` (24px) | `xl:text-3xl` (30px) |
| **Titre h2** | `text-lg` (18px) | `sm:text-xl` (20px) | - | - |
| **Titre h3** | `text-sm` (14px) | `sm:text-base` (16px) | - | - |
| **Texte normal** | `text-xs` (12px) | `sm:text-sm` (14px) | `lg:text-base` (16px) | - |
| **Petit texte** | `text-[10px]` (10px) | `sm:text-xs` (12px) | `lg:text-sm` (14px) | - |
| **Bouton texte** | `text-[11px]` (11px) | `sm:text-xs` (12px) | `lg:text-sm` (14px) | - |
| **Icône conteneur** | `w-10 h-10` (40px) | `sm:w-12 sm:h-12` (48px) | `lg:w-16 lg:h-16` (64px) | - |
| **Icône interne** | `w-5 h-5` (20px) | `sm:w-6 sm:h-6` (24px) | `lg:w-8 lg:h-8` (32px) | - |
| **Icône bouton** | `w-3 h-3` (12px) | `sm:w-4 sm:h-4` (16px) | - | - |
| **Gap header** | `gap-3` (12px) | `sm:gap-4` (16px) | `lg:gap-6` (24px) | - |
| **Gap grille** | `gap-3` (12px) | `sm:gap-4` (16px) | `lg:gap-6` (24px) | - |
| **Gap boutons** | `gap-2` (8px) | - | - | - |

---

## 🎨 Template Complet

```tsx
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
                  Description
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
        {/* Grille principale */}
        <div className="grid lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
          {/* Card 1 */}
          <NeuCard className="p-4 sm:p-6">
            {/* Contenu */}
          </NeuCard>
          
          {/* Card 2 */}
          <NeuCard className="p-4 sm:p-6">
            {/* Contenu */}
          </NeuCard>
        </div>
      </main>
    </SidebarInset>
  </div>
</SidebarProvider>
```

---

## ✅ Checklist d'Implémentation

- [ ] Structure : `SidebarProvider` + `DashboardSidebar` + `SidebarInset`
- [ ] Padding sidebar : `pl-2 sm:pl-4 lg:pl-6`
- [ ] Header padding : `px-3 sm:px-4 lg:px-6 xl:px-8 pt-4 sm:pt-6 lg:pt-8`
- [ ] Header layout : `flex-col sm:flex-row`
- [ ] Typographie progressive : `text-lg sm:text-xl lg:text-2xl xl:text-3xl`
- [ ] Icônes responsives : `w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16`
- [ ] Boutons : `flex-1 sm:flex-none` + `text-[11px] sm:text-xs lg:text-sm`
- [ ] Main padding : `px-3 sm:px-4 lg:px-6 xl:px-8`
- [ ] Main spacing : `space-y-3 sm:space-y-4 lg:space-y-6`
- [ ] Grilles adaptatives : `grid lg:grid-cols-2` ou `grid sm:grid-cols-2`
- [ ] Cards padding : `p-4 sm:p-6`
- [ ] Gestion overflow : `truncate`, `line-clamp-2`, ou `break-words`
- [ ] `min-w-0` sur éléments flex
- [ ] `flex-shrink-0` sur icônes

---

**Version :** 1.0  
**Dernière mise à jour :** 2025-01-XX

