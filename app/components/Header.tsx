// app/components/Header.tsx
import Link from 'next/link';
import { cookies } from 'next/headers'; // <-- PASSO 1: Importa cookies
import { createClient } from '@/lib/supabase/server'; // Importa o helper modificado
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './theme-toggle';
import { logout } from '@/app/auth/actions'; // Importa a action de logout

export default async function Header() {
  // ---> PASSO 2: Cria o cookieStore esperando a Promise resolver <---
  const cookieStore = await cookies();
  // ---> PASSO 3: Passa o cookieStore para createClient <---
  const supabase = createClient(cookieStore);

  // Verifica o estado de autenticação no servidor
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        {/* Logo e Nome do App */}
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            {/* <Icons.logo className="h-6 w-6" /> Substitua por seu logo se tiver */}
            <img src="/logo.svg" alt="StadionApp Logo" className="h-6 w-6" /> {/* Exemplo com img */}
            <span className="font-bold inline-block">
              StadionApp
            </span>
          </Link>
          {/* Links de Navegação (Opcional) */}
          {/* <nav className="flex items-center gap-6 text-sm">
            <Link
              href="/facilities"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Instalações
            </Link>
             <Link
              href="/instructors"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Instrutores
            </Link>
          </nav> */}
        </div>

        {/* Botões de Ação (Login/Logout, Theme) */}
        <div className="flex flex-1 items-center justify-end space-x-2">
          <ThemeToggle />
          {user ? (
            // Se logado, mostra botão de Logout (que usa Server Action)
            <form action={logout}>
              <Button variant="outline" size="sm">Logout</Button>
            </form>
          ) : (
            // Se deslogado, mostra botão de Login
            <Button asChild variant="outline" size="sm">
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}