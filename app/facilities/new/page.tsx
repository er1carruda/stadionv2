// app/page.tsx
import Link from 'next/link';
import { Building, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24 flex flex-col items-center text-center">
        <h2 className="text-2xl font-medium text-gray-700 dark:text-gray-300 mb-4">
           Bem-vindo ao Sistema de Gerenciamento Esportivo
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-10 max-w-md">
            Visualize instalações disponíveis e encontre instrutores para suas atividades.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs sm:max-w-sm justify-center">
          {/* Botão Facilities */}
          <Button asChild variant="outline" className="w-full">
            <Link href="/facilities">
              {/* Envolve o conteúdo em um span */}
              <span className="flex items-center justify-center gap-2">
                <Building className="w-4 h-4" />
                Ver Instalações
              </span>
            </Link>
          </Button>

          {/* Botão Instructors */}
          <Button asChild variant="outline" className="w-full">
            <Link href="/instructors">
              {/* Envolve o conteúdo em um span */}
               <span className="flex items-center justify-center gap-2">
                <Users className="w-4 h-4" />
                Ver Instrutores
              </span>
            </Link>
          </Button>
        </div>
    </div>
  );
}