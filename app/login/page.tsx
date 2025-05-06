// app/login/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { AlertCircle, MailCheck } from 'lucide-react'; // Ícones
import { Button } from '@/components/ui/button'; // Usando shadcn
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null); // Para feedback (ex: reenvio)
  const [loading, setLoading] = useState(false);
  // Estado para controlar se o erro é de email não confirmado
  const [isEmailNotConfirmedError, setIsEmailNotConfirmedError] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setInfoMessage(null);
    setIsEmailNotConfirmedError(false); // Reseta o estado específico

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      console.error('Erro no login:', signInError); // Log detalhado para debug

      // Verifica se o erro é sobre email não confirmado
      // A mensagem exata pode variar um pouco, mas geralmente contém "confirm"
      if (signInError.message.toLowerCase().includes('email not confirmed')) {
        setError('Seu email ainda não foi confirmado. Por favor, verifique sua caixa de entrada (e spam).');
        setIsEmailNotConfirmedError(true); // Indica que é este erro específico
      } else {
        setError('Email ou senha inválidos.');
      }
    } else {
      // Login bem-sucedido
      router.push('/');
      router.refresh();
    }
  };

  // Função para reenviar email de confirmação
  const handleResendConfirmation = async () => {
      if (!email) {
          setError("Digite seu email no campo acima para reenviar a confirmação.");
          return;
      }
      setLoading(true);
      setError(null);
      setInfoMessage(null);

      const { error: resendError } = await supabase.auth.resend({
          type: 'signup', // Tipo de email a reenviar
          email: email,
      });

      setLoading(false);

      if (resendError) {
          console.error("Erro ao reenviar confirmação:", resendError);
          setError("Erro ao reenviar o email de confirmação. Tente novamente mais tarde.");
          setIsEmailNotConfirmedError(true); // Mantém o contexto do erro original
      } else {
          setInfoMessage("Email de confirmação reenviado com sucesso! Verifique sua caixa de entrada.");
          setIsEmailNotConfirmedError(false); // Limpa o estado de erro específico após sucesso no reenvio
      }
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-24 flex flex-col items-center">
      {/* Usando cores do tema (card, border, etc) */}
      <div className="w-full max-w-md p-8 space-y-6 bg-card border border-border rounded-lg shadow-sm">
        <h1 className="text-2xl font-semibold text-center text-card-foreground">
          Acessar Conta
        </h1>

        {/* Mensagem de Erro */}
        {error && (
          <div className={`flex items-start gap-3 p-3 text-sm rounded-md border ${
              isEmailNotConfirmedError
              ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-300 dark:border-yellow-600/50' // Estilo de aviso
              : 'bg-destructive/10 text-destructive border-destructive/30' // Estilo de erro padrão
          }`}>
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div className='flex-grow'>
                <span>{error}</span>
                {/* Botão de Reenvio Condicional */}
                {isEmailNotConfirmedError && (
                    <Button
                        variant="link"
                        size="sm"
                        onClick={handleResendConfirmation}
                        disabled={loading}
                        className="p-0 h-auto mt-1 text-yellow-900 dark:text-yellow-200 hover:underline"
                    >
                        Reenviar email de confirmação
                    </Button>
                )}
            </div>
          </div>
        )}

         {/* Mensagem de Informação (Ex: sucesso no reenvio) */}
         {infoMessage && (
           <div className="flex items-center gap-2 p-3 text-sm text-emerald-700 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-600/50 rounded-md">
            <MailCheck className="w-5 h-5" />
            <span>{infoMessage}</span>
          </div>
        )}

        <form onSubmit={handleSignIn} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading}
              placeholder="seu@email.com"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={loading}
              placeholder="••••••••"
            />
            {/* TODO: Link "Esqueci minha senha" */}
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Não tem uma conta?{' '}
          <Link href="/signup" className="font-medium text-primary hover:underline">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
}