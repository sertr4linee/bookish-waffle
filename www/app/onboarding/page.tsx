"use client";

import { useState, useEffect } from "react";
import { useSession, authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

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

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState<"owner" | "customer" | null>(null);
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <p className="text-sm text-zinc-500">Chargement...</p>
      </div>
    );
  }

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/sign-in");
    } else if (session?.user.userType) {
      router.push("/");
    }
  }, [isPending, session, router]);

  if (!session || session.user.userType) {
    return null;
  }

  async function handleFinish() {
    if (!userType || !city || !country || !dateOfBirth) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    setError("");
    setLoading(true);

    const { error } = await authClient.updateUser({
      userType,
      city,
      country,
      dateOfBirth,
    });

    if (error) {
      setError(error.message ?? "Une erreur est survenue");
      setLoading(false);
    } else {
      router.push("/");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-black">
      <div className="w-full max-w-md space-y-8">
        {/* Progress */}
        <div className="flex items-center gap-2">
          {[1, 2].map((s) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                s <= step
                  ? "bg-zinc-900 dark:bg-zinc-100"
                  : "bg-zinc-200 dark:bg-zinc-800"
              }`}
            />
          ))}
        </div>

        {/* Step 1: Role selection */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                Bienvenue, {session.user.name}
              </h1>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                Quel est votre profil ?
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setUserType("owner")}
                className={`flex flex-col items-center gap-3 rounded-xl border-2 p-6 transition-all ${
                  userType === "owner"
                    ? "border-zinc-900 bg-zinc-900/5 dark:border-zinc-100 dark:bg-zinc-100/5"
                    : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700"
                }`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-2xl dark:bg-zinc-800">
                  🏢
                </div>
                <div>
                  <p className="font-medium text-zinc-900 dark:text-zinc-50">
                    Proprietaire
                  </p>
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    Je propose des vehicules
                  </p>
                </div>
              </button>

              <button
                onClick={() => setUserType("customer")}
                className={`flex flex-col items-center gap-3 rounded-xl border-2 p-6 transition-all ${
                  userType === "customer"
                    ? "border-zinc-900 bg-zinc-900/5 dark:border-zinc-100 dark:bg-zinc-100/5"
                    : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700"
                }`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-2xl dark:bg-zinc-800">
                  🚗
                </div>
                <div>
                  <p className="font-medium text-zinc-900 dark:text-zinc-50">
                    Client
                  </p>
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    Je cherche un vehicule
                  </p>
                </div>
              </button>
            </div>

            <button
              onClick={() => userType && setStep(2)}
              disabled={!userType}
              className="flex w-full items-center justify-center rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Continuer
            </button>
          </div>
        )}

        {/* Step 2: Personal info */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                Vos informations
              </h1>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                Completez votre profil
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="country"
                  className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Pays
                </label>
                <select
                  id="country"
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
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Ville
                </label>
                <input
                  id="city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-zinc-400 dark:focus:ring-zinc-400"
                  placeholder="Votre ville"
                />
              </div>

              <div>
                <label
                  htmlFor="dateOfBirth"
                  className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Date de naissance
                </label>
                <input
                  id="dateOfBirth"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-400 dark:focus:ring-zinc-400"
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex flex-1 items-center justify-center rounded-lg border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Retour
              </button>
              <button
                onClick={handleFinish}
                disabled={loading || !city || !country || !dateOfBirth}
                className="flex flex-1 items-center justify-center rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                {loading ? "Enregistrement..." : "Terminer"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
