import { Check } from "lucide-react"

export default function PricingSection() {
  const plans = [
    {
      name: "LOCATAIRE",
      price: "Gratuit",
      priceSuffix: "",
      description: "Pour ceux qui veulent louer une voiture simplement.",
      features: [
        "Recherche illimitee",
        "Reservation instantanee",
        "Assurance tous risques incluse",
        "Assistance 24h/24",
        "Annulation gratuite 48h avant",
      ],
      popular: false,
    },
    {
      name: "PROPRIETAIRE",
      price: "0%",
      priceSuffix: "les 3 premiers mois",
      description: "Rentabilisez votre voiture quand vous ne l'utilisez pas.",
      features: [
        "Publication illimitee d'annonces",
        "Gestion du calendrier",
        "Assurance proprietaire incluse",
        "Paiement automatique",
        "Tableau de bord revenus",
      ],
      popular: true,
    },
    {
      name: "PRO",
      price: "49 EUR",
      priceSuffix: "/mois",
      description: "Pour les flottes et les professionnels de la location.",
      features: [
        "Gestion multi-vehicules",
        "API et integrations",
        "Reporting avance",
        "Support prioritaire",
        "Visibilite boostee",
      ],
      popular: false,
    },
  ]

  return (
    <section id="pricing" className="py-24 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-xs font-mono text-muted-foreground tracking-wider">{"◆ TARIFS"}</span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl mt-4 mb-4">
            Roulez malin,
            <br />
            louez sans frais caches
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
            <div className="bg-[#fffef0] px-3 py-1 rounded shadow-sm rotate-[-2deg] border border-amber-100">
              <span className="text-xs font-mono">INSCRIPTION_GRATUITE</span>
            </div>
            <p className="text-muted-foreground text-sm hidden sm:block">Transparent et sans engagement</p>
            <div className="bg-[#fffef0] px-3 py-1 rounded shadow-sm rotate-[2deg] border border-amber-100">
              <span className="text-xs font-mono">SANS_COMMISSION*</span>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`bg-card border rounded-2xl p-6 relative ${
                plan.popular ? "border-primary shadow-lg" : "border-border"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-mono px-3 py-1 rounded-full">
                  {"◆ POPULAIRE"}
                </div>
              )}

              <div className="mb-6">
                <span className="text-xs font-mono text-muted-foreground">{plan.name}</span>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-4xl font-serif">{plan.price}</span>
                  {plan.priceSuffix && <span className="text-muted-foreground text-sm">{plan.priceSuffix}</span>}
                </div>
                <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
              </div>

              <div className="space-y-3 mb-6">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-accent flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-accent-foreground" />
                    </div>
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                className={`w-full py-3 rounded-full text-sm font-medium transition-colors ${
                  plan.popular
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "border border-border hover:bg-secondary"
                }`}
              >
                COMMENCER
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
