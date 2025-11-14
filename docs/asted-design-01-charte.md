# Charte Graphique Asted Design 01

## 📋 Table des matières
1. [Vue d'ensemble](#vue-densemble)
2. [Philosophie du design](#philosophie-du-design)
3. [Palette de couleurs](#palette-de-couleurs)
4. [Typographie](#typographie)
5. [Espacements et grilles](#espacements-et-grilles)
6. [Composants](#composants)
7. [Ombres et élévations](#ombres-et-élévations)
8. [États interactifs](#états-interactifs)
9. [Accessibilité](#accessibilité)
10. [Guidelines d'utilisation](#guidelines-dutilisation)

---

## Vue d'ensemble

**Asted Design 01** est un système de design neomorphique moderne qui crée une illusion de profondeur et de relief à travers l'utilisation subtile d'ombres claires et sombres. Le design évoque des éléments qui semblent être pressés dans ou sortir de l'arrière-plan.

### Caractéristiques principales
- Design neomorphique (soft UI)
- Mode clair et sombre
- Cohérence visuelle
- Accessibilité optimisée
- Responsive natif

---

## Philosophie du design

### Principes fondamentaux

1. **Minimalisme élégant** : Interfaces épurées avec focus sur le contenu
2. **Profondeur subtile** : Utilisation d'ombres douces pour créer de la profondeur
3. **Cohérence** : Système unifié à travers toute l'application
4. **Accessibilité** : Contraste suffisant et navigation claire
5. **Adaptabilité** : Fonctionne sur tous les supports

### Quand utiliser Asted Design 01

✅ Applications professionnelles
✅ Dashboards et interfaces administratives
✅ Portails gouvernementaux
✅ Applications SaaS
✅ Sites institutionnels

❌ Sites e-commerce (préférer plus de contraste)
❌ Applications ludiques (trop formel)
❌ Interfaces nécessitant des éléments très contrastés

---

## Palette de couleurs

### Mode Clair (Light Mode)

#### Couleurs de base
```css
/* Arrière-plans neomorphiques */
--asted-bg-base: #e5e7eb;           /* Fond principal */
--asted-bg-elevated: #f3f4f6;       /* Fond élevé (modales, cards) */
--asted-bg-sunken: #d1d5db;         /* Fond enfoncé (inputs) */

/* Ombres neomorphiques */
--asted-shadow-light: #ffffff;      /* Ombre claire (highlight) */
--asted-shadow-dark: #c5c7ca;       /* Ombre sombre (shadow) */

/* Textes */
--asted-text-primary: #1f2937;      /* Texte principal */
--asted-text-secondary: #4b5563;    /* Texte secondaire */
--asted-text-tertiary: #6b7280;     /* Texte tertiaire */
--asted-text-disabled: #9ca3af;     /* Texte désactivé */

/* Bordures */
--asted-border-light: #e5e7eb;      /* Bordure claire */
--asted-border-medium: #d1d5db;     /* Bordure moyenne */
--asted-border-dark: #9ca3af;       /* Bordure sombre */
```

#### Couleurs sémantiques
```css
/* Primaire - Bleu */
--asted-primary-50: #eff6ff;
--asted-primary-100: #dbeafe;
--asted-primary-200: #bfdbfe;
--asted-primary-300: #93c5fd;
--asted-primary-400: #60a5fa;
--asted-primary-500: #3b82f6;       /* Principal */
--asted-primary-600: #2563eb;       /* Hover */
--asted-primary-700: #1d4ed8;       /* Active */
--asted-primary-800: #1e40af;
--asted-primary-900: #1e3a8a;

/* Success - Vert */
--asted-success-50: #ecfdf5;
--asted-success-100: #d1fae5;
--asted-success-500: #10b981;       /* Principal */
--asted-success-600: #059669;       /* Hover */
--asted-success-700: #047857;       /* Active */

/* Warning - Orange */
--asted-warning-50: #fffbeb;
--asted-warning-100: #fef3c7;
--asted-warning-500: #f59e0b;       /* Principal */
--asted-warning-600: #d97706;       /* Hover */
--asted-warning-700: #b45309;       /* Active */

/* Danger - Rouge */
--asted-danger-50: #fef2f2;
--asted-danger-100: #fee2e2;
--asted-danger-500: #ef4444;        /* Principal */
--asted-danger-600: #dc2626;        /* Hover */
--asted-danger-700: #b91c1c;        /* Active */

/* Info - Violet */
--asted-info-50: #faf5ff;
--asted-info-100: #f3e8ff;
--asted-info-500: #8b5cf6;          /* Principal */
--asted-info-600: #7c3aed;          /* Hover */
--asted-info-700: #6d28d9;          /* Active */
```

### Mode Sombre (Dark Mode)

#### Couleurs de base
```css
/* Arrière-plans neomorphiques */
--asted-bg-base: #1e293b;           /* Fond principal */
--asted-bg-elevated: #293548;       /* Fond élevé */
--asted-bg-sunken: #151e2d;         /* Fond enfoncé */

/* Ombres neomorphiques */
--asted-shadow-light: #374155;      /* Ombre claire */
--asted-shadow-dark: #0f172a;       /* Ombre sombre */

/* Textes */
--asted-text-primary: #f1f5f9;      /* Texte principal */
--asted-text-secondary: #cbd5e1;    /* Texte secondaire */
--asted-text-tertiary: #94a3b8;     /* Texte tertiaire */
--asted-text-disabled: #64748b;     /* Texte désactivé */

/* Bordures */
--asted-border-light: #334155;      /* Bordure claire */
--asted-border-medium: #475569;     /* Bordure moyenne */
--asted-border-dark: #64748b;       /* Bordure sombre */
```

#### Couleurs sémantiques (ajustées pour le dark mode)
```css
/* Les mêmes teintes mais avec des valeurs ajustées pour le contraste */
--asted-primary-500: #60a5fa;       /* Plus clair en dark mode */
--asted-success-500: #34d399;
--asted-warning-500: #fbbf24;
--asted-danger-500: #f87171;
--asted-info-500: #a78bfa;
```

---

## Typographie

### Familles de polices

```css
/* Police principale */
--asted-font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', 
                   'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 
                   'Fira Sans', 'Droid Sans', 'Helvetica Neue', 
                   sans-serif;

/* Police monospace (code) */
--asted-font-mono: 'SF Mono', 'Monaco', 'Cascadia Code', 
                   'Roboto Mono', 'Courier New', monospace;

/* Alternative : Inter, Poppins, ou DM Sans pour plus de modernité */
```

### Échelle typographique

```css
/* Tailles de police */
--asted-text-xs: 0.75rem;      /* 12px */
--asted-text-sm: 0.875rem;     /* 14px */
--asted-text-base: 1rem;       /* 16px */
--asted-text-lg: 1.125rem;     /* 18px */
--asted-text-xl: 1.25rem;      /* 20px */
--asted-text-2xl: 1.5rem;      /* 24px */
--asted-text-3xl: 1.875rem;    /* 30px */
--asted-text-4xl: 2.25rem;     /* 36px */
--asted-text-5xl: 3rem;        /* 48px */

/* Poids de police */
--asted-font-light: 300;
--asted-font-normal: 400;
--asted-font-medium: 500;
--asted-font-semibold: 600;
--asted-font-bold: 700;
--asted-font-extrabold: 800;

/* Hauteur de ligne */
--asted-leading-tight: 1.25;
--asted-leading-normal: 1.5;
--asted-leading-relaxed: 1.75;
--asted-leading-loose: 2;

/* Espacement des lettres */
--asted-tracking-tight: -0.025em;
--asted-tracking-normal: 0;
--asted-tracking-wide: 0.025em;
--asted-tracking-wider: 0.05em;
--asted-tracking-widest: 0.1em;
```

### Hiérarchie typographique

```css
/* Titres */
.asted-h1 {
  font-size: var(--asted-text-4xl);
  font-weight: var(--asted-font-bold);
  line-height: var(--asted-leading-tight);
  letter-spacing: var(--asted-tracking-tight);
}

.asted-h2 {
  font-size: var(--asted-text-3xl);
  font-weight: var(--asted-font-bold);
  line-height: var(--asted-leading-tight);
}

.asted-h3 {
  font-size: var(--asted-text-2xl);
  font-weight: var(--asted-font-semibold);
  line-height: var(--asted-leading-tight);
}

.asted-h4 {
  font-size: var(--asted-text-xl);
  font-weight: var(--asted-font-semibold);
  line-height: var(--asted-leading-normal);
}

.asted-h5 {
  font-size: var(--asted-text-lg);
  font-weight: var(--asted-font-medium);
  line-height: var(--asted-leading-normal);
}

.asted-h6 {
  font-size: var(--asted-text-base);
  font-weight: var(--asted-font-medium);
  line-height: var(--asted-leading-normal);
}

/* Paragraphes */
.asted-body-large {
  font-size: var(--asted-text-lg);
  line-height: var(--asted-leading-relaxed);
}

.asted-body {
  font-size: var(--asted-text-base);
  line-height: var(--asted-leading-relaxed);
}

.asted-body-small {
  font-size: var(--asted-text-sm);
  line-height: var(--asted-leading-normal);
}

/* Textes spéciaux */
.asted-caption {
  font-size: var(--asted-text-xs);
  line-height: var(--asted-leading-normal);
  color: var(--asted-text-tertiary);
}

.asted-overline {
  font-size: var(--asted-text-xs);
  font-weight: var(--asted-font-semibold);
  text-transform: uppercase;
  letter-spacing: var(--asted-tracking-widest);
  color: var(--asted-text-tertiary);
}
```

---

## Espacements et grilles

### Système d'espacement (base 4px)

```css
--asted-space-0: 0;
--asted-space-1: 0.25rem;    /* 4px */
--asted-space-2: 0.5rem;     /* 8px */
--asted-space-3: 0.75rem;    /* 12px */
--asted-space-4: 1rem;       /* 16px */
--asted-space-5: 1.25rem;    /* 20px */
--asted-space-6: 1.5rem;     /* 24px */
--asted-space-8: 2rem;       /* 32px */
--asted-space-10: 2.5rem;    /* 40px */
--asted-space-12: 3rem;      /* 48px */
--asted-space-16: 4rem;      /* 64px */
--asted-space-20: 5rem;      /* 80px */
--asted-space-24: 6rem;      /* 96px */
```

### Rayons de bordure

```css
--asted-radius-none: 0;
--asted-radius-sm: 0.375rem;     /* 6px */
--asted-radius-base: 0.5rem;     /* 8px */
--asted-radius-md: 0.75rem;      /* 12px */
--asted-radius-lg: 1rem;         /* 16px */
--asted-radius-xl: 1.25rem;      /* 20px */
--asted-radius-2xl: 1.5rem;      /* 24px */
--asted-radius-full: 9999px;     /* Circulaire */
```

### Grille et breakpoints

```css
/* Breakpoints responsive */
--asted-breakpoint-xs: 475px;
--asted-breakpoint-sm: 640px;
--asted-breakpoint-md: 768px;
--asted-breakpoint-lg: 1024px;
--asted-breakpoint-xl: 1280px;
--asted-breakpoint-2xl: 1536px;

/* Conteneurs */
--asted-container-xs: 475px;
--asted-container-sm: 640px;
--asted-container-md: 768px;
--asted-container-lg: 1024px;
--asted-container-xl: 1280px;
--asted-container-2xl: 1400px;
```

---

## Composants

### 1. Cartes (Cards)

#### Card standard - Élevée
```css
.asted-card {
  background: var(--asted-bg-base);
  border-radius: var(--asted-radius-xl);
  padding: var(--asted-space-6);
  box-shadow: 
    10px 10px 20px var(--asted-shadow-dark),
    -10px -10px 20px var(--asted-shadow-light);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.asted-card:hover {
  box-shadow: 
    12px 12px 24px var(--asted-shadow-dark),
    -12px -12px 24px var(--asted-shadow-light);
  transform: translateY(-2px);
}
```

#### Card inset - Enfoncée
```css
.asted-card-inset {
  background: var(--asted-bg-base);
  border-radius: var(--asted-radius-lg);
  padding: var(--asted-space-5);
  box-shadow: 
    inset 6px 6px 12px var(--asted-shadow-dark),
    inset -6px -6px 12px var(--asted-shadow-light);
}
```

#### Card plate - Sans relief
```css
.asted-card-flat {
  background: var(--asted-bg-base);
  border-radius: var(--asted-radius-lg);
  padding: var(--asted-space-6);
  border: 1px solid var(--asted-border-light);
}
```

### 2. Boutons (Buttons)

#### Bouton standard
```css
.asted-button {
  /* Base */
  background: var(--asted-bg-base);
  color: var(--asted-text-primary);
  font-size: var(--asted-text-base);
  font-weight: var(--asted-font-medium);
  padding: var(--asted-space-3) var(--asted-space-6);
  border: none;
  border-radius: var(--asted-radius-md);
  cursor: pointer;
  
  /* Ombres neomorphiques */
  box-shadow: 
    5px 5px 10px var(--asted-shadow-dark),
    -5px -5px 10px var(--asted-shadow-light);
  
  /* Transition */
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  
  /* Accessibilité */
  min-height: 44px;
  min-width: 44px;
  
  /* Flexbox pour icônes */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--asted-space-2);
}

.asted-button:hover {
  box-shadow: 
    6px 6px 12px var(--asted-shadow-dark),
    -6px -6px 12px var(--asted-shadow-light);
  transform: translateY(-1px);
}

.asted-button:active {
  box-shadow: 
    inset 3px 3px 6px var(--asted-shadow-dark),
    inset -3px -3px 6px var(--asted-shadow-light);
  transform: translateY(0);
}

.asted-button:focus-visible {
  outline: 2px solid var(--asted-primary-500);
  outline-offset: 2px;
}

.asted-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}
```

#### Bouton primaire
```css
.asted-button-primary {
  background: var(--asted-primary-500);
  color: #ffffff;
  box-shadow: 
    5px 5px 15px rgba(59, 130, 246, 0.4),
    -5px -5px 15px rgba(255, 255, 255, 0.8);
}

.asted-button-primary:hover {
  background: var(--asted-primary-600);
  box-shadow: 
    6px 6px 18px rgba(59, 130, 246, 0.5),
    -6px -6px 18px rgba(255, 255, 255, 0.9);
}

.asted-button-primary:active {
  background: var(--asted-primary-700);
  box-shadow: 
    inset 3px 3px 6px rgba(0, 0, 0, 0.3),
    inset -3px -3px 6px rgba(255, 255, 255, 0.1);
}
```

#### Variantes de couleur
```css
/* Success */
.asted-button-success {
  background: var(--asted-success-500);
  color: #ffffff;
  box-shadow: 
    5px 5px 15px rgba(16, 185, 129, 0.4),
    -5px -5px 15px rgba(255, 255, 255, 0.8);
}

/* Warning */
.asted-button-warning {
  background: var(--asted-warning-500);
  color: #ffffff;
  box-shadow: 
    5px 5px 15px rgba(245, 158, 11, 0.4),
    -5px -5px 15px rgba(255, 255, 255, 0.8);
}

/* Danger */
.asted-button-danger {
  background: var(--asted-danger-500);
  color: #ffffff;
  box-shadow: 
    5px 5px 15px rgba(239, 68, 68, 0.4),
    -5px -5px 15px rgba(255, 255, 255, 0.8);
}
```

#### Tailles de boutons
```css
.asted-button-sm {
  padding: var(--asted-space-2) var(--asted-space-4);
  font-size: var(--asted-text-sm);
  border-radius: var(--asted-radius-base);
}

.asted-button-lg {
  padding: var(--asted-space-4) var(--asted-space-8);
  font-size: var(--asted-text-lg);
  border-radius: var(--asted-radius-lg);
}
```

### 3. Inputs (Champs de saisie)

```css
.asted-input {
  /* Base */
  width: 100%;
  background: var(--asted-bg-base);
  color: var(--asted-text-primary);
  font-size: var(--asted-text-base);
  padding: var(--asted-space-3) var(--asted-space-4);
  border: none;
  border-radius: var(--asted-radius-md);
  
  /* Effet inset */
  box-shadow: 
    inset 4px 4px 8px var(--asted-shadow-dark),
    inset -4px -4px 8px var(--asted-shadow-light);
  
  /* Transition */
  transition: all 0.2s ease;
}

.asted-input:focus {
  outline: none;
  box-shadow: 
    inset 4px 4px 8px var(--asted-shadow-dark),
    inset -4px -4px 8px var(--asted-shadow-light),
    0 0 0 3px rgba(59, 130, 246, 0.1);
}

.asted-input::placeholder {
  color: var(--asted-text-disabled);
}

.asted-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
```

### 4. Badges et Pills

```css
.asted-badge {
  display: inline-flex;
  align-items: center;
  padding: var(--asted-space-1) var(--asted-space-3);
  font-size: var(--asted-text-xs);
  font-weight: var(--asted-font-semibold);
  border-radius: var(--asted-radius-full);
  background: var(--asted-bg-base);
  color: var(--asted-text-secondary);
  box-shadow: 
    3px 3px 6px var(--asted-shadow-dark),
    -3px -3px 6px var(--asted-shadow-light);
}

.asted-pill-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--asted-bg-base);
  box-shadow: 
    4px 4px 8px var(--asted-shadow-dark),
    -4px -4px 8px var(--asted-shadow-light);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
```

### 5. Navigation

```css
.asted-nav {
  background: var(--asted-bg-base);
  border-radius: var(--asted-radius-xl);
  padding: var(--asted-space-4);
  box-shadow: 
    8px 8px 16px var(--asted-shadow-dark),
    -8px -8px 16px var(--asted-shadow-light);
}

.asted-nav-item {
  padding: var(--asted-space-3) var(--asted-space-4);
  border-radius: var(--asted-radius-md);
  color: var(--asted-text-secondary);
  transition: all 0.2s ease;
  cursor: pointer;
}

.asted-nav-item:hover {
  color: var(--asted-text-primary);
  background: var(--asted-bg-elevated);
}

.asted-nav-item.active {
  color: var(--asted-primary-500);
  box-shadow: 
    inset 3px 3px 6px var(--asted-shadow-dark),
    inset -3px -3px 6px var(--asted-shadow-light);
}
```

---

## Ombres et élévations

### Système d'élévation à 5 niveaux

```css
/* Niveau 0 - Au niveau du fond */
.asted-elevation-0 {
  box-shadow: none;
}

/* Niveau 1 - Légèrement élevé */
.asted-elevation-1 {
  box-shadow: 
    4px 4px 8px var(--asted-shadow-dark),
    -4px -4px 8px var(--asted-shadow-light);
}

/* Niveau 2 - Élevation standard */
.asted-elevation-2 {
  box-shadow: 
    8px 8px 16px var(--asted-shadow-dark),
    -8px -8px 16px var(--asted-shadow-light);
}

/* Niveau 3 - Élevation haute */
.asted-elevation-3 {
  box-shadow: 
    12px 12px 24px var(--asted-shadow-dark),
    -12px -12px 24px var(--asted-shadow-light);
}

/* Niveau 4 - Élevation maximale (modales, popovers) */
.asted-elevation-4 {
  box-shadow: 
    16px 16px 32px var(--asted-shadow-dark),
    -16px -16px 32px var(--asted-shadow-light);
}

/* Inset - Enfoncé */
.asted-inset {
  box-shadow: 
    inset 6px 6px 12px var(--asted-shadow-dark),
    inset -6px -6px 12px var(--asted-shadow-light);
}

/* Inset léger */
.asted-inset-light {
  box-shadow: 
    inset 3px 3px 6px var(--asted-shadow-dark),
    inset -3px -3px 6px var(--asted-shadow-light);
}
```

---

## États interactifs

### États standards

```css
/* Hover - Survol */
.asted-interactive:hover {
  transform: translateY(-2px);
  box-shadow: 
    6px 6px 12px var(--asted-shadow-dark),
    -6px -6px 12px var(--asted-shadow-light);
}

/* Active - Clic */
.asted-interactive:active {
  transform: translateY(0);
  box-shadow: 
    inset 3px 3px 6px var(--asted-shadow-dark),
    inset -3px -3px 6px var(--asted-shadow-light);
}

/* Focus - Navigation clavier */
.asted-interactive:focus-visible {
  outline: 2px solid var(--asted-primary-500);
  outline-offset: 2px;
}

/* Disabled - Désactivé */
.asted-interactive:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

/* Loading - Chargement */
.asted-loading {
  position: relative;
  pointer-events: none;
  color: transparent;
}

.asted-loading::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  margin: -10px 0 0 -10px;
  border: 2px solid var(--asted-text-disabled);
  border-top-color: var(--asted-primary-500);
  border-radius: 50%;
  animation: asted-spin 0.6s linear infinite;
}

@keyframes asted-spin {
  to { transform: rotate(360deg); }
}
```

---

## Accessibilité

### Principes WCAG 2.1

#### Contraste minimum
- **Texte normal** : Ratio de contraste minimum 4.5:1
- **Texte large** (>18px ou >14px gras) : Ratio minimum 3:1
- **Éléments UI** : Ratio minimum 3:1

#### Tailles de cible tactile
- **Minimum** : 44x44px pour tous les éléments interactifs
- **Recommandé** : 48x48px pour une meilleure accessibilité mobile

#### Navigation au clavier
```css
/* Focus visible pour tous les éléments interactifs */
*:focus-visible {
  outline: 2px solid var(--asted-primary-500);
  outline-offset: 2px;
}

/* Ordre de tabulation logique dans le HTML */
/* Utiliser tabindex="0" pour les éléments custom interactifs */
```

#### Screen readers
```html
<!-- Toujours inclure des labels -->
<label for="input-id" class="asted-label">Nom du champ</label>
<input id="input-id" class="asted-input" />

<!-- ARIA pour les composants custom -->
<button aria-label="Fermer la modale" aria-pressed="false">
  <svg>...</svg>
</button>

<!-- Skip links pour la navigation -->
<a href="#main-content" class="asted-skip-link">
  Aller au contenu principal
</a>
```

---

## Guidelines d'utilisation

### Do's ✅

1. **Utiliser les variables CSS** pour maintenir la cohérence
2. **Respecter l'échelle d'espacement** (multiples de 4px)
3. **Tester sur plusieurs tailles d'écran**
4. **Vérifier les contrastes** avec des outils WCAG
5. **Garder une hiérarchie claire** entre les éléments
6. **Utiliser les élévations avec parcimonie** (2-3 niveaux max par vue)
7. **Préférer les transitions douces** (0.2-0.3s)

### Don'ts ❌

1. **Ne pas mélanger les styles** (flat + neomorphique)
2. **Éviter trop d'ombres** sur un même élément
3. **Ne pas utiliser le neomorphisme** pour tous les éléments
4. **Éviter les contrastes trop faibles** entre fond et texte
5. **Ne pas oublier les états hover/focus/active**
6. **Ne pas créer des composants trop complexes**
7. **Éviter les animations trop agressives**

### Bonnes pratiques

#### Hiérarchie visuelle
```
Niveau 1 : Header/Navigation (elevation-2)
Niveau 2 : Cartes principales (elevation-2)
Niveau 3 : Cartes secondaires (elevation-1)
Niveau 4 : Inputs et éléments inset (inset)
Niveau 5 : Modales/Dropdowns (elevation-4)
```

#### Composition d'une page
```
1. Fond uniforme (bg-base)
2. Container avec padding responsive
3. Cards espacées uniformément (space-6 à space-8)
4. Éléments groupés logiquement
5. Espaces blancs généreux
```

#### Performance
- **Utiliser `will-change`** avec parcimonie
- **Préférer `transform` et `opacity`** pour les animations
- **Limiter le nombre d'ombres** sur les éléments animés
- **Utiliser `backdrop-filter`** uniquement si nécessaire

---

## Exemples de mise en page

### Dashboard layout
```html
<div class="asted-container">
  <!-- Header -->
  <header class="asted-card" style="margin-bottom: var(--asted-space-6)">
    <nav class="asted-nav">...</nav>
  </header>
  
  <!-- Stats Grid -->
  <div class="asted-grid-4">
    <div class="asted-card">Stat 1</div>
    <div class="asted-card">Stat 2</div>
    <div class="asted-card">Stat 3</div>
    <div class="asted-card">Stat 4</div>
  </div>
  
  <!-- Main Content -->
  <div class="asted-grid-2" style="margin-top: var(--asted-space-8)">
    <div class="asted-card">Chart</div>
    <div class="asted-card">Activity</div>
  </div>
</div>
```

### Form layout
```html
<form class="asted-card" style="max-width: 600px; margin: 0 auto;">
  <h2 class="asted-h2" style="margin-bottom: var(--asted-space-6)">
    Formulaire
  </h2>
  
  <div class="asted-form-group">
    <label class="asted-label">Nom</label>
    <input type="text" class="asted-input" />
  </div>
  
  <div class="asted-form-group">
    <label class="asted-label">Email</label>
    <input type="email" class="asted-input" />
  </div>
  
  <div class="asted-button-group">
    <button class="asted-button">Annuler</button>
    <button class="asted-button asted-button-primary">Valider</button>
  </div>
</form>
```

---

## Fichiers de ressources

### Structure de fichiers recommandée
```
asted-design/
├── css/
│   ├── asted-core.css          # Variables et reset
│   ├── asted-components.css    # Composants
│   ├── asted-utilities.css     # Classes utilitaires
│   └── asted-themes.css        # Thèmes light/dark
├── js/
│   └── asted-theme-toggle.js   # Toggle light/dark
└── docs/
    └── CHARTE-GRAPHIQUE.md     # Ce document
```

---

## Version et changelog

**Version actuelle** : 1.0.0  
**Date de création** : Novembre 2025  
**Créé par** : PELLEN-LAKOUMBA / OKA TECH

### Changelog
- **v1.0.0** (Nov 2025) : Création initiale de la charte Asted Design 01
  - Système neomorphique complet
  - Mode clair et sombre
  - Composants de base
  - Documentation complète

---

## Licence et utilisation

Cette charte graphique **Asted Design 01** est propriétaire et destinée à un usage interne et aux projets clients d'OKA TECH. 

Pour toute question ou suggestion d'amélioration, contactez : PELLEN-LAKOUMBA

---

**© 2025 OKA TECH - Asted Design 01 - Tous droits réservés**
