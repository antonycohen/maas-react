import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@maas/core-utils';
import { Input, Tabs, TabsList, TabsTrigger, TabsContent } from '@maas/web-components';
import { loginWithPassword, maasApi, ApiError } from '@maas/core-api';
import { useOAuthStore } from '@maas/core-store-oauth';

interface LoginFormData {
    email: string;
    password: string;
}

interface RegisterFormData {
    firstName?: string;
    lastName?: string;
    email: string;
    password: string;
    confirmPassword: string;
}

function LoginForm({ onSuccess }: { onSuccess: () => void }) {
    const [form, setForm] = useState<LoginFormData>({ email: '', password: '' });
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const setAuth = useOAuthStore((s) => s.setAuth);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!form.email.trim() || !form.password.trim()) {
            setError('Veuillez remplir tous les champs.');
            return;
        }

        setIsLoading(true);

        try {
            const tokens = await loginWithPassword(form.email, form.password);
            setAuth({
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                accessTokenExpirationDate: tokens.expiresAt,
            });
            onSuccess();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Identifiants invalides.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
                <label className="text-foreground text-sm font-medium">Email</label>
                <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="jean@exemple.fr"
                    autoComplete="email"
                />
            </div>

            <div className="flex flex-col gap-1.5">
                <label className="text-foreground text-sm font-medium">Mot de passe</label>
                <Input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                    placeholder="••••••••"
                    autoComplete="current-password"
                />
            </div>

            {error && <p className="text-destructive text-sm">{error}</p>}

            <button
                type="submit"
                disabled={isLoading}
                className={cn(
                    'bg-brand-primary hover:bg-brand-primary/90 flex h-12 w-full cursor-pointer items-center justify-center rounded-lg px-6 text-sm font-semibold text-white transition-colors',
                    isLoading && 'cursor-wait opacity-70'
                )}
            >
                {isLoading ? 'Connexion...' : 'Se connecter'}
            </button>
        </form>
    );
}

function RegisterForm({ onSuccess }: { onSuccess: () => void }) {
    const [form, setForm] = useState<RegisterFormData>({
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState<Partial<Record<keyof RegisterFormData, string>>>({});
    const [globalError, setGlobalError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const setAuth = useOAuthStore((s) => s.setAuth);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setGlobalError(null);

        const newErrors: Partial<Record<keyof RegisterFormData, string>> = {};
        if (!form.email.trim()) newErrors.email = "L'email est requis";
        if (!form.password.trim()) newErrors.password = 'Le mot de passe est requis';
        if (form.password.length > 0 && form.password.length < 8)
            newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
        if (form.password !== form.confirmPassword)
            newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        setIsLoading(true);

        try {
            await maasApi.users.createUser({
                email: form.email,
                password: form.password,
            });

            // Auto-login after successful registration
            const tokens = await loginWithPassword(form.email, form.password);
            setAuth({
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                accessTokenExpirationDate: tokens.expiresAt,
            });
            onSuccess();
        } catch (err) {
            if (err instanceof ApiError && err.parametersErrors) {
                const fieldErrors: Partial<Record<keyof RegisterFormData, string>> = {};
                for (const [key, messages] of Object.entries(err.parametersErrors)) {
                    if (key in form && Array.isArray(messages) && messages.length > 0) {
                        fieldErrors[key as keyof RegisterFormData] = messages[0];
                    }
                }
                if (Object.keys(fieldErrors).length > 0) {
                    setErrors(fieldErrors);
                } else {
                    setGlobalError(err.message || 'Une erreur est survenue.');
                }
            } else {
                setGlobalError(err instanceof Error ? err.message : 'Une erreur est survenue.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
                <label className="text-foreground text-sm font-medium">Email</label>
                <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="jean@exemple.fr"
                    autoComplete="email"
                    aria-invalid={!!errors.email}
                />
                {errors.email && <span className="text-destructive text-xs">{errors.email}</span>}
            </div>

            <div className="flex flex-col gap-1.5">
                <label className="text-foreground text-sm font-medium">Mot de passe</label>
                <Input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    aria-invalid={!!errors.password}
                />
                {errors.password && <span className="text-destructive text-xs">{errors.password}</span>}
            </div>

            <div className="flex flex-col gap-1.5">
                <label className="text-foreground text-sm font-medium">Confirmer le mot de passe</label>
                <Input
                    type="password"
                    value={form.confirmPassword}
                    onChange={(e) => setForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    aria-invalid={!!errors.confirmPassword}
                />
                {errors.confirmPassword && <span className="text-destructive text-xs">{errors.confirmPassword}</span>}
            </div>

            {globalError && <p className="text-destructive text-sm">{globalError}</p>}

            <button
                type="submit"
                disabled={isLoading}
                className={cn(
                    'bg-brand-primary hover:bg-brand-primary/90 flex h-12 w-full cursor-pointer items-center justify-center rounded-lg px-6 text-sm font-semibold text-white transition-colors',
                    isLoading && 'cursor-wait opacity-70'
                )}
            >
                {isLoading ? 'Création...' : 'Créer mon compte'}
            </button>
        </form>
    );
}

export function PricingAuthStep() {
    const navigate = useNavigate();

    const handleAuthSuccess = () => {
        navigate('/pricing/informations');
    };

    return (
        <div className="animate-in fade-in slide-in-from-top-4 w-full duration-300">
            <div className="border-border bg-background rounded-xl border p-6 md:p-8">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <p className="text-text-secondary text-xs font-semibold tracking-wide uppercase">
                            Connectez-vous pour continuer
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/pricing')}
                        className="text-text-secondary hover:text-foreground cursor-pointer text-sm font-medium transition-colors"
                    >
                        Retour
                    </button>
                </div>

                <Tabs defaultValue="login">
                    <TabsList className="mb-6 w-full">
                        <TabsTrigger value="login" className="flex-1">
                            J&rsquo;ai déjà un compte
                        </TabsTrigger>
                        <TabsTrigger value="register" className="flex-1">
                            Créer un compte
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="login">
                        <LoginForm onSuccess={handleAuthSuccess} />
                    </TabsContent>

                    <TabsContent value="register">
                        <RegisterForm onSuccess={handleAuthSuccess} />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
