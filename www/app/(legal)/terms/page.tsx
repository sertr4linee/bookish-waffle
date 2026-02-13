import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Link>
        <h1 className="text-3xl font-serif mb-2">Conditions Generales d&apos;Utilisation</h1>
        <p className="text-sm text-muted-foreground mb-8">Version 1.0 — Derniere mise a jour : fevrier 2025</p>

        <div className="prose prose-sm max-w-none space-y-6 text-foreground">
          <section>
            <h2 className="text-lg font-semibold">1. Objet</h2>
            <p className="text-muted-foreground">Les presentes Conditions Generales d&apos;Utilisation (CGU) regissent l&apos;utilisation de la plateforme AutoLoc, service de mise en relation entre proprietaires et locataires de vehicules entre particuliers.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">2. Inscription</h2>
            <p className="text-muted-foreground">L&apos;inscription est gratuite et ouverte a toute personne majeure. L&apos;utilisateur s&apos;engage a fournir des informations exactes et a jour. Tout compte cree avec de fausses informations pourra etre suspendu.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">3. Role des utilisateurs</h2>
            <p className="text-muted-foreground">La plateforme distingue deux roles : le proprietaire, qui met son vehicule en location, et le locataire, qui reserve un vehicule. Un meme utilisateur ne peut avoir qu&apos;un seul role a la fois.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">4. Reservations</h2>
            <p className="text-muted-foreground">Les reservations sont soumises a l&apos;acceptation du proprietaire. Une fois confirmee, la reservation engage les deux parties. Les conditions d&apos;annulation sont decrites dans la politique d&apos;annulation.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">5. Responsabilites</h2>
            <p className="text-muted-foreground">AutoLoc agit en tant qu&apos;intermediaire et ne peut etre tenu responsable des dommages survenant lors d&apos;une location. Chaque utilisateur est responsable du respect des lois en vigueur.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">6. Modification des CGU</h2>
            <p className="text-muted-foreground">AutoLoc se reserve le droit de modifier les presentes CGU a tout moment. Les utilisateurs seront informes par email de toute modification substantielle.</p>
          </section>
        </div>
      </div>
    </div>
  )
}
