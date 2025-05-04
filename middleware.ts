// middleware.ts (na raiz do projeto)

import { type NextRequest, NextResponse } from 'next/server'
// Importa o helper específico para middleware que criamos
import { createClient } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  // Cria o cliente Supabase e obtém a resposta inicial (NextResponse.next())
  const { supabase, response } = await createClient(request)

  // *** ESSENCIAL: Atualiza a sessão do usuário baseado no cookie ***
  // Isso garante que a informação de autenticação esteja sempre fresca.
  await supabase.auth.getSession()

  // ------------------------------------------------------------------
  // OPCIONAL: Lógica de Proteção de Rota (Exemplo)
  // Descomente e ajuste se precisar proteger rotas específicas
  // ------------------------------------------------------------------
  // const { data: { user } } = await supabase.auth.getUser();
  // const protectedPaths = ['/dashboard', '/profile']; // Exemplo de rotas protegidas

  // // Se o usuário não está logado E está tentando acessar uma rota protegida
  // if (!user && protectedPaths.some(path => request.nextUrl.pathname.startsWith(path))) {
  //   // Redireciona para a página de login
  //   return NextResponse.redirect(new URL('/login', request.url));
  // }

  // // Se o usuário ESTÁ logado E está tentando acessar login/signup, redireciona para home
  // if (user && (request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/signup'))) {
  //   return NextResponse.redirect(new URL('/', request.url));
  // }
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