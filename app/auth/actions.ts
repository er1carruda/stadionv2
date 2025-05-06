// app/auth/actions.ts
'use server';

import { cookies } from 'next/headers'; // <-- PASSO 1: Importa cookies
import { createClient } from '@/lib/supabase/server'; // Importa o helper modificado
// import { revalidatePath } from 'next/cache'; // Revalidação pode não ser necessária com redirect
import { redirect } from 'next/navigation';

export async function logout() {
  // ---> PASSO 2: Cria o cookieStore esperando a Promise resolver <---
  const cookieStore = await cookies();
  // ---> PASSO 3: Passa o cookieStore para createClient <---
  const supabase = createClient(cookieStore);

  // Tenta fazer logout
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Erro ao fazer logout:', error.message);
    // Mesmo com erro, redireciona para tentar limpar o estado do cliente
    redirect('/login?error=Erro ao tentar desconectar.'); // Adiciona mensagem de erro
  }

  // O redirect geralmente força uma atualização da página de destino.
  // RevalidatePath pode ser redundante aqui, mas pode ser descomentado se necessário.
  // revalidatePath('/', 'layout');

  // Redireciona para a página de login com mensagem de sucesso
  redirect('/login?message=Você foi desconectado com sucesso.');
}

// --- IMPORTANTE ---
// Se você tiver OUTRAS actions neste arquivo (ex: login, signup),
// você PRECISA aplicar os mesmos passos 1, 2 e 3 dentro delas também!
// Exemplo para uma action 'login' hipotética:
/*
export async function login(formData: FormData) {
  const cookieStore = await cookies(); // PASSO 2
  const supabase = createClient(cookieStore); // PASSO 3
  // ... resto da lógica de login usando 'supabase' ...
  // ... tratamento de erro ...
  // ... redirect ou revalidate ...
}
*/