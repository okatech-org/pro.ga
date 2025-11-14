import { Palette, Sparkles, CheckCircle, AlertCircle, Info } from "lucide-react";

export function BrandShowcase() {
  const colors = [
    { name: "Primary", var: "--asted-primary-500", desc: "Indigo moderne" },
    { name: "Success", var: "--asted-success-500", desc: "Émeraude" },
    { name: "Warning", var: "--asted-warning-500", desc: "Ambré" },
    { name: "Danger", var: "--asted-danger-500", desc: "Rouge moderne" },
    { name: "Info", var: "--asted-info-500", desc: "Violet" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="asted-card">
        <div className="flex items-center gap-3 mb-4">
          <Palette className="w-6 h-6" style={{ color: "var(--asted-primary-500)" }} />
          <h2 className="text-2xl font-bold proga-gradient-text">
            Palette PRO.GA
          </h2>
        </div>
        <p style={{ color: "var(--asted-text-secondary)" }}>
          Design neomorphique personnalisé avec les couleurs de votre marque
        </p>
      </div>

      {/* Color Swatches */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {colors.map((color) => (
          <div key={color.name} className="asted-card proga-glow">
            <div
              className="w-full h-24 rounded-lg mb-3"
              style={{
                background: `var(${color.var})`,
                boxShadow: `0 4px 14px 0 var(${color.var})30`,
              }}
            />
            <h3 className="font-bold" style={{ color: "var(--asted-text-primary)" }}>
              {color.name}
            </h3>
            <p className="text-sm" style={{ color: "var(--asted-text-tertiary)" }}>
              {color.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Example Components */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Buttons */}
        <div className="asted-card">
          <h3 className="text-lg font-bold mb-4" style={{ color: "var(--asted-text-primary)" }}>
            Boutons
          </h3>
          <div className="space-y-3">
            <button className="asted-button asted-button-primary w-full relative proga-button-shine overflow-hidden">
              <Sparkles className="w-4 h-4" />
              <span>Action Principale</span>
            </button>
            <button className="asted-button asted-button-success w-full">
              <CheckCircle className="w-4 h-4" />
              <span>Succès</span>
            </button>
            <button className="asted-button asted-button-warning w-full">
              <AlertCircle className="w-4 h-4" />
              <span>Attention</span>
            </button>
            <button className="asted-button asted-button-danger w-full">
              <AlertCircle className="w-4 h-4" />
              <span>Danger</span>
            </button>
          </div>
        </div>

        {/* Cards with gradients */}
        <div className="space-y-4">
          <div 
            className="asted-card proga-pulse"
            style={{ 
              background: "var(--proga-gradient-primary)",
              color: "white"
            }}
          >
            <div className="flex items-center gap-3">
              <div className="asted-pill-icon" style={{ background: "rgba(255,255,255,0.2)" }}>
                <Info className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold">Carte Premium</h4>
                <p className="text-sm opacity-90">Avec effet de pulsation</p>
              </div>
            </div>
          </div>

          <div className="asted-card-inset">
            <h4 className="font-bold mb-2" style={{ color: "var(--asted-text-primary)" }}>
              Carte Enfoncée
            </h4>
            <p className="text-sm" style={{ color: "var(--asted-text-secondary)" }}>
              Effet neomorphique inset pour les conteneurs
            </p>
          </div>

          <div className="asted-card asted-card-hover">
            <h4 className="font-bold mb-2" style={{ color: "var(--asted-text-primary)" }}>
              Carte Interactive
            </h4>
            <p className="text-sm" style={{ color: "var(--asted-text-secondary)" }}>
              Survolez pour voir l'effet hover
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
