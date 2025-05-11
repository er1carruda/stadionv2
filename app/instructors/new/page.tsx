import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { InstructorForm } from '../components/InstructorForm';
import { AlertTriangle } from 'lucide-react';

// Função para verificar se o usuário tem role de instrutor (case insensitive)
function isInstructorRole(role: string | null | undefined): boolean {
  if (!role) return false;
  
  // Normalizar para lowercase e remover espaços
  const normalizedRole = role.toLowerCase().trim();
  
  // Verificar variações comuns
  return normalizedRole === 'instructor' || 
         normalizedRole === 'instrutor' || 
         normalizedRole === 'professor';
}

// Função para garantir que o usuário tenha exatamente o papel "instructor" na base de dados
async function ensureExactInstructorRole(supabase: any, userId: string, currentRole: string | null): Promise<boolean> {
  // Se já for exatamente 'instructor', está tudo bem
  if (currentRole === 'instructor') return true;
  
  // Se for outra variação de instrutor (verificada por isInstructorRole), atualizar para 'instructor'
  if (isInstructorRole(currentRole)) {
    console.log(`[PAGE] Atualizando role do usuário ${userId} de "${currentRole}" para exatamente "instructor"`);
    
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ user_role: 'instructor' })
      .eq('id', userId);
      
    if (updateError) {
      console.error('[PAGE] Erro ao atualizar role para o valor exato:', updateError);
      return false;
    }
    
    return true;
  }
  
  // Não é instrutor de nenhuma forma
  return false;
}

export default async function NewInstructorPage() {
  // Cria o cookieStore e o cliente Supabase
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // 1. Verificar Autenticação
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    console.log('Usuário não autenticado tentando acessar /instructors/new, redirecionando para login.');
    redirect('/login?message=Você precisa estar logado para criar um perfil de instrutor.');
  }

  console.log(`[DEBUG] Usuário autenticado: ${user.id}`);

  // 2. Verificar Autorização (Role)
  let userRole: string | null = null;
  let profileErrorOccurred = false;

  // Já temos 'user' garantido aqui pela verificação anterior
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('user_role')
    .eq('id', user.id)
    .maybeSingle();

  console.log(`[DEBUG] Perfil do banco de dados:`, JSON.stringify(profile, null, 2));
  console.log(`[DEBUG] Erro ao buscar perfil:`, profileError ? JSON.stringify(profileError, null, 2) : 'Nenhum erro');

  if (profileError) {
    console.error("Erro ao buscar perfil em /instructors/new:", profileError.message);
    profileErrorOccurred = true;
  } else if (profile) {
    userRole = profile.user_role;
    console.log(`[DEBUG] Role do usuário: "${userRole}" (tipo: ${typeof userRole})`);
    // Verificar se há espaços extras ou problemas de formatação
    if (userRole) {
      console.log(`[DEBUG] Role trim: "${userRole.trim()}" (length: ${userRole.length})`);
      console.log(`[DEBUG] Role lowercase: "${userRole.toLowerCase()}"`);
    }
  } else {
    console.warn(`Perfil não encontrado para usuário logado ${user.id} em /instructors/new.`);
    profileErrorOccurred = true;
  }

  // 3. Verificar se o usuário já tem um perfil de instrutor
  const { data: existingInstructor, error: instructorCheckError } = await supabase
    .from('instructors')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle();

  console.log(`[DEBUG] Instrutor existente:`, existingInstructor ? 'Sim' : 'Não');

  if (existingInstructor) {
    console.log(`Usuário ${user.id} já possui perfil de instrutor, redirecionando.`);
    redirect('/instructors?message=Você já possui um perfil de instrutor.');
  }

  // 4. Redirecionar se não for instructor (ou se erro ao buscar perfil)
  console.log(`[DEBUG] Verificando se role é "instructor": "${userRole}" => ${isInstructorRole(userRole)}`);
  
  // Usamos a função para verificação flexível
  if (!isInstructorRole(userRole)) {
    if (profileErrorOccurred) {
      console.log('Erro ao buscar perfil ou perfil não encontrado para /instructors/new, redirecionando.');
      redirect('/instructors?error=Erro ao verificar permissões.');
    } else {
      console.log(`Usuário ${user?.id} com role ${userRole} tentou acessar /instructors/new. Redirecionando.`);
      redirect('/instructors?message=Você não tem permissão para criar um perfil de instrutor.');
    }
  }

  // 4.1 Garantir que o usuário tenha EXATAMENTE o papel "instructor" na base de dados (para RLS)
  const roleUpdated = await ensureExactInstructorRole(supabase, user.id, userRole);
  if (!roleUpdated) {
    console.log(`Falha ao atualizar role do usuário ${user.id} para "instructor" exato.`);
    redirect('/instructors?error=Não foi possível configurar corretamente suas permissões de instrutor.');
  }

  // 5. Se chegou até aqui, o usuário é instructor e não tem perfil ainda. Renderiza o formulário.
  console.log(`Usuário ${user?.id} (instructor) acessando /instructors/new.`);
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Criar Perfil de Instrutor
        </h1>
      </div>
      <div className="max-w-2xl mx-auto">
        <InstructorForm />
      </div>
    </div>
  );
} 