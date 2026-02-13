import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Link>
        <h1 className="text-3xl font-serif mb-2">Politique de Confidentialite</h1>
        <p className="text-sm text-muted-foreground mb-8">Version 1.0 — Derniere mise a jour : fevrier 2025</p>

        <div className="prose prose-sm max-w-none space-y-6 text-foreground">
          <section>
            <h2 className="text-lg font-semibold">1. Donnees collectees</h2>
            <p className="text-muted-foreground">Nous collectons les donnees necessaires au fonctionnement du service : nom, email, date de naissance, ville, pays, ainsi que les donnees relatives aux vehicules et reservations.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">2. Utilisation des donnees</h2>
            <p className="text-muted-foreground">Vos donnees sont utilisees uniquement pour le fonctionnement de la plateforme : gestion de compte, mise en relation, traitement des reservations et communication entre utilisateurs.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">3. Stockage et securite</h2>
            <p className="text-muted-foreground">Les donnees sont stockees de maniere securisee. Les mots de passe sont chiffres. Nous ne vendons ni ne partageons vos donnees personnelles avec des tiers a des fins commerciales.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">4. Cookies</h2>
            <p className="text-muted-foreground">Nous utilisons des cookies essentiels au fonctionnement du service (session, authentification). Aucun cookie publicitaire n&apos;est utilise.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">5. Vos droits</h2>
            <p className="text-muted-foreground">Conformement au RGPD, vous disposez d&apos;un droit d&apos;acces, de rectification et de suppression de vos donnees. Contactez-nous a privacy@autoloc.fr pour exercer vos droits.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">6. Conservation</h2>
            <p className="text-muted-foreground">Vos donnees sont conservees tant que votre compte est actif. En cas de suppression de compte, vos donnees seront effacees dans un delai de 30 jours.</p>
          </section>
        </div>
      </div>
    </div>
  )
}
