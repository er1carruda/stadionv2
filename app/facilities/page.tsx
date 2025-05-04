// app/facilities/page.tsx
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Button } from '@/components/ui/button'; // Import do Button shadcn/ui
import { AlertTriangle, PlusCircle } from 'lucide-react'; // Ícones

// Definição de tipo para clareza
type FacilityWithManager = {
  id: string;
  name: string | null;
  address: string | null;
  type: string | null;
  capacity: number | null;
  description: string | null; // Adicionando descrição
  status: string | null; // Adicionando status
  profiles: {
    full_name: string | null;
  } | null;
};

export default async function FacilitiesPage() {
  const supabase = createClient();

  // 1. Busca as instalações e o nome do gerente associado
  // Selecionando mais campos como description e status
  const { data: facilities, error: facilitiesError } = await supabase
    .from('facilities')
    .select(`
      id,
      name,
      address,
      type,
      capacity,
      description,
      status,
      profiles ( full_name )
    `)
    .order('name', { ascending: true }) // Ordenar por nome
    .returns<FacilityWithManager[]>(); // Força a tipagem

  // 2. Verifica o usuário atual e sua role para exibir o botão condicionalmente
  const { data: { user } } = await supabase.auth.getUser();
  let userRole: string | null = null;
  if (user) {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError) {
        console.error("Erro ao buscar perfil do usuário:", profileError.message);
    } else {
        userRole = profile?.role ?? null;
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Cabeçalho da Página */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground text-center sm:text-left">
          Instalações Esportivas
        </h1>
        {/* Botão visível apenas para FACILITY_MANAGER */}
        {userRole === 'FACILITY_MANAGER' && (
          <Button asChild variant="outline">
            {/* Link para a página de criação */}
            <Link href="/facilities/new" className="flex items-center gap-2">
               <PlusCircle className="w-4 h-4" />
               Criar Nova Instalação
            </Link>
          </Button>
        )}
      </div>

      {/* Tratamento de Erro na Busca */}
      {facilitiesError && (
         <div className="flex items-center justify-center gap-2 p-4 text-red-700 bg-red-100 dark:bg-red-900/30 dark:text-red-400 border border-red-300 dark:border-red-600/50 rounded-md max-w-md mx-auto mb-6">
            <AlertTriangle className="w-5 h-5" />
            <span>Não foi possível carregar as instalações. Tente novamente mais tarde.</span>
          </div>
      )}

      {/* Listagem das Instalações */}
      {!facilitiesError && facilities && facilities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facilities.map((facility) => (
            <div
                key={facility.id}
                className="border border-border/60 p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-card dark:bg-card/80 flex flex-col" // Usando bg-card
            >
              <h2 className="text-xl font-semibold mb-3 text-card-foreground">{facility.name ?? 'Nome não informado'}</h2>

              <div className="space-y-1.5 text-sm text-muted-foreground flex-grow mb-4"> {/* flex-grow empurra o gerente para baixo */}
                  <p><span className="font-medium text-card-foreground/90">Tipo:</span> {facility.type ?? 'N/A'}</p>
                  <p><span className="font-medium text-card-foreground/90">Endereço:</span> {facility.address ?? 'N/A'}</p>
                  {facility.capacity && (
                     <p><span className="font-medium text-card-foreground/90">Capacidade:</span> {facility.capacity}</p>
                  )}
                  {facility.description && ( // Mostra descrição se existir
                     <p><span className="font-medium text-card-foreground/90">Descrição:</span> {facility.description}</p>
                  )}
                  <p>
                      <span className="font-medium text-card-foreground/90">Status:</span>
                      <span className={`ml-1 font-medium ${
                          facility.status === 'Disponível' ? 'text-green-600 dark:text-green-400' :
                          facility.status === 'Ocupado' ? 'text-red-600 dark:text-red-400' :
                          facility.status === 'Manutenção' ? 'text-yellow-600 dark:text-yellow-400' :
                          'text-muted-foreground' // Cor padrão para status desconhecido/nulo
                      }`}>
                          {facility.status ?? 'Indefinido'}
                      </span>
                  </p>
              </div>

              {/* Informação do Gerente */}
              <p className="text-xs text-muted-foreground mt-3 pt-3 border-t border-border/60">
                <span className="font-medium">Gerente:</span> {facility.profiles?.full_name ?? 'Não atribuído'}
              </p>
              {/* Futuro: Links para detalhes, editar, excluir */}
            </div>
          ))}
        </div>
      ) : (
        // Mensagem se não houver erro mas a lista estiver vazia
        !facilitiesError && <p className="text-center text-muted-foreground mt-10">Nenhuma instalação encontrada.</p>
      )}
    </div>
  );
}