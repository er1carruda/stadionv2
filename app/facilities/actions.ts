// app/facilities/actions.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

// Define um schema para validação usando Zod
// Ajuste os campos conforme necessário (tipos, se são opcionais, etc.)
const FacilitySchema = z.object({
  name: z.string().min(3, { message: 'Nome deve ter pelo menos 3 caracteres.' }),
  address: z.string().min(5, { message: 'Endereço deve ter pelo menos 5 caracteres.' }),
  type: z.string().min(3, { message: 'Tipo deve ter pelo menos 3 caracteres.' }),
  // Usamos coerce para tentar converter o valor do form (string) para número
  capacity: z.coerce.number().int().positive().optional().nullable(),
  description: z.string().optional().nullable(),
  // Adicione outros campos que você terá no formulário e na tabela 'facilities'
});

// Define um tipo para o estado do formulário, útil para passar mensagens de erro
export type FacilityFormState = {
  message?: string | null;
  errors?: {
    name?: string[];
    address?: string[];
    type?: string[];
    capacity?: string[];
    description?: string[];
    // Adicione erros para outros campos
  };
};

export async function createFacility(
  // prevState é útil ao usar useFormState no formulário do cliente
  prevState: FacilityFormState | undefined,
  formData: FormData
): Promise<FacilityFormState> {
  const supabase = createClient();

  // 1. Verificar Autenticação
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    // Pode redirecionar para login ou retornar erro específico
    // redirect('/login');
     return { message: 'Erro de autenticação. Faça login novamente.' };
  }

  // 2. Verificar Autorização (Role)
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
     console.error('Erro ao buscar perfil:', profileError);
     return { message: 'Erro ao verificar permissões do usuário.' };
  }

  if (profile.role !== 'FACILITY_MANAGER') {
     return { message: 'Acesso negado. Somente gerentes podem criar instalações.' };
  }

  // 3. Validar Dados do Formulário
  const validatedFields = FacilitySchema.safeParse({
    name: formData.get('name'),
    address: formData.get('address'),
    type: formData.get('type'),
    capacity: formData.get('capacity') || null, // Trata campo vazio como null se for opcional
    description: formData.get('description') || null,
    // Pegue outros campos do formData
  });

  // Se a validação falhar, retorna os erros
  if (!validatedFields.success) {
    console.log('Erros de validação:', validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Erro de validação. Verifique os campos.',
    };
  }

  // 4. Inserir no Banco de Dados
  const { name, address, type, capacity, description } = validatedFields.data;

  const { error: insertError } = await supabase.from('facilities').insert({
    name,
    address,
    type,
    capacity,
    description,
    manager_id: user.id, // Associa ao usuário logado
    // Adicione outros campos validados aqui
  });

  if (insertError) {
    console.error('Erro ao inserir facility:', insertError);
    return { message: `Erro no banco de dados: ${insertError.message}` };
  }

  // 5. Revalidar Cache e Redirecionar em caso de sucesso
  // Revalida a página que lista as instalações para mostrar a nova
  revalidatePath('/facilities');
  // Redireciona o usuário para a página de listagem
  redirect('/facilities');

  // Embora o redirect ocorra antes, o TS exige um retorno.
  // Em caso de sucesso sem redirect, poderia retornar { message: 'Instalação criada!' }
  // Mas como usamos redirect, essa linha abaixo não será executada na prática.
  // return { message: null, errors: {} };
}

// --- Outras Actions (updateFacility, deleteFacility) podem ser adicionadas aqui ---