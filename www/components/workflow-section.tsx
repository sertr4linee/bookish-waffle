import { Search, ShieldCheck, CalendarCheck, Car } from "lucide-react"

export default function WorkflowSection() {
  const steps = [
    {
      number: "01",
      title: "Recherchez",
      description: "Trouvez la voiture ideale pres de chez vous par lieu, date et type.",
      visual: "search",
      icon: Search,
    },
    {
      number: "02",
      title: "Verifiez",
      description: "Consultez les avis, les photos et les details du vehicule.",
      visual: "verify",
      icon: ShieldCheck,
    },
    {
      number: "03",
      title: "Reservez",
      description: "Reservation instantanee avec paiement securise en ligne.",
      visual: "book",
      icon: CalendarCheck,
    },
    {
      number: "04",
      title: "Roulez",
      description: "Recuperez les cles et profitez de votre trajet en toute liberte.",
      visual: "drive",
      icon: Car,
    },
  ]

  return (
    <section id="manifesto" className="py-24 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-start justify-between mb-16">
          <div>
            <span className="text-xs font-mono text-muted-foreground tracking-wider">{"◆ COMMENT_CA_MARCHE"}</span>
            <h2 className="font-serif text-4xl md:text-5xl mt-4 max-w-md leading-tight">
              De la recherche aux cles en main.
            </h2>
          </div>
          <p className="text-muted-foreground text-sm max-w-xs hidden md:block">
            Pas de paperasse. Pas de file d{"'"}attente. Juste la route.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              <div className="bg-card border border-border rounded-2xl p-6 h-full">
                {/* Visual placeholder */}
                <div className="aspect-square bg-secondary/50 rounded-xl mb-6 flex items-center justify-center relative overflow-hidden">
                  {step.visual === "search" && (
                    <div className="bg-[#fffef0] p-4 rounded shadow-sm rotate-[-2deg] border border-amber-100">
                      <p className="text-xs font-mono text-muted-foreground">DESTINATION</p>
                      <p className="text-sm font-serif italic mt-1">{"\"Paris, ce weekend\""}</p>
                    </div>
                  )}
                  {step.visual === "verify" && (
                    <div className="space-y-2 w-full px-4">
                      <div className="h-2 bg-border rounded w-3/4" />
                      <div className="h-2 bg-border rounded w-full" />
                      <div className="h-2 bg-border rounded w-2/3" />
                      <div className="flex gap-1 mt-4">
                        <div className="w-3 h-3 rounded-full bg-accent" />
                        <div className="flex-1 h-3 bg-border rounded" />
                      </div>
                    </div>
                  )}
                  {step.visual === "book" && (
                    <div className="bg-card border border-border rounded-lg p-3 shadow-sm w-4/5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono text-muted-foreground">RESERVATION</span>
                        <span className="text-[10px] font-mono text-green-600">CONFIRMEE</span>
                      </div>
                      <div className="space-y-1">
                        <div className="h-1.5 bg-border rounded w-full" />
                        <div className="h-1.5 bg-border rounded w-4/5" />
                        <div className="h-1.5 bg-border rounded w-3/4" />
                      </div>
                    </div>
                  )}
                  {step.visual === "drive" && (
                    <div className="text-center">
                      <div className="inline-flex items-center gap-2 bg-accent/50 rounded-full px-4 py-2">
                        <Car className="w-4 h-4" />
                        <span className="text-xs font-mono">EN ROUTE</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs font-mono text-muted-foreground">{step.number}</span>
                </div>
                <h3 className="font-medium text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-3 w-6 border-t border-dashed border-border" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
