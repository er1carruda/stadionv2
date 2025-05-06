// app/components/Header.tsx
import Link from 'next/link';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './theme-toggle'; // Import corrigido anteriormente
import { logout } from '@/app/auth/actions';

export default async function Header() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        {/* Seção Esquerda */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <img src="/logo.svg" alt="StadionApp Logo" className="h-6 w-6" />
            <span className="font-bold">StadionApp</span>
          </Link>
        </div>

        {/* Seção Direita */}
        <div className="flex items-center space-x-3">
          <ThemeToggle />
          {user ? (
            <form action={logout}>
              <Button variant="outline" size="sm" className="h-8">Logout</Button>
            </form>
          ) : (
            <Button asChild variant="outline" size="sm" className="h-8">
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}