// app/components/Header.tsx
import Link from 'next/link';
import Image from 'next/image';
import { Home, Building, Users, LogOut, LogIn, UserPlus } from 'lucide-react'; // Adiciona ícones de login/logout/signup
import { ThemeToggle } from './theme-toggle';
import { createClient } from '@/lib/supabase/server'; // Importa o cliente server-side
import { Button } from '@/components/ui/button'; // Importa o Button
import { logout } from '@/app/auth/actions'; // Importa a action de logout

// Transforma o Header em um Server Component async
export default async function Header() {
  // Verifica o estado de autenticação no servidor
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">

        {/* Logo e Título (Esquerda) */}
        <Link href="/" className="flex items-center gap-2 group">
          <Image
            className="transition-opacity group-hover:opacity-80"
            src="/logo.svg"
            alt="StadionApp Logo"
            width={45}
            height={25} // Ajustei a altura para parecer mais proporcional
            priority
          />
          <span className="text-lg font-bold font-[family-name:var(--font-syncopate)] text-foreground hidden sm:inline transition-colors group-hover:text-foreground/80">
            Stadion
          </span>
        </Link>

        {/* Agrupamento dos Links e Controles (Direita) */}
        <div className="flex items-center gap-4 sm:gap-5"> {/* Ajuste o gap */}

          {/* Links de Navegação */}
          <Link href="/" className="flex items-center gap-1.5 text-sm font-medium text-foreground/60 hover:text-foreground transition-colors" title="Home">
             <Home className="w-4 h-4" />
            <span className="hidden md:inline">Home</span>
          </Link>
          <Link href="/facilities" className="flex items-center gap-1.5 text-sm font-medium text-foreground/60 hover:text-foreground transition-colors" title="Instalações">
            <Building className="w-4 h-4" />
            <span className="hidden md:inline">Instalações</span>
          </Link>
          <Link href="/instructors" className="flex items-center gap-1.5 text-sm font-medium text-foreground/60 hover:text-foreground transition-colors" title="Instrutores">
            <Users className="w-4 h-4" />
             <span className="hidden md:inline">Instrutores</span>
          </Link>

          {/* Separador (Opcional) */}
          <div className="h-6 w-px bg-border/50 mx-1 hidden sm:block"></div>

          {/* Botões Condicionais de Autenticação */}
          {user ? (
            // Se usuário está logado, mostra botão de Logout
            <form action={logout}>
              <Button variant="ghost" size="sm" className="flex items-center gap-1.5 text-foreground/60 hover:text-foreground">
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline">Sair</span>
              </Button>
            </form>
          ) : (
            // Se não está logado, mostra Login e Cadastro
            <>
              <Button variant="ghost" size="sm" asChild className="flex items-center gap-1.5 text-foreground/60 hover:text-foreground">
                <Link href="/login">
                  <LogIn className="w-4 h-4" />
                  <span className="hidden md:inline">Entrar</span>
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild className="flex items-center gap-1.5">
                 <Link href="/signup">
                   <UserPlus className="w-4 h-4" />
                   <span className="hidden md:inline">Cadastrar</span>
                 </Link>
              </Button>
            </>
          )}

          {/* Theme Toggle Button */}
          <ThemeToggle />

        </div>
      </nav>
    </header>
  );
}