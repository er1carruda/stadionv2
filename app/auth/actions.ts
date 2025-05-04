// app/auth/actions.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function logout() {
  const supabase = createClient();

  // Tenta fazer logout
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Erro no logout:', error.message);
    // Opcional: redirecionar para uma página de erro ou mostrar mensagem
    // redirect('/error?message=Logout failed');
    // Por enquanto, apenas redireciona para login mesmo com erro
  }

  // Revalida o path da raiz para garantir que o estado (ex: header) seja atualizado
  revalidatePath('/', 'layout'); // 'layout' garante revalidação em todo o layout
  // Redireciona para a página de login após o logout
  redirect('/login');
}