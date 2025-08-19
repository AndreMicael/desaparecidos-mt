"use client";

import { useState, useEffect, useRef } from 'react';
import { PersonCard } from '@/components/PersonCard';
import { Button } from '@/components/ui/button';
import { Person } from '@/types/person';
import { toast } from 'sonner';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

export default function LocalizadosPage() {
  const params = useParams();
  const router = useRouter();
  const resultsRef = useRef<HTMLDivElement>(null);
  const [persons, setPersons] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  
  const pageSize = 12;
  const currentPage = parseInt(params.page as string) || 1;
  const isFirstPage = currentPage === 1;

  useEffect(() => {
    loadLocalizados();
  }, [currentPage]);

  useEffect(() => {
    // Scroll para a seção de resultados quando a página carregar
    if (!loading && resultsRef.current) {
      resultsRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, [loading, persons]);

  const loadLocalizados = async () => {
    try {
      setLoading(true);
      
      const urlParams = new URLSearchParams({
        page: currentPage.toString(),
        pageSize: pageSize.toString(),
        status: 'localizado'
      });

      const response = await fetch(`/api/pessoas?${urlParams.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }

      const result = await response.json();
      setPersons(result.data);
      setTotalPages(Math.ceil(result.total / pageSize));
    } catch (error) {
      console.error('Erro ao carregar pessoas localizadas:', error);
      toast.error('Erro ao carregar dados.');
    } finally {
      setLoading(false);
    }
  };

  const navigateToPage = (page: number) => {
    if (page === 1) {
      router.push('/localizados');
    } else {
      router.push(`/localizados/${page}`);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Apenas na primeira página */}
      {isFirstPage && (
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
              PESSOAS LOCALIZADAS
            </h1>
            <p className="text-xl text-black/80 max-w-2xl mx-auto">
              Pessoas que foram localizadas com sucesso pela Polícia Civil de Mato Grosso
            </p>
          </div>
        </div>
      )}

      {/* Results Section */}
      <div ref={resultsRef} className={`font-encode-sans ${isFirstPage ? 'py-12' : 'py-8'}`}>
        <div className="max-w-7xl mx-auto px-4">
          {/* Header da seção - Apenas nas páginas 2+ */}
          {!isFirstPage && (
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-black mb-2">
                Pessoas Localizadas
              </h1>
              <p className="text-gray-700">
                Pessoas que foram localizadas com sucesso e retornaram para suas famílias.
              </p>
              <div className="mt-4 text-sm text-gray-500">
                Página {currentPage} de {totalPages}
              </div>
            </div>
          )}

          {/* Header da seção - Apenas na primeira página */}
          {isFirstPage && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-black mb-2">
                Pessoas Localizadas
              </h2>
              <p className="text-gray-700">
                Pessoas que foram localizadas com sucesso e retornaram para suas famílias.
              </p>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
              <span className="ml-2 text-gray-600">Carregando...</span>
            </div>
          )}

          {/* Results Grid */}
          {!loading && persons.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {persons.map((person) => (
                  <PersonCard
                    key={person.id}
                    person={person}
                    onClick={() => {
                      // Aqui você pode implementar a navegação para a página de detalhes
                      console.log('Pessoa selecionada:', person);
                    }}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4">
                  <Button
                    onClick={() => navigateToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    variant="outline"
                    className="flex items-center gap-2 bg-white border-2 border-black text-black hover:bg-black hover:text-white"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Anterior
                  </Button>
                  
                  <span className="text-gray-700 font-medium">
                    Página {currentPage} de {totalPages}
                  </span>
                  
                  <Button
                    onClick={() => navigateToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    variant="outline"
                    className="flex items-center gap-2 bg-white border-2 border-black text-black hover:bg-black hover:text-white"
                  >
                    Próxima
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </>
          )}

          {/* No Results */}
          {!loading && persons.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg mb-4">
                Nenhuma pessoa localizada encontrada.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
