// app/facilities/page.tsx
import { cookies } from 'next/headers'; // <-- Importa cookies
import { createClient } from '@/lib/supabase/server'; // Importa o helper modificado
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertTriangle, PlusCircle } from 'lucide-react';

type FacilityWithManager = {
  id: string;
  name: string | null;
  address: string | null;
  type: string | null; // Adicionando type de volta se quiser exibir
  capacity: number | null; // Adicionando capacity de volta se quiser exibir
  description: string | null;
  status: string | null;
  profiles: {
    display_name: string | null;
  } | null;
};

export default async function FacilitiesPage() {
  // ---> Cria o cookieStore e o cliente Supabase AQUI <---
  const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

  // 1. Busca as instalações
  //    (Ajuste o select para incluir type e capacity se quiser exibi-los)
  const { data: facilities, error: facilitiesError } = await supabase
    .from('facilities')
    .select(`
      id, name, address, type, capacity, description, status,
      profiles ( display_name )
    `)
    .order('name', { ascending: true })
    .returns<FacilityWithManager[]>(); // Garanta que o tipo inclua type/capacity se selecionado

  // Log para depuração (opcional)
  // console.log("Fetched facilities data:", JSON.stringify(facilities, null, 2));
  if (facilitiesError) {
    console.error("Error during facilities fetch:", facilitiesError);
  }

  // 2. Verifica o usuário atual e sua role (usando o mesmo cliente supabase)
  const { data: { user } } = await supabase.auth.getUser();
  let userRole: string | null = null;
  // let profileDataForLog: any = null; // Removido log detalhado

  if (user) {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('user_role')
      .eq('id', user.id)
      .maybeSingle();

    if (profileError) {
        console.error("Erro ao buscar perfil do usuário:", profileError.message);
    } else if (profile) {
        userRole = profile.user_role;
        // profileDataForLog = profile;
    }
  }

  // Logs de depuração (opcional)
  // console.log("User ID:", user?.id);
  // console.log("Assigned userRole:", userRole);
  // console.log("Is Manager Check:", userRole === 'FACILITY_MANAGER');

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Cabeçalho da Página */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground text-center sm:text-left">
          Instalações Esportivas
        </h1>
        {userRole === 'FACILITY_MANAGER' && (
          <Button asChild variant="outline">
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
                className="border border-border/60 p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-card dark:bg-card/80 flex flex-col"
            >
              <h2 className="text-xl font-semibold mb-3 text-card-foreground">{facility.name ?? 'Nome não informado'}</h2>
              <div className="space-y-1.5 text-sm text-muted-foreground flex-grow mb-4">
                  <p><span className="font-medium text-card-foreground/90">Endereço:</span> {facility.address ?? 'N/A'}</p>
                  {/* Opcional: Exibir Tipo e Capacidade */}
                  <p><span className="font-medium text-card-foreground/90">Tipo:</span> {facility.type ?? 'N/A'}</p>
                  <p><span className="font-medium text-card-foreground/90">Capacidade:</span> {facility.capacity ?? 'N/A'}</p>
                  {facility.description && (
                     <p><span className="font-medium text-card-foreground/90">Descrição:</span> {facility.description}</p>
                  )}
                  <p>
                      <span className="font-medium text-card-foreground/90">Status:</span>
                      <span className={`ml-1 font-medium ${
                          facility.status === 'Active' ? 'text-green-600 dark:text-green-400' :
                          'text-muted-foreground'
                      }`}>
                          {facility.status ?? 'Indefinido'}
                      </span>
                  </p>
              </div>
              <p className="text-xs text-muted-foreground mt-3 pt-3 border-t border-border/60">
                <span className="font-medium">Gerente:</span>
                {facility.profiles?.display_name ?? 'Não atribuído'}
              </p>
            </div>
          ))}
        </div>
      ) : (
        !facilitiesError && <p className="text-center text-muted-foreground mt-10">Nenhuma instalação encontrada.</p>
      )}
    </div>
  );
}