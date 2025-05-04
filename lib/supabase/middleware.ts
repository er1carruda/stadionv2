// lib/supabase/middleware.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

export async function createClient(request: NextRequest) {
  // Cria uma resposta base que será modificada se cookies precisarem ser setados/removidos.
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Cria a instância do cliente Supabase específica para Middleware.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Função para ler um cookie da requisição
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        // Função para definir um cookie na resposta
        set(name: string, value: string, options: CookieOptions) {
          // Adiciona o cookie à requisição e à resposta para consistência
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          response.cookies.set({ name, value, ...options })
        },
        // Função para remover um cookie da resposta
        remove(name: string, options: CookieOptions) {
          // Remove o cookie da requisição e da resposta
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // Retorna tanto a instância do Supabase quanto a resposta (potencialmente modificada)
  return { supabase, response }
}