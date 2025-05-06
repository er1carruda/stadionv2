// middleware.ts (na raiz do projeto)

import { type NextRequest, NextResponse } from 'next/server'
// Importa o helper específico para middleware que criamos e corrigimos
import { createClient } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  // Cria o cliente Supabase e obtém a resposta inicial (NextResponse.next())
  // REMOVIDO O 'await' DAQUI:
  const { supabase, response } = createClient(request)

  // *** ESSENCIAL: Atualiza a sessão do usuário baseado no cookie ***
  // Isso garante que a informação de autenticação esteja sempre fresca.
  // ESTE 'await' está correto pois getSession() é async
  await supabase.auth.getSession()

  // ------------------------------------------------------------------
  // OPCIONAL: Lógica de Proteção de Rota (Exemplo)
  // ... (lógica comentada permanece igual) ...
  // ------------------------------------------------------------------

  // Retorna a resposta (pode conter cookies atualizados pelo Supabase)
  return response
}

// Configuração do Matcher: Define quais rotas passarão pelo middleware.
// Este padrão tenta cobrir a maioria das rotas de página, excluindo arquivos estáticos.
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}