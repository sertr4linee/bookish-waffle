import { Check, ShieldCheck, MapPin, Zap, Car } from "lucide-react"

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-start justify-between mb-16">
          <div>
            <span className="text-xs font-mono text-muted-foreground tracking-wider">{"◆ NOS_AVANTAGES"}</span>
            <h2 className="font-serif text-4xl md:text-5xl mt-4 max-w-lg leading-tight">
              Pourquoi choisir AutoLoc
            </h2>
          </div>
          <p className="text-muted-foreground text-sm max-w-xs hidden md:block">
            La confiance d{"'"}un service pro avec la simplicite du particulier.
          </p>
        </div>

        {/* Top row features */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          {/* Assurance incluse */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-start justify-between mb-6">
              <span className="text-xs font-mono text-muted-foreground">GARANTIE</span>
              <span className="text-xs font-mono text-muted-foreground">ASSURANCE_AUTO</span>
            </div>
            <div className="bg-secondary/50 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-card rounded-full px-3 py-1 border border-border">
                  <div className="w-4 h-4 rounded-full bg-foreground" />
                  <div className="w-4 h-4 rounded-full border-2 border-border" />
                </div>
                <div className="flex-1 h-1 bg-border rounded-full">
                  <div className="w-2/3 h-full bg-foreground rounded-full" />
                </div>
                <span className="text-xs font-mono text-muted-foreground">TOUS RISQUES</span>
              </div>
            </div>
            <h3 className="font-semibold text-lg mb-2">Assurance incluse</h3>
            <p className="text-sm text-muted-foreground">
              Chaque location est couverte par une assurance tous risques. Roulez l{"'"}esprit tranquille.
            </p>
          </div>

          {/* Partout en France */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-start justify-between mb-6">
              <span className="text-xs font-mono text-muted-foreground">RESEAU</span>
              <span className="text-xs font-mono text-muted-foreground">COUVERTURE_FR</span>
            </div>
            <div className="bg-secondary/50 rounded-xl p-4 mb-6">
              <div className="grid grid-cols-3 gap-2">
                {["Paris", "Lyon", "Marseille", "Bordeaux", "Lille", "Plus"].map((city, i) => (
                  <div
                    key={city}
                    className={`text-center p-2 rounded-lg ${i < 5 ? "bg-card border border-border" : "border border-dashed border-border"}`}
                  >
                    <div className="w-6 h-6 mx-auto mb-1 rounded bg-secondary flex items-center justify-center">
                      <MapPin className="w-3 h-3 text-muted-foreground" />
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground">{city}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-end mt-2">
                <span className="text-[10px] font-mono text-accent-foreground bg-accent px-2 py-0.5 rounded">
                  + 200 VILLES
                </span>
              </div>
            </div>
            <h3 className="font-semibold text-lg mb-2">Partout en France</h3>
            <p className="text-sm text-muted-foreground">Des milliers de voitures disponibles dans plus de 200 villes.</p>
          </div>

          {/* Paiement securise */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-start justify-between mb-6">
              <span className="text-xs font-mono text-muted-foreground">SECURITE</span>
              <span className="text-xs font-mono text-muted-foreground">PAIEMENT_SSL</span>
            </div>
            <div className="bg-secondary/50 rounded-xl p-4 mb-6 flex items-center justify-center">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-accent flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-foreground" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary-foreground" />
                </div>
              </div>
            </div>
            <h3 className="font-semibold text-lg mb-2">Paiement securise</h3>
            <p className="text-sm text-muted-foreground">
              Transactions cryptees et caution geree en ligne. Vos donnees restent privees.
            </p>
          </div>
        </div>

        {/* Bottom row features */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Reservation rapide */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex gap-6">
              <div className="bg-secondary/50 rounded-xl p-4 flex-shrink-0">
                <div className="relative w-20 h-20 rounded-full border-4 border-accent flex items-center justify-center">
                  <Zap className="w-8 h-8 text-foreground" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs font-mono text-muted-foreground">RAPIDITE</span>
                </div>
                <h3 className="font-semibold text-2xl mb-1">Reservez en 2 min</h3>
                <p className="text-sm text-muted-foreground">
                  Pas de paperasse, pas de file d{"'"}attente. Choisissez, reservez, roulez. C{"'"}est aussi simple que ca.
                </p>
              </div>
            </div>
          </div>

          {/* Flotte */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex gap-6">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs font-mono text-muted-foreground">CATALOGUE</span>
                </div>
                <h3 className="font-semibold text-2xl mb-1">{"5 000+ vehicules"}</h3>
                <p className="text-sm text-muted-foreground">
                  Citadines, SUV, berlines, utilitaires... Trouvez le vehicule parfait pour chaque occasion.
                </p>
              </div>
              <div className="bg-secondary/50 rounded-xl p-4 flex-shrink-0">
                <div className="flex gap-1">
                  {["5", "0", "0", "0"].map((num, i) => (
                    <div
                      key={i}
                      className="w-8 h-10 bg-card border border-border rounded flex items-center justify-center"
                    >
                      <span className="font-mono text-lg">{num}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
