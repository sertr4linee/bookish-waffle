"use client";

import { useState } from "react";
import { useSession, authClient, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <p className="text-sm text-zinc-500">Chargement...</p>
      </div>
    );
  }

  if (!session) {
    router.push("/sign-in");
    return null;
  }

  function startEditing() {
    setName(session!.user.name ?? "");
    setCity(session!.user.city ?? "");
    setCountry(session!.user.country ?? "");
    setDateOfBirth(session!.user.dateOfBirth ?? "");
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
    });

    if (error) {
      setError(error.message ?? "Une erreur est survenue");
    } else {
      setSuccess(true);
      setEditing(false);
    }
    setLoading(false);
  }

  const user = session.user;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      {/* Header */}
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4">
          <Link
            href="/"
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            ← Retour
          </Link>
          <button
            onClick={() =>
              signOut({
                fetchOptions: { onSuccess: () => router.push("/sign-in") },
              })
            }
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            Se deconnecter
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-10">
        {/* Avatar + name */}
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-xl font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
            {user.name?.charAt(0).toUpperCase() ?? "?"}
          </div>
          <div>
            <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              {user.name}
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {user.email}
            </p>
          </div>
        </div>

        {/* Info card */}
        <div className="mt-8 rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              Informations personnelles
            </h2>
            {!editing && (
              <button
                onClick={startEditing}
                className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              >
                Modifier
              </button>
            )}
          </div>

          {editing ? (
            <div className="space-y-4 p-6">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Nom
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-400 dark:focus:ring-zinc-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Pays
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-400 dark:focus:ring-zinc-400"
                >
                  <option value="">Selectionnez un pays</option>
                  {countries.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Ville
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-400 dark:focus:ring-zinc-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Date de naissance
                </label>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-400 dark:focus:ring-zinc-400"
                />
              </div>

              {error && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {error}
                </p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setEditing(false)}
                  className="flex flex-1 items-center justify-center rounded-lg border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex flex-1 items-center justify-center rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                >
                  {loading ? "Enregistrement..." : "Enregistrer"}
                </button>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
              <Row label="Nom" value={user.name} />
              <Row label="Email" value={user.email} />
              <Row
                label="Type"
                value={
                  user.userType === "owner" ? "Proprietaire" : "Client"
                }
              />
              <Row label="Pays" value={user.country} />
              <Row label="Ville" value={user.city} />
              <Row
                label="Date de naissance"
                value={
                  user.dateOfBirth
                    ? new Date(user.dateOfBirth).toLocaleDateString("fr-FR")
                    : undefined
                }
              />
              <Row
                label="Membre depuis"
                value={new Date(user.createdAt).toLocaleDateString("fr-FR")}
              />
            </div>
          )}
        </div>

        {success && (
          <p className="mt-4 text-center text-sm text-green-600 dark:text-green-400">
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
      <span className="text-sm text-zinc-500 dark:text-zinc-400">{label}</span>
      <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
        {value ?? "—"}
      </span>
    </div>
  );
}
