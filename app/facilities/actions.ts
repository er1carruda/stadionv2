// app/facilities/actions.ts
'use server';

import { cookies } from 'next/headers'; // <-- Importa cookies
import { createClient } from '@/lib/supabase/server'; // Importa o helper modificado
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

// Schema Zod (sem mudanças, já estava atualizado)
const FacilitySchema = z.object({
  name: z.string().min(3, { message: 'Nome deve ter pelo menos 3 caracteres.' }),
  address: z.string().min(5, { message: 'Endereço deve ter pelo menos 5 caracteres.' }),
  type: z.string().min(1, { message: 'Tipo é obrigatório.' }),
  capacity: z.coerce
    .number({ invalid_type_error: 'Capacidade deve ser um número.' })
    .int({ message: 'Capacidade deve ser um número inteiro.' })
    .nonnegative({ message: 'Capacidade é obrigatória e não pode ser negativa.' }),
  description: z.string().max(500, { message: 'Descrição muito longa (máx 500 caracteres).' }).optional().nullable(),
  contact_phone: z.string().max(20, { message: 'Telefone muito longo.' }).optional().nullable(),
  contact_email: z.string().email({ message: 'Formato de email inválido.' }).optional().nullable(),
  operating_hours_info: z.string().max(200, { message: 'Informação de horário muito longa.' }).optional().nullable(),
});

// Tipo FacilityFormState (sem mudanças, já estava atualizado)
export type FacilityFormState = {
  message?: string | null;
  errors?: {
    name?: string[];
    address?: string[];
    type?: string[];
    capacity?: string[];
    description?: string[];
    contact_phone?: string[];
    contact_email?: string[];
    operating_hours_info?: string[];
  };
};

export async function createFacility(
  prevState: FacilityFormState | undefined,
  formData: FormData
): Promise<FacilityFormState> {
  // ---> Cria o cookieStore e o cliente Supabase AQUI <---
  const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

  // 1. Verificar Autenticação
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
     console.error('Erro de autenticação na action:', authError);
     return { message: 'Erro de autenticação. Faça login novamente.' };
  }
  // console.log('DEBUG Action: User obtained initially:', user?.id); // Log opcional

  // 2. Verificar Autorização (Role)
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('user_role')
    .eq('id', user.id)
    .maybeSingle();

  if (profileError) {
     console.error('Erro ao buscar perfil na action:', profileError);
     return { message: 'Erro ao verificar permissões do usuário.' };
  }
  if (!profile) {
     console.error(`Perfil não encontrado na action para user ID: ${user.id}`);
     return { message: 'Perfil de usuário não encontrado.' };
  }
  if (profile.user_role !== 'FACILITY_MANAGER') {
     console.warn(`Acesso negado na action para user ID: ${user.id}, role: ${profile.user_role}`);
     return { message: 'Acesso negado. Somente gerentes podem criar instalações.' };
  }
  // console.log(`DEBUG Action: User ${user.id} confirmed as FACILITY_MANAGER.`); // Log opcional

  // 3. Validar Dados do Formulário
  const validatedFields = FacilitySchema.safeParse({
    name: formData.get('name'),
    address: formData.get('address'),
    type: formData.get('type'),
    capacity: formData.get('capacity'),
    description: formData.get('description') || null,
    contact_phone: formData.get('contact_phone') || null,
    contact_email: formData.get('contact_email') || null,
    operating_hours_info: formData.get('operating_hours_info') || null,
  });

  if (!validatedFields.success) {
    console.log('Erros de validação Zod:', validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Erro de validação. Verifique os campos.',
    };
  }
  // console.log('DEBUG Action: Zod validation successful.'); // Log opcional

  // 4. Inserir no Banco de Dados
  const { name, address, type, capacity, description, contact_phone, contact_email, operating_hours_info } = validatedFields.data;

  // Logs de depuração (removidos para limpeza, mas podem ser adicionados de volta se necessário)
  // console.log('DEBUG Action: User object before insert:', JSON.stringify(user, null, 2));
  // console.log('DEBUG Action: User ID before insert:', user?.id);

  if (!user?.id) { // Verificação de segurança
      console.error('FATAL: User ID is undefined immediately before insert!');
      return { message: 'Erro crítico: ID do usuário não encontrado antes de salvar.' };
  }

  const { error: insertError } = await supabase.from('facilities').insert({
    name,
    address,
    type,
    capacity,
    description,
    contact_phone,
    contact_email,
    operating_hours_info,
    manager_id: user.id,
  });

  // Tratamento de erro de inserção (código existente)
  if (insertError) {
    console.error('Erro ao inserir facility no DB:', insertError);
    if (insertError.message.includes('violates row-level security policy')) { /* ... */ }
    if (insertError.message.includes('violates not-null constraint')) { /* ... */ }
    if (insertError.code === '23505') { /* ... */ }
    return { message: `Erro no banco de dados ao criar instalação: ${insertError.message}` };
  }

  // 5. Revalidar Cache e Redirecionar
  console.log(`DEBUG Action: Facility "${name}" created successfully by user ${user.id}. Revalidating and redirecting.`);
  revalidatePath('/facilities');
  redirect('/facilities?message=Instalação criada com sucesso!');
}