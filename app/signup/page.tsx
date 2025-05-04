// app/signup/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { AlertCircle, CheckCircle } from 'lucide-react';
// Importar componentes shadcn/ui (se adicionado)
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Import do Select shadcn/ui

// Defina as roles permitidas explicitamente
type UserRole = 'USER' | 'FACILITY_MANAGER' | 'INSTRUCTOR';
const availableRoles: UserRole[] = ['USER', 'FACILITY_MANAGER', 'INSTRUCTOR'];

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('USER'); // Estado para a role, padrão 'USER'
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      setLoading(false);
      return;
    }

    // Verifica se a role selecionada é válida (segurança extra)
    if (!availableRoles.includes(selectedRole)) {
        setError('Role selecionada inválida.');
        setLoading(false);
        return;
    }

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // Passa a role selecionada nos metadados
        data: {
          role: selectedRole,
          // Você pode adicionar outros dados aqui, ex: full_name se coletar
        }
      }
    });

    setLoading(false);

    if (signUpError) {
      console.error('Erro no cadastro:', signUpError.message);
      if (signUpError.message.includes('User already registered')) {
        setError('Este email já está cadastrado. Tente fazer login.');
      } else {
        setError('Ocorreu um erro ao criar a conta. Tente novamente.');
      }
    } else {
      setSuccessMessage('Cadastro realizado! Verifique seu email para confirmar a conta.');
      // Poderia limpar o form aqui
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 pt-24 flex flex-col items-center">
      <div className="w-full max-w-md p-8 space-y-6 bg-card border border-border rounded-lg shadow-sm"> {/* Usando cores do tema */}
        <h1 className="text-2xl font-semibold text-center text-card-foreground">
          Criar Nova Conta
        </h1>

        {/* Mensagens de erro/sucesso */}
        {error && (
          <div className="flex items-center gap-2 p-3 text-sm text-destructive-foreground bg-destructive/80 border border-destructive rounded-md">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}
        {successMessage && (
          <div className="flex items-center gap-2 p-3 text-sm text-emerald-700 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-600/50 rounded-md">
            <CheckCircle className="w-5 h-5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Formulário (escondido após sucesso) */}
        {!successMessage && (
          <form onSubmit={handleSignUp} className="space-y-4">
            {/* Email */}
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading}
                placeholder="seu@email.com"
              />
            </div>
            {/* Senha */}
            <div className="space-y-1">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={loading} minLength={6}
                placeholder="Mínimo 6 caracteres"
              />
            </div>
            {/* Confirmar Senha */}
            <div className="space-y-1">
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <Input
                id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required disabled={loading}
                placeholder="Repita a senha"
              />
            </div>

            {/* Seletor de Role */}
            <div className="space-y-1">
                <Label htmlFor="role">Tipo de Conta</Label>
                <Select
                    value={selectedRole}
                    onValueChange={(value: string) => setSelectedRole(value as UserRole)} // Atualiza o estado
                    disabled={loading}
                    required
                >
                    <SelectTrigger id="role">
                        <SelectValue placeholder="Selecione o tipo de conta" />
                    </SelectTrigger>
                    <SelectContent>
                        {/* Mapeia as roles disponíveis */}
                        {availableRoles.map(role => (
                            <SelectItem key={role} value={role}>
                                {/* Melhora a exibição dos nomes das roles */}
                                {role === 'USER' ? 'Usuário Padrão' :
                                 role === 'FACILITY_MANAGER' ? 'Gerente de Instalação' :
                                 role === 'INSTRUCTOR' ? 'Instrutor' : role}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Botão de Submit */}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Criando...' : 'Criar Conta'}
            </Button>
          </form>
        )}

        {/* Link para Login */}
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Já tem uma conta?{' '}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Faça login
          </Link>
        </p>
      </div>
    </div>
  );
}