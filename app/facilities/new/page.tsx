// app/facilities/new/page.tsx
import { cookies } from 'next/headers'; // <-- Importa cookies
import { createClient } from '@/lib/supabase/server'; // Importa o helper modificado
import { redirect } from 'next/navigation';
import { FacilityForm } from '../components/FacilityForm'; // Import nomeado (corrigido antes)
import { AlertTriangle } from 'lucide-react';

export default async function NewFacilityPage() {
  // ---> Cria o cookieStore e o cliente Supabase AQUI <---
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // 1. Verificar Autenticação
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    console.log('Usuário não autenticado tentando acessar /facilities/new, redirecionando para login.');
    redirect('/login?message=Você precisa estar logado para criar uma instalação.');
  }

  // 2. Verificar Autorização (Role)
  let userRole: string | null = null;
  let profileErrorOccurred = false;

  // Já temos 'user' garantido aqui pela verificação anterior
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('user_role')
    .eq('id', user.id)
    .maybeSingle();

  if (profileError) {
    console.error("Erro ao buscar perfil em /facilities/new:", profileError.message);
    profileErrorOccurred = true;
  } else if (profile) {
    userRole = profile.user_role;
  } else {
    console.warn(`Perfil não encontrado para usuário logado ${user.id} em /facilities/new.`);
    profileErrorOccurred = true;
  }

  // 3. Redirecionar se não for FACILITY_MANAGER (ou se erro ao buscar perfil)
  if (userRole !== 'FACILITY_MANAGER') {
    if (profileErrorOccurred) {
      console.log('Erro ao buscar perfil ou perfil não encontrado para /facilities/new, redirecionando.');
      redirect('/facilities?error=Erro ao verificar permissões.');
    } else {
      console.log(`Usuário ${user?.id} com role ${userRole} tentou acessar /facilities/new. Redirecionando.`);
      redirect('/facilities?message=Você não tem permissão para criar instalações.');
    }
  }

  // 4. Se chegou até aqui, o usuário é FACILITY_MANAGER. Renderiza o formulário.
  console.log(`Usuário ${user?.id} (FACILITY_MANAGER) acessando /facilities/new.`);
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Criar Nova Instalação Esportiva
        </h1>
      </div>
      <div className="max-w-2xl mx-auto">
        <FacilityForm />
      </div>
    </div>
  );
}