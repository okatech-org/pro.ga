import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { NeuButton } from "@/components/ui/neu-button";
import { NeuCard } from "@/components/ui/neu-card";
import { NeuIconPill } from "@/components/ui/neu-icon-pill";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, Shield } from "lucide-react";
import { z } from "zod";

const loginSchema = z.object({
  identifier: z.string()
    .trim()
    .min(1, "Email ou téléphone requis"),
  code: z.string()
    .length(6, "Le code doit contenir exactement 6 chiffres")
    .regex(/^\d{6}$/, "Le code doit contenir uniquement des chiffres")
});

const signupSchema = z.object({
  lastName: z.string().trim().min(1, "Nom requis"),
  firstName: z.string().trim().min(1, "Prénom requis"),
  gender: z.enum(["M", "F"], { required_error: "Genre requis" }),
  birthDate: z.string().min(1, "Date de naissance requise"),
  birthPlace: z.string().trim().min(1, "Lieu de naissance requis"),
  phoneCountryCode: z.string().min(1, "Indicatif requis"),
  phoneNumber: z.string()
    .trim()
    .min(8, "Numéro de téléphone invalide")
    .max(15, "Numéro de téléphone trop long"),
  emailId: z.string()
    .trim()
    .email("Identifiant email invalide"),
  code: z.string()
    .length(6, "Le code doit contenir exactement 6 chiffres")
    .regex(/^\d{6}$/, "Le code doit contenir uniquement des chiffres")
});

const countryCodes = [
  { code: "+241", country: "Gabon" },
  { code: "+33", country: "France" },
  { code: "+1", country: "USA/Canada" },
  { code: "+44", country: "Royaume-Uni" },
  { code: "+237", country: "Cameroun" },
  { code: "+225", country: "Côte d'Ivoire" },
  { code: "+221", country: "Sénégal" },
  { code: "+243", country: "RD Congo" },
];

const Auth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(searchParams.get("signup") === "true");
  const [loading, setLoading] = useState(false);
  
  const [identifier, setIdentifier] = useState("");
  const [code, setCode] = useState("");
  
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [gender, setGender] = useState<"M" | "F" | "">("");
  const [birthDate, setBirthDate] = useState("");
  const [birthPlace, setBirthPlace] = useState("");
  const [phoneCountryCode, setPhoneCountryCode] = useState("+241");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailId, setEmailId] = useState("");
  const [emailSuggestions, setEmailSuggestions] = useState<string[]>([]);
  const [emailLocked, setEmailLocked] = useState(false);

  const signupCodeInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/dashboard");
      }
    });
  }, [navigate]);

  useEffect(() => {
    const normalize = (value: string) =>
      value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");

    if (!firstName && !lastName) {
      setEmailSuggestions([]);
      if (!emailLocked) setEmailId("");
      return;
    }

    const first = normalize(firstName.split(" ")[0] || "");
    const last = normalize(lastName.split(" ")[0] || "");

    const baseParts = [first, last].filter(Boolean);
    if (baseParts.length === 0) return;

    const base1 = baseParts.join(".");
    const base2 = baseParts.join("");
    const base3 = baseParts.reverse().join(".");

    const candidates = Array.from(
      new Set(
        [base1, base2, base3]
          .filter(Boolean)
          .flatMap((base) => [base, `${base}1`, `${base}2`])
      )
    ).map((id) => `${id}@pro.ga`);

    setEmailSuggestions(candidates);

    if (!emailLocked && candidates.length > 0) {
      setEmailId(candidates[0]);
    }
  }, [firstName, lastName, emailLocked]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validationResult = loginSchema.safeParse({ identifier, code });
      
      if (!validationResult.success) {
        const errors = validationResult.error.errors.map(err => err.message).join(". ");
        toast.error(errors);
        setLoading(false);
        return;
      }

      const isEmail = identifier.includes("@");
      const email = isEmail ? identifier : `${identifier.replace(/\s+/g, "")}@pro.ga`;

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: code,
      });

      if (error) throw error;

      toast.success("Connexion réussie !");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error("Identifiants incorrects. Vérifiez votre email/téléphone et code.");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validationResult = signupSchema.safeParse({
        lastName,
        firstName,
        gender,
        birthDate,
        birthPlace,
        phoneCountryCode,
        phoneNumber,
        emailId,
        code,
      });
      
      if (!validationResult.success) {
        const errors = validationResult.error.errors.map(err => err.message).join(". ");
        toast.error(errors);
        setLoading(false);
        return;
      }

      const fullPhone = `${phoneCountryCode}${phoneNumber.replace(/\s+/g, "")}`;

      let email = emailId.trim().toLowerCase();
      if (!email.includes("@")) {
        email = `${email}@pro.ga`;
      } else {
        const localPart = email.split("@")[0];
        email = `${localPart}@pro.ga`;
      }

      const { error } = await supabase.auth.signUp({
        email,
        password: code,
        options: {
          data: {
            full_name: `${firstName} ${lastName}`,
            first_name: firstName,
            last_name: lastName,
            gender,
            birth_date: birthDate,
            birth_place: birthPlace,
            phone: fullPhone,
          },
          emailRedirectTo: `${window.location.origin}/onboarding`,
        },
      });

      if (error) throw error;

      toast.success("Compte créé avec succès !");
      
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: code,
      });
      
      if (!signInError) {
        navigate("/onboarding");
      }
    } catch (error: any) {
      toast.error("Erreur lors de la création du compte");
      console.error("Signup error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <NeuButton
          variant="outline"
          onClick={() => navigate("/")}
          className="mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </NeuButton>

        <NeuCard className="p-8">
          <div className="text-center mb-8">
            <NeuIconPill icon={Shield} color="primary" size="lg" className="mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {isSignUp ? "Créer un compte" : "Connexion"}
            </h1>
            <p className="text-muted-foreground">
              {isSignUp
                ? "Commencez à gérer votre activité"
                : "Accédez à votre espace"}
            </p>
          </div>

          {!isSignUp ? (
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="identifier">Email ou Téléphone</Label>
                <Input
                  id="identifier"
                  type="text"
                  placeholder="contact@pro.ga ou +241 XX XX XX XX"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Votre email @pro.ga ou votre numéro de téléphone
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="code">Code à 6 chiffres</Label>
                <Input
                  id="code"
                  type="text"
                  inputMode="numeric"
                  placeholder="123456"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  required
                  maxLength={6}
                />
              </div>

              <NeuButton
                type="submit"
                variant="outline"
                className="w-full font-medium"
                disabled={loading}
              >
                {loading ? "Connexion..." : "Se connecter"}
              </NeuButton>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom(s)</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="DUPONT"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom(s)</Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="Jean Pierre"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Genre</Label>
                <Select value={gender} onValueChange={(val) => setGender(val as "M" | "F")}>
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="Sélectionnez" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">Masculin</SelectItem>
                    <SelectItem value="F">Féminin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="birthDate">Date de naissance</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birthPlace">Lieu de naissance</Label>
                  <Input
                    id="birthPlace"
                    type="text"
                    placeholder="Libreville"
                    value={birthPlace}
                    onChange={(e) => setBirthPlace(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Identifiant PRO.GA</Label>
                <div className="space-y-2">
                  <Input
                    type="email"
                    value={emailId}
                    onChange={(e) => {
                      setEmailLocked(true);
                      setEmailId(e.target.value);
                    }}
                    placeholder="prenom.nom@pro.ga"
                    required
                  />
                  {emailSuggestions.length > 1 && (
                    <div className="flex flex-wrap gap-2 text-xs">
                      {emailSuggestions.map((suggestion) => (
                        <button
                          key={suggestion}
                          type="button"
                          onClick={() => {
                            setEmailLocked(true);
                            setEmailId(suggestion);
                          }}
                          className={`px-3 py-1 rounded-full border text-[0.7rem] ${
                            suggestion === emailId
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-background text-muted-foreground border-border"
                          }`}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Numéro de téléphone</Label>
                <div className="flex gap-2">
                  <Select value={phoneCountryCode} onValueChange={setPhoneCountryCode}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {countryCodes.map((item) => (
                        <SelectItem key={item.code} value={item.code}>
                          {item.code} {item.country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="tel"
                    placeholder="XX XX XX XX"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                    className="flex-1"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Votre identifiant sera : {phoneCountryCode}{phoneNumber.replace(/\s+/g, "")}@pro.ga
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signupCode">Créer votre code à 6 chiffres</Label>
                <div className="flex gap-2">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <input
                      key={index}
                      ref={(el) => {
                        signupCodeInputsRef.current[index] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={code[index] || ""}
                      onChange={(e) => {
                        const digit = e.target.value.replace(/\D/g, "").slice(-1);
                        const current = code.padEnd(6, " ").split("");
                        current[index] = digit || "";
                        const nextCode = current.join("").replace(/ /g, "");
                        setCode(nextCode);
                        if (digit && index < 5) {
                          signupCodeInputsRef.current[index + 1]?.focus();
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Backspace" && !code[index] && index > 0) {
                          e.preventDefault();
                          signupCodeInputsRef.current[index - 1]?.focus();
                        }
                      }}
                      className="w-11 h-11 neu-input text-center text-lg tracking-[0.2em]"
                    />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Ce code vous servira pour vous connecter
                </p>
              </div>

              <NeuButton
                type="submit"
                variant="premium"
                className="w-full"
                disabled={loading}
              >
                {loading ? "Création..." : "Créer mon compte"}
              </NeuButton>
            </form>
          )}

          <div className="mt-6">
            <NeuButton
              onClick={() => setIsSignUp(!isSignUp)}
              variant="outline"
              className="w-full font-medium"
            >
              {isSignUp
                ? "Déjà un compte ? Connectez-vous"
                : "Pas encore de compte ? Inscrivez-vous"}
            </NeuButton>
          </div>
        </NeuCard>
      </div>
    </div>
  );
};

export default Auth;
