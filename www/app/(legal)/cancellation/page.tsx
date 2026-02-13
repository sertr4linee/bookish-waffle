import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function CancellationPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Link>
        <h1 className="text-3xl font-serif mb-2">Politique d&apos;Annulation</h1>
        <p className="text-sm text-muted-foreground mb-8">Version 1.0 — Derniere mise a jour : fevrier 2025</p>

        <div className="prose prose-sm max-w-none space-y-6 text-foreground">
          <section>
            <h2 className="text-lg font-semibold">1. Annulation par le locataire</h2>
            <p className="text-muted-foreground">Le locataire peut annuler gratuitement une reservation jusqu&apos;a 48 heures avant le debut de la location. Au-dela, des frais d&apos;annulation de 50% du montant total seront appliques.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">2. Annulation par le proprietaire</h2>
            <p className="text-muted-foreground">Le proprietaire peut annuler une reservation a tout moment avant le debut de la location. En cas d&apos;annulations repetees, le compte pourra etre suspendu.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">3. Remboursement</h2>
            <p className="text-muted-foreground">En cas d&apos;annulation gratuite, le remboursement est integral et effectue sous 5 jours ouvrables. En cas de frais d&apos;annulation, le montant restant est rembourse dans le meme delai.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">4. Force majeure</h2>
            <p className="text-muted-foreground">En cas de force majeure (intemperies, accident, panne), l&apos;annulation est sans frais pour les deux parties sur presentation de justificatifs.</p>
          </section>
        </div>
      </div>
    </div>
  )
}
