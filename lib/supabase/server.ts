// lib/supabase/server.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  // Obtém o armazenamento de cookies do Next.js para o contexto atual.
  const cookieStore = cookies()

  // Cria a instância do cliente Supabase para uso no Servidor.
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Função para ler um cookie
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        // Função para definir um cookie (pode falhar em Server Components, por isso o try/catch)
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // Ignora erros se tentar definir cookie em um contexto read-only (Server Component)
          }
        },
        // Função para remover um cookie (pode falhar em Server Components, por isso o try/catch)
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
             // Ignora erros se tentar remover cookie em um contexto read-only (Server Component)
          }
        },
      },
    }
  )
}