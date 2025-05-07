// app/components/Header.tsx
import Link from 'next/link';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { Button, buttonVariants } from '@/components/ui/button'; // Button ainda é usado para Logout
import { cn } from "@/lib/utils";
import { ThemeToggle } from './theme-toggle';
import { logout } from '@/app/auth/actions';

export default async function Header() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <img src="/logo.svg" alt="Stadion Logo" className="h-6 w-6" />
            {/* MODIFICADO: Aplicando Syncopate via variável CSS para "Stadion" */}
            <span className="font-bold [font-family:var(--font-syncopate)] text-lg">Stadion</span>
          </Link>
        </div>

        <div className="flex items-center gap-6">
          <nav className="hidden md:flex gap-4">
            <Link href="/facilities" className="text-sm font-medium text-muted-foreground hover:text-primary"> {/* Hover com accent verde neon */}
              Instalações
            </Link>
            <Link href="/instructors" className="text-sm font-medium text-muted-foreground hover:text-primary"> {/* Hover com accent verde neon */}
              Instrutores
            </Link>
          </nav>

          <div className="flex items-center space-x-3">
            <ThemeToggle />
            {user ? (
              <form action={logout}>
                <Button variant="outline" size="sm" className="h-8 border-foreground/50 hover:border-foreground text-foreground hover:bg-foreground/5 dark:hover:bg-white/5">Logout</Button> {/* Botão outline P&B */}
              </form>
            ) : (
              <Link
                href="/login"
                className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "h-8 border-foreground/50 hover:border-foreground text-foreground hover:bg-foreground/5 dark:hover:bg-white/5" // Botão outline P&B
                )}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}