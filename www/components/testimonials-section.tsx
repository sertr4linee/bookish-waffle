export default function TestimonialsSection() {
  const testimonials = [
    {
      id: "LOC-0088",
      quote:
        "J'ai loue une Clio pour le weekend en moins de 5 minutes. Le proprietaire etait super sympa et la voiture impeccable. Je n'utilise plus les agences classiques.",
      author: "Sophie Martin",
      role: "LOCATAIRE - PARIS",
    },
    {
      id: "LOC-2301",
      quote:
        "Ma voiture restait au garage 5 jours par semaine. Maintenant elle me rapporte 400 EUR par mois. AutoLoc a change ma facon de voir mon vehicule.",
      author: "Karim Benzaoui",
      role: "PROPRIETAIRE - LYON",
    },
    {
      id: "LOC-7725",
      quote:
        "L'assurance incluse et le paiement securise m'ont convaincu. En tant que proprietaire, je suis serein a chaque location. Le service client est au top.",
      author: "Claire Dubois",
      role: "PROPRIETAIRE - BORDEAUX",
    },
    {
      id: "LOC-0030",
      quote:
        "Pour mes deplacements pro, c'est devenu un reflexe. Plus flexible et moins cher qu'une agence. J'ai toujours une voiture adaptee a mes besoins.",
      author: "Thomas Leclerc",
      role: "LOCATAIRE - MARSEILLE",
    },
    {
      id: "LOC-2134",
      quote: "L'interface est claire, la reservation est rapide. J'ai loue un utilitaire pour mon demenagement en 3 clics. Bravo.",
      author: "Amina Sall",
      role: "LOCATAIRE - LILLE",
    },
  ]

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-10 md:mb-16 gap-4">
          <div>
            <span className="text-xs font-mono text-muted-foreground tracking-wider">{"◆ TEMOIGNAGES"}</span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl mt-4 max-w-md leading-tight">
              Ils roulent avec AutoLoc
            </h2>
          </div>
          <p className="text-muted-foreground text-sm max-w-xs hidden md:block">
            Retours authentiques de notre communaute.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.slice(0, 3).map((testimonial) => (
            <div key={testimonial.id} className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-muted-foreground">REF</span>
                <span className="text-xs font-mono text-primary">{testimonial.id}</span>
                <div className="w-12 h-12 bg-secondary rounded-lg" />
              </div>
              <p className="text-sm leading-relaxed mb-6">{testimonial.quote}</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{testimonial.author}</p>
                  <p className="text-xs font-mono text-muted-foreground">{testimonial.role}</p>
                </div>
                <div className="w-4 h-4 border border-border rounded flex items-center justify-center">
                  <span className="text-[8px]">{"↗"}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-6">
          {testimonials.slice(3, 4).map((testimonial) => (
            <div key={testimonial.id} className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-muted-foreground">REF</span>
                <span className="text-xs font-mono text-primary">{testimonial.id}</span>
                <div className="w-12 h-12 bg-secondary rounded-lg" />
              </div>
              <p className="text-sm leading-relaxed mb-6">{testimonial.quote}</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{testimonial.author}</p>
                  <p className="text-xs font-mono text-muted-foreground">{testimonial.role}</p>
                </div>
                <div className="w-4 h-4 border border-border rounded flex items-center justify-center">
                  <span className="text-[8px]">{"↗"}</span>
                </div>
              </div>
            </div>
          ))}

          {/* Join CTA */}
          <div className="bg-secondary/50 border border-dashed border-border rounded-2xl p-6 flex flex-col items-center justify-center text-center">
            <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center mb-3">
              <span className="text-lg">+</span>
            </div>
            <span className="text-sm font-mono text-muted-foreground">VOTRE AVIS ICI</span>
            <p className="text-sm text-muted-foreground mt-1">Rejoignez la communaute.</p>
          </div>

          {testimonials.slice(4).map((testimonial) => (
            <div key={testimonial.id} className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-muted-foreground">REF</span>
                <span className="text-xs font-mono text-primary">{testimonial.id}</span>
                <div className="w-12 h-12 bg-secondary rounded-lg" />
              </div>
              <p className="text-sm leading-relaxed mb-6">{testimonial.quote}</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{testimonial.author}</p>
                  <p className="text-xs font-mono text-muted-foreground">{testimonial.role}</p>
                </div>
                <div className="w-4 h-4 border border-border rounded flex items-center justify-center">
                  <span className="text-[8px]">{"↗"}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
