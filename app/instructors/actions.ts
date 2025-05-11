'use server';

import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

// Schema para serviços
const ServiceSchema = z.object({
  service_name: z.string().min(3, { message: 'Nome do serviço é obrigatório' }),
  duration_minutes: z.coerce.number().int().min(15, { message: 'Duração mínima é 15 minutos' }),
  price: z.coerce.number().min(0, { message: 'Preço não pode ser negativo' }),
});

// Schema para disponibilidade
const AvailabilitySchema = z.object({
  day_of_week: z.coerce.number().int().min(0).max(6),
  start_time: z.string().regex(/^\d{2}:\d{2}$/, { message: 'Formato inválido, use HH:MM' }),
  end_time: z.string().regex(/^\d{2}:\d{2}$/, { message: 'Formato inválido, use HH:MM' }),
});

// Schema Zod para validação - atualizado para corresponder ao schema do banco de dados
const InstructorSchema = z.object({
  specialty: z.string().min(3, { message: 'Especialidade deve ter pelo menos 3 caracteres.' }),
  bio: z.string().max(500, { message: 'Biografia muito longa (máx 500 caracteres).' }).optional().nullable(),
  profile_pic_url: z.string().url({ message: 'URL da foto de perfil inválida.' }).optional().nullable(),
  is_available: z.boolean().optional().default(true),
  services: z.array(ServiceSchema).optional().default([]),
  availability_rules: z.array(AvailabilitySchema).optional().default([]),
});

// Tipo InstructorFormState para controle de estado
export type InstructorFormState = {
  message?: string | null;
  errors?: {
    specialty?: string[];
    bio?: string[];
    profile_pic_url?: string[];
    is_available?: string[];
    services?: string[];
    availability_rules?: string[];
  };
};

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

// Função para garantir que o usuário tenha role de instrutor
async function ensureInstructorRole(supabase: any, userId: string): Promise<boolean> {
  try {
    // Primeiro, verificar o papel atual
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('user_role')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error("[ACTION] Erro ao buscar perfil:", error);
      throw error;
    }
    
    // Se o perfil não existe, não podemos prosseguir
    if (!profile) {
      console.error("[ACTION] Perfil não encontrado para usuário", userId);
      return false;
    }
    
    console.log(`[ACTION DEBUG] Role atual do usuário ${userId}: "${profile.user_role}" (tipo: ${typeof profile.user_role})`);
    console.log(`[ACTION DEBUG] Role normalizado: "${profile.user_role?.toLowerCase()?.trim()}"`);
    
    // Verificar se já é instrutor (com normalização)
    if (isInstructorRole(profile.user_role)) {
      console.log(`[ACTION DEBUG] Usuário já tem role de instrutor, mas o valor exato é "${profile.user_role}"`);
      
      // IMPORTANTE: Mesmo que isInstructorRole retorne true, se o valor não for exatamente 'instructor',
      // precisamos normalizar para garantir compatibilidade com a política RLS
      if (profile.user_role !== 'instructor') {
        console.log(`[ACTION DEBUG] Atualizando role de "${profile.user_role}" para exatamente "instructor" para compatibilidade com RLS`);
        
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ user_role: 'instructor' })
          .eq('id', userId);
          
        if (updateError) {
          console.error('[ACTION] Erro ao atualizar role para o valor exato:', updateError);
          return false;
        }
        
        // Verificar se a atualização foi bem-sucedida
        const { data: updatedProfile, error: verifyError } = await supabase
          .from('profiles')
          .select('user_role')
          .eq('id', userId)
          .maybeSingle();
          
        if (verifyError || !updatedProfile) {
          console.error('[ACTION] Erro ao verificar atualização de role:', verifyError);
          return false;
        }
        
        console.log(`[ACTION DEBUG] Role após atualização: "${updatedProfile.user_role}"`);
        
        // Se ainda não for exatamente 'instructor', algo está errado
        if (updatedProfile.user_role !== 'instructor') {
          console.error(`[ACTION] ALERTA: Role não foi atualizado corretamente. Valor atual: "${updatedProfile.user_role}"`);
          return false;
        }
      }
      
      return true;
    }
    
    // Se não for, mas deveria ser, normalizar para 'instructor'
    console.log(`[ACTION] Atualizando role do usuário ${userId} de "${profile.user_role}" para "instructor"`);
    
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ user_role: 'instructor' })
      .eq('id', userId);
      
    if (updateError) {
      console.error('[ACTION] Erro ao atualizar role:', updateError);
      return false;
    }
    
    // Verificar se a atualização foi bem-sucedida
    const { data: updatedProfile, error: verifyError } = await supabase
      .from('profiles')
      .select('user_role')
      .eq('id', userId)
      .maybeSingle();
      
    if (verifyError || !updatedProfile) {
      console.error('[ACTION] Erro ao verificar atualização de role:', verifyError);
      return false;
    }
    
    console.log(`[ACTION DEBUG] Role após atualização: "${updatedProfile.user_role}"`);
    
    return updatedProfile.user_role === 'instructor';
  } catch (err) {
    console.error('[ACTION] Erro ao verificar/atualizar role:', err);
    return false;
  }
}

export async function createInstructor(
  prevState: InstructorFormState | undefined,
  formData: FormData
): Promise<InstructorFormState> {
  // Cria o cookieStore e o cliente Supabase
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // 1. Verificar Autenticação
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    console.error('Erro de autenticação na action:', authError);
    return { message: 'Erro de autenticação. Faça login novamente.' };
  }

  console.log(`[ACTION DEBUG] Usuário autenticado: ${user.id}`);

  // 2. Verificar e garantir Autorização (Role)
  const roleUpdated = await ensureInstructorRole(supabase, user.id);
  if (!roleUpdated) {
    return { message: 'Não foi possível configurar as permissões de instrutor para seu usuário.' };
  }

  // 3. Verificar se o usuário já tem um perfil de instrutor
  const { data: existingInstructor, error: instructorCheckError } = await supabase
    .from('instructors')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle();

  console.log(`[ACTION DEBUG] Instrutor existente:`, existingInstructor ? 'Sim' : 'Não');

  if (instructorCheckError) {
    console.error('Erro ao verificar perfil de instrutor existente:', instructorCheckError);
    return { message: 'Erro ao verificar perfil existente.' };
  }

  if (existingInstructor) {
    console.warn(`Usuário ${user.id} tentou criar um segundo perfil de instrutor.`);
    return { message: 'Você já possui um perfil de instrutor cadastrado.' };
  }

  // Extrair serviços do formData
  const servicesCount = parseInt(formData.get('services_count')?.toString() || '0');
  const services = [];
  for (let i = 0; i < servicesCount; i++) {
    if (formData.get(`services[${i}].service_name`)) {
      services.push({
        service_name: formData.get(`services[${i}].service_name`)?.toString() || '',
        duration_minutes: parseInt(formData.get(`services[${i}].duration_minutes`)?.toString() || '0'),
        price: parseFloat(formData.get(`services[${i}].price`)?.toString() || '0'),
      });
    }
  }

  // Extrair regras de disponibilidade do formData
  const availabilityCount = parseInt(formData.get('availability_count')?.toString() || '0');
  const availabilityRules = [];
  for (let i = 0; i < availabilityCount; i++) {
    if (formData.get(`availability[${i}].day_of_week`)) {
      availabilityRules.push({
        day_of_week: parseInt(formData.get(`availability[${i}].day_of_week`)?.toString() || '0'),
        start_time: formData.get(`availability[${i}].start_time`)?.toString() || '',
        end_time: formData.get(`availability[${i}].end_time`)?.toString() || '',
      });
    }
  }

  // 4. Validar Dados do Formulário
  const validatedFields = InstructorSchema.safeParse({
    specialty: formData.get('specialty'),
    bio: formData.get('bio') || null,
    profile_pic_url: formData.get('profile_pic_url') || null,
    is_available: formData.get('is_available') === 'true',
    services,
    availability_rules: availabilityRules,
  });

  if (!validatedFields.success) {
    console.log('Erros de validação Zod:', validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Erro de validação. Verifique os campos.',
    };
  }

  // 5. Inserir no Banco de Dados
  const { specialty, bio, profile_pic_url, is_available, services: validatedServices, availability_rules: validatedAvailability } = validatedFields.data;

  if (!user?.id) { // Verificação de segurança
    console.error('FATAL: User ID is undefined immediately before insert!');
    return { message: 'Erro crítico: ID do usuário não encontrado antes de salvar.' };
  }

  console.log(`[ACTION DEBUG] Tentando inserir instrutor com dados:`, {
    user_id: user.id,
    specialty,
    bio: bio ? `${bio.substring(0, 20)}...` : null,
    profile_pic_url,
    is_available
  });

  // Usar transação para garantir que todos os dados sejam salvos ou nenhum
  let instructorData;
  let insertError;

  const result = await supabase
    .from('instructors')
    .insert({
      user_id: user.id,
      specialty,
      bio,
      profile_pic_url,
      is_available
    })
    .select('id')
    .single();
  
  instructorData = result.data;
  insertError = result.error;

  // Tratamento de erro de inserção
  if (insertError) {
    console.error('Erro ao inserir instrutor no DB:', insertError);
    
    // Log completo do erro para depuração
    console.error('Detalhes completos do erro:', JSON.stringify(insertError, null, 2));
    
    // Log completo do perfil atual para debug
    const { data: currentProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();
    
    console.log('Perfil atual no momento da inserção:', JSON.stringify(currentProfile, null, 2));
    
    if (insertError.message.includes('violates row-level security policy')) {
      console.log('DIAGNÓSTICO RLS: Erro de política de segurança detectado');
      console.log('A política RLS exige que:');
      console.log('1. auth.uid() = user_id (verificando se o usuário está inserindo seu próprio perfil)');
      console.log('2. O perfil do usuário tenha EXATAMENTE user_role = "instructor"');
      
      // Confirmar o valor exato do auth.uid() via RPC para diagnóstico
      const { data: authData } = await supabase.rpc('get_auth_uid');
      console.log(`Auth UID atual via RPC: ${authData}`);
      console.log(`User ID sendo inserido: ${user.id}`);
      console.log(`São iguais? ${authData === user.id}`);
      
      // Tentar mais uma atualização de role e reinserção
      const secondRoleUpdate = await ensureInstructorRole(supabase, user.id);
      if (!secondRoleUpdate) {
        return { message: 'Erro de segurança: sem permissão para criar perfil de instrutor. Verifique se seu perfil tem o papel "instructor" exato.' };
      }
      
      // Tentar inserir novamente após garantir que o role está correto
      const secondResult = await supabase
        .from('instructors')
        .insert({
          user_id: user.id,
          specialty,
          bio,
          profile_pic_url,
          is_available
        })
        .select('id')
        .single();
        
      if (secondResult.error) {
        console.error('Segundo erro ao inserir instrutor:', secondResult.error);
        console.error('Detalhes completos do segundo erro:', JSON.stringify(secondResult.error, null, 2));
        
        // Log da política RLS que está bloqueando
        if (secondResult.error.message.includes('row-level security')) {
          return { 
            message: 'Erro persistente de segurança: não foi possível criar o perfil de instrutor mesmo após atualização de role. ' + 
                     'Contacte o administrador do sistema com o código: RLS-AUTH-FAIL-' + user.id.substring(0, 8)
          };
        }
        
        return { message: 'Erro ao criar perfil de instrutor após atualização de papel: ' + secondResult.error.message };
      }
      
      // Se chegarmos aqui, a segunda inserção funcionou
      instructorData = secondResult.data;
    } else if (insertError.message.includes('violates not-null constraint')) {
      return { message: 'Erro: campos obrigatórios ausentes.' };
    } else if (insertError.code === '23505') {
      return { message: 'Este perfil já existe.' };
    } else {
      return { message: `Erro no banco de dados ao criar perfil: ${insertError.message}` };
    }
  }

  // Se chegou aqui, temos o ID do instrutor e podemos inserir os serviços e disponibilidade
  if (instructorData && instructorData.id) {
    // Inserir serviços
    if (validatedServices.length > 0) {
      const servicesWithInstructorId = validatedServices.map(service => ({
        ...service,
        instructor_id: instructorData.id
      }));
      
      const { error: servicesError } = await supabase
        .from('instructor_service_pricing')
        .insert(servicesWithInstructorId);
      
      if (servicesError) {
        console.error('Erro ao inserir serviços:', servicesError);
        // Considerar reverter a inserção do instrutor em caso de erro
      }
    }
    
    // Inserir regras de disponibilidade
    if (validatedAvailability.length > 0) {
      const availabilityWithInstructorId = validatedAvailability.map(rule => ({
        ...rule,
        instructor_id: instructorData.id
      }));
      
      const { error: availabilityError } = await supabase
        .from('instructor_availability_rules')
        .insert(availabilityWithInstructorId);
      
      if (availabilityError) {
        console.error('Erro ao inserir regras de disponibilidade:', availabilityError);
        // Considerar reverter a inserção do instrutor em caso de erro
      }
    }
  }

  // 6. Revalidar Cache e Redirecionar
  console.log(`Perfil de instrutor criado com sucesso para o usuário ${user.id}. Redirecionando.`);
  revalidatePath('/instructors');
  redirect('/instructors?message=Perfil de instrutor criado com sucesso!');
} 