// app/instructors/page.tsx
import { createClient } from '@/lib/supabase/server' // Cliente Server-side
import { cookies } from 'next/headers'
import { Users } from 'lucide-react'; // Ícone opcional
import { AlertTriangle } from 'lucide-react'; // Ícone para erro

// Transforma a função em async
export default async function InstructorsPage() {
  const cookieStore = cookies()
  const supabase = createClient()

  // Busca dados de instrutores.
  // Se você quisesse buscar o nome do perfil associado, usaria um join:
  // .select('*, profiles ( display_name, avatar_url )')
  // Mas para simplificar, vamos buscar apenas da tabela instructors por enquanto.
  const { data: instructors, error } = await supabase
    .from('instructors') // Nome da tabela
    .select('*') // Seleciona todas as colunas de instructors
    .order('created_at', { ascending: false });

  // Tratamento de erro
   if (error) {
    console.error('Erro ao buscar instrutores:', error.message);
    return (
       <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24 text-center">
         <div className="flex items-center justify-center gap-2 p-4 text-red-700 bg-red-100 dark:bg-red-900/30 dark:text-red-400 border border-red-300 dark:border-red-600/50 rounded-md max-w-md mx-auto">
            <AlertTriangle className="w-5 h-5" />
            <span>Não foi possível carregar os instrutores. Tente novamente mais tarde.</span>
          </div>
       </div>
    );
  }

  // Busca dados dos perfis para pegar nomes (Exemplo de busca adicional)
  // Isso pode ser otimizado com um join na query principal, mas funciona para começar
  const instructorUserIds = instructors?.map(inst => inst.user_id) ?? [];
  let profilesMap = new Map<string, { display_name: string | null, avatar_url: string | null }>();
  if (instructorUserIds.length > 0) {
      const { data: profilesData, error: profileError } = await supabase
          .from('profiles')
          .select('id, display_name, avatar_url')
          .in('id', instructorUserIds); // Busca apenas perfis dos IDs dos instrutores

      if (profileError) {
          console.error("Erro ao buscar perfis:", profileError.message);
          // Poderia mostrar um erro parcial, mas vamos continuar por enquanto
      } else if (profilesData) {
          profilesData.forEach(profile => {
              profilesMap.set(profile.id, { display_name: profile.display_name, avatar_url: profile.avatar_url });
          });
      }
  }


  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="flex items-center gap-3 mb-8">
            {/* <Users className="w-7 h-7 text-gray-600 dark:text-gray-400" /> */}
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Professores e Treinadores
            </h1>
        </div>

        {instructors && instructors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {/* Mapeia os dados buscados */}
            {instructors.map((instructor) => {
               // Pega dados do perfil correspondente
               const profile = profilesMap.get(instructor.user_id);
               const displayName = profile?.display_name ?? 'Nome não disponível'; // Usa nome do perfil
               // const avatarUrl = profile?.avatar_url; // Poderia usar para imagem

               return (
                 <div
                    key={instructor.id} // Usa o ID da tabela instructors
                    className="border border-solid border-black/[.08] dark:border-white/[.145] rounded-lg p-4 flex flex-col gap-2 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow"
                 >
                    {/* Exibe nome do perfil */}
                    <h2 className="font-semibold text-lg text-foreground">{displayName}</h2>
                    {/* Usa dados da tabela instructors */}
                    <p className="text-sm text-gray-700 dark:text-gray-300">{instructor.specialty ?? 'Sem especialidade'}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-[family-name:var(--font-geist-mono)]">
                    {/* Poderia exibir contato ou bio */}
                    Contato: {instructor.contact_email ?? instructor.contact_phone ?? 'Não informado'}
                    </p>
                    {/* Adicionar bio: instructor.bio */}
                 </div>
               );
             })}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center mt-10">Nenhum instrutor encontrado.</p>
        )}
    </div>
  );
}