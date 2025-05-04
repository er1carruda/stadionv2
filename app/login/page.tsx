// app/login/page.tsx
'use client' // Indica que este é um Client Component

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client' // Cliente Supabase para o navegador
import { useRouter } from 'next/navigation'
import { AlertCircle } from 'lucide-react' // Ícone para erros

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null) // Estado para mensagem de erro
  const [loading, setLoading] = useState(false) // Estado para feedback de carregamento
  const router = useRouter()
  const supabase = createClient() // Cria instância do cliente client-side

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault() // Previne o refresh padrão do form
    setLoading(true) // Ativa o loading
    setError(null) // Limpa erros anteriores

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false) // Desativa o loading

    if (signInError) {
      console.error('Erro no login:', signInError.message)
      setError('Email ou senha inválidos.') // Mensagem genérica para o usuário
    } else {
      // Login bem-sucedido
      router.push('/') // Redireciona para a página inicial após login
      router.refresh() // Força o refresh para atualizar o estado da sessão no servidor/layout
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-24 flex flex-col items-center">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-900 border border-black/[.08] dark:border-white/[.145] rounded-lg shadow-sm">
        <h1 className="text-2xl font-semibold text-center text-foreground">
          Acessar Conta
        </h1>

        {/* Exibe mensagem de erro se houver */}
        {error && (
          <div className="flex items-center gap-2 p-3 text-sm text-red-700 bg-red-100 dark:bg-red-900/30 dark:text-red-400 border border-red-300 dark:border-red-600/50 rounded-md">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading} // Desabilita input durante o loading
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm bg-white dark:bg-gray-800 text-foreground disabled:opacity-50"
              placeholder="seu@email.com"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading} // Desabilita input durante o loading
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm bg-white dark:bg-gray-800 text-foreground disabled:opacity-50"
              placeholder="••••••••"
            />
            {/* Adicionar link "Esqueci minha senha" aqui se necessário */}
          </div>
          <button
            type="submit"
            disabled={loading} // Desabilita botão durante o loading
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-950 dark:bg-gray-700 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Não tem uma conta?{' '}
          <Link href="/signup" className="font-medium text-gray-800 hover:text-black dark:text-gray-300 dark:hover:text-white underline">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  )
}