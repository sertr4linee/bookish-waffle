"use client";

import { useState } from "react";
import { useSession, authClient, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, LogOut } from "lucide-react";

const countries = [
  "France",
  "Belgique",
  "Suisse",
  "Canada",
  "Maroc",
  "Algerie",
  "Tunisie",
  "Senegal",
  "Cote d'Ivoire",
  "Luxembourg",
];

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  if (!session) {
    router.push("/sign-in");
    return null;
  }

  function startEditing() {
    const u = session!.user as Record<string, unknown>;
    setName((u.name as string) ?? "");
    setCity((u.city as string) ?? "");
    setCountry((u.country as string) ?? "");
    setDateOfBirth((u.dateOfBirth as string) ?? "");
    setError("");
    setSuccess(false);
    setEditing(true);
  }

  async function handleSave() {
    setError("");
    setLoading(true);

    const { error } = await authClient.updateUser({
      name,
      city,
      country,
      dateOfBirth,
    } as Record<string, unknown>);

    if (error) {
      setError(error.message ?? "Une erreur est survenue");
    } else {
      setSuccess(true);
      setEditing(false);
    }
    setLoading(false);
  }

  const user = session.user as Record<string, unknown>;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Link>
          <button
            onClick={() =>
              signOut({
                fetchOptions: { onSuccess: () => router.push("/sign-in") },
              })
            }
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Se deconnecter
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-10">
        {/* Avatar + name */}
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary text-xl font-semibold text-primary-foreground">
            {(user.name as string)?.charAt(0).toUpperCase() ?? "?"}
          </div>
          <div>
            <h1 className="text-xl font-serif text-foreground">
              {user.name as string}
            </h1>
            <p className="text-sm text-muted-foreground">
              {user.email as string}
            </p>
          </div>
        </div>

        {/* Info card */}
        <div className="mt-8 rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <h2 className="text-sm font-semibold text-foreground">
              Informations personnelles
            </h2>
            {!editing && (
              <button
                onClick={startEditing}
                className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Modifier
              </button>
            )}
          </div>

          {editing ? (
            <div className="space-y-4 p-6">
              <div>
                <label className="block text-sm font-medium text-foreground">Nom</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground">Pays</label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="">Selectionnez un pays</option>
                  {countries.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground">Ville</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground">Date de naissance</label>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setEditing(false)}
                  className="flex flex-1 items-center justify-center rounded-full border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex flex-1 items-center justify-center rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                >
                  {loading ? "Enregistrement..." : "Enregistrer"}
                </button>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-border">
              <Row label="Nom" value={user.name as string} />
              <Row label="Email" value={user.email as string} />
              <Row
                label="Type"
                value={user.userType === "owner" ? "Proprietaire" : "Client"}
              />
              <Row label="Pays" value={user.country as string} />
              <Row label="Ville" value={user.city as string} />
              <Row
                label="Date de naissance"
                value={
                  user.dateOfBirth
                    ? new Date(user.dateOfBirth as string).toLocaleDateString("fr-FR")
                    : undefined
                }
              />
              <Row
                label="Membre depuis"
                value={new Date(user.createdAt as string).toLocaleDateString("fr-FR")}
              />
            </div>
          )}
        </div>

        {success && (
          <p className="mt-4 text-center text-sm text-primary font-medium">
            Profil mis a jour avec succes
          </p>
        )}
      </main>
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex items-center justify-between px-6 py-3.5">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground">
        {value ?? "—"}
      </span>
    </div>
  );
}
