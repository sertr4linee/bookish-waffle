"use client";

import { useState, useEffect } from "react";
import { useSession, authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Car, Building2 } from "lucide-react";

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

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/sign-in");
    } else if ((session?.user as Record<string, unknown>)?.userType) {
      router.push("/");
    }
  }, [isPending, session, router]);

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  if (!session || (session.user as Record<string, unknown>).userType) {
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
    } as Record<string, unknown>);

    if (error) {
      setError(error.message ?? "Une erreur est survenue");
      setLoading(false);
    } else {
      router.push("/");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Progress */}
        <div className="flex items-center gap-2">
          {[1, 2].map((s) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                s <= step ? "bg-primary" : "bg-secondary"
              }`}
            />
          ))}
        </div>

        {/* Step 1: Role selection */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-serif tracking-tight text-foreground">
                Bienvenue, {session.user.name}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Quel est votre profil ?
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setUserType("owner")}
                className={`flex flex-col items-center gap-3 rounded-xl border-2 p-6 transition-all ${
                  userType === "owner"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/40"
                }`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                  <Building2 className="w-5 h-5 text-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Proprietaire</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Je propose des vehicules
                  </p>
                </div>
              </button>

              <button
                onClick={() => setUserType("customer")}
                className={`flex flex-col items-center gap-3 rounded-xl border-2 p-6 transition-all ${
                  userType === "customer"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/40"
                }`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                  <Car className="w-5 h-5 text-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Client</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Je cherche un vehicule
                  </p>
                </div>
              </button>
            </div>

            <button
              onClick={() => userType && setStep(2)}
              disabled={!userType}
              className="flex w-full items-center justify-center rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              Continuer
            </button>
          </div>
        )}

        {/* Step 2: Personal info */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-serif tracking-tight text-foreground">
                Vos informations
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Completez votre profil
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-foreground">
                  Pays
                </label>
                <select
                  id="country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
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
                <label htmlFor="city" className="block text-sm font-medium text-foreground">
                  Ville
                </label>
                <input
                  id="city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Votre ville"
                />
              </div>

              <div>
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-foreground">
                  Date de naissance
                </label>
                <input
                  id="dateOfBirth"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex flex-1 items-center justify-center rounded-full border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
              >
                Retour
              </button>
              <button
                onClick={handleFinish}
                disabled={loading || !city || !country || !dateOfBirth}
                className="flex flex-1 items-center justify-center rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
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
