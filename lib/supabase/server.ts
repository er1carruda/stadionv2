// lib/supabase/server.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr';
// Importa o tipo específico para o cookieStore retornado por next/headers
import type { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

// Modificado para aceitar cookieStore como argumento
export function createClient(cookieStore: ReadonlyRequestCookies) {
  // Não chama mais cookies() aqui dentro

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Usa o cookieStore passado como argumento
        getAll() {
          // Retorna um array de objetos { name: string, value: string }
          return cookieStore.getAll();
        },
        // Usa o cookieStore passado como argumento
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          try {
            // Itera e usa o método set do cookieStore
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch (error) {
             // Ignora erros se tentar definir cookies em um contexto read-only (ex: Server Component puro)
             // O erro é mais provável de ocorrer em Server Actions se algo estiver errado.
             // console.error("Error setting cookies in Supabase server client:", error); // Opcional: logar o erro
          }
        },
      },
    }
  );
}