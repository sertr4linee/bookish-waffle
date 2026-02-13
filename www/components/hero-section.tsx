import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Main hero area */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground border border-border rounded-full px-3 py-1">
              <span>PLATEFORME DE LOCATION AUTO V1.0</span>
            </div>

            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-[1.1] text-balance">
              Louez la voiture
              <br />
              {"qu'il vous faut."}
            </h1>

            <p className="text-muted-foreground text-lg max-w-md">{"Proprietaires et locataires, connectes en un clic. Simple, securise, local."}</p>

            <Link href="/sign-up" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full text-sm font-medium hover:bg-primary/90 transition-colors">
              Trouver une voiture
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Right visual */}
          <div className="relative">
            {/* Interface mockup container */}
            <div className="relative bg-secondary/50 rounded-3xl p-8 border border-border/50">
              {/* Top labels */}
              <div className="flex justify-between text-[10px] font-mono text-muted-foreground mb-4">
                <span>NO.01 — INTERFACE:RESERVATION</span>
                <span>CONNEXION_SECURISEE</span>
              </div>

              {/* Sticky note */}
              <div className="absolute -left-4 top-20 bg-[#fffef0] p-3 rounded shadow-sm rotate-[-3deg] border border-amber-100 w-36">
                <p className="text-xs font-mono text-foreground/80">RECHERCHE</p>
                <p className="text-sm font-serif italic mt-1">{"\"SUV ce weekend\""}</p>
              </div>

              {/* Car image card */}
              <div className="bg-[#4a5d52] rounded-2xl p-6 my-6 mx-auto max-w-sm">
                <div className="flex justify-between text-[8px] text-primary-foreground/70 font-mono mb-2 px-2">
                  <span>VEHICULE DISPONIBLE</span>
                  <span>RESERVATION</span>
                </div>
                <div className="rounded-xl overflow-hidden mb-3">
                  <Image
                    src="/images/hero-car.jpg"
                    alt="SUV disponible a la location"
                    width={400}
                    height={250}
                    className="w-full h-40 object-cover"
                  />
                </div>
                <div className="text-[10px] text-primary-foreground/80 font-mono px-2">
                  <p>Peugeot 3008 GT - 2024</p>
                  <p>Paris 11e - 45 EUR/jour</p>
                </div>
              </div>

              {/* Chat bubbles */}
              <div className="absolute -right-2 top-32 space-y-2">
                <div className="bg-card border border-border rounded-xl p-3 shadow-sm max-w-[180px]">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-secondary rounded-full" />
                    <span className="text-xs font-medium">Marc Dupont</span>
                    <span className="text-[10px] text-muted-foreground">PROPRIO</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Bonjour,</p>
                </div>

                <div className="bg-card border border-border rounded-xl p-3 shadow-sm max-w-[200px]">
                  <p className="text-xs text-muted-foreground">
                    {"La voiture est disponible ce weekend. Je vous confirme la reservation..."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
