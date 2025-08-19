"use client";

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Person, SearchFilters } from '@/types/person';
import { toast } from 'sonner';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

// Lazy loading dos componentes
const PersonCard = dynamic(() => import('@/components/PersonCard').then(mod => ({ default: mod.PersonCard })), {
  ssr: false
});

const Button = dynamic(() => import('@/components/ui/button').then(mod => ({ default: mod.Button })), {
  ssr: false
});

const Toaster = dynamic(() => import('@/components/ui/sonner').then(mod => ({ default: mod.Toaster })), {
  ssr: false
});

const HeroSectionSkeleton = dynamic(() => import('@/components/HeroSectionSkeleton').then(mod => ({ default: mod.HeroSectionSkeleton })), {
  ssr: false
});

const PersonCardGridSkeleton = dynamic(() => import('@/components/PersonCardGridSkeleton').then(mod => ({ default: mod.PersonCardGridSkeleton })), {
  ssr: false
});

// Lazy loading do HeroSection
const HeroSection = dynamic(() => import('@/components/HeroSection').then(mod => ({ default: mod.HeroSection })), {
  loading: () => <HeroSectionSkeleton />,
  ssr: false
});

export default function DesaparecidosPage() {
  const params = useParams();
  const router = useRouter();
  const resultsRef = useRef<HTMLDivElement>(null);
  const [persons, setPersons] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [statistics, setStatistics] = useState({ total: 449, localizadas: 23 });
  const [searchFilters, setSearchFilters] = useState<SearchFilters | null>(null);
  
  const pageSize = 12;
  const currentPage = parseInt(params.page as string) || 1;
  const isFirstPage = currentPage === 1;

  useEffect(() => {
    loadPersons();
    loadStatistics();
  }, [currentPage, searchFilters]);

  useEffect(() => {
    // Scroll para a seção de resultados quando a página carregar
    if (!loading && resultsRef.current) {
      resultsRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, [loading, persons]);

  const loadPersons = async () => {
    try {
      setLoading(true);
      
      // Construir URL com parâmetros de paginação e filtros
      const urlParams = new URLSearchParams({
        page: currentPage.toString(),
        pageSize: pageSize.toString()
      });

      // Adicionar filtros de busca se existirem
      if (searchFilters) {
        if (searchFilters.nome) {
          urlParams.append('nome', searchFilters.nome);
        }
        if (searchFilters.idadeMinima) {
          urlParams.append('idadeMinima', searchFilters.idadeMinima);
        }
        if (searchFilters.idadeMaxima) {
          urlParams.append('idadeMaxima', searchFilters.idadeMaxima);
        }
        if (searchFilters.sexos.length > 0) {
          searchFilters.sexos.forEach(sexo => {
            urlParams.append('sexos', sexo);
          });
        }
        if (searchFilters.status.length > 0) {
          searchFilters.status.forEach(status => {
            urlParams.append('status', status);
          });
        }
      }

      const response = await fetch(`/api/pessoas?${urlParams.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }

      const result = await response.json();
      setPersons(result.data);
      setTotalPages(Math.ceil(result.total / pageSize));
    } catch (error) {
      console.error('Erro ao carregar pessoas:', error);
      toast.error('Erro ao carregar dados. Usando dados de exemplo.');
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const response = await fetch('/api/estatisticas');
      
      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }

      const stats = await response.json();
      setStatistics(stats);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const handleSearch = (filters: SearchFilters) => {
    setSearchFilters(filters);
    // Redirecionar para página 1 quando fizer busca
    if (currentPage !== 1) {
      router.push('/');
    }
  };

  const handleClearSearch = () => {
    setSearchFilters(null);
    // Redirecionar para página 1 quando limpar busca
    if (currentPage !== 1) {
      router.push('/');
    }
  };

  const navigateToPage = (page: number) => {
    if (page === 1) {
      router.push('/');
    } else {
      router.push(`/todos/${page}`);
    }
  };



  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Apenas na primeira página */}
      {isFirstPage && (
        <HeroSection 
          totalPessoas={statistics.total}
          pessoasLocalizadas={statistics.localizadas}
          onSearch={handleSearch}
          onClear={handleClearSearch}
        />
      )}

      {/* Results Section - Fundo Branco */}
      <div ref={resultsRef} className={`font-encode-sans ${isFirstPage ? 'bg-white py-12' : 'bg-white py-8'}`}>
        <div className="max-w-7xl mx-auto px-4">
          {/* Header da seção - Apenas nas páginas 2+ */}
          {!isFirstPage && (
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-black mb-2">
                Pessoas Desaparecidas
              </h1>
              <p className="text-gray-700">
                Se você tem informações sobre alguma dessas pessoas, entre em contato conosco.
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
                Pessoas Desaparecidas
              </h2>
              <p className="text-gray-700">
                Se você tem informações sobre alguma dessas pessoas, entre em contato conosco.
              </p>
            </div>
          )}

          {/* Loading */}
          {loading && <PersonCardGridSkeleton />}

          {/* Results Grid */}
          {!loading && persons.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {persons.map((person) => (
                  <PersonCard
                    key={person.id}
                    person={person}
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
                    className="flex items-center gap-2 bg-transparent border-2 border-yellow-400 text-gray-700 hover:bg-[#877a4e] hover:text-white disabled:bg-gray-100 disabled:border-gray-300 disabled:text-gray-400"
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
                    className="flex items-center gap-2 bg-transparent border-2 border-yellow-400 text-gray-700 hover:bg-[#877a4e] hover:text-white disabled:bg-gray-100 disabled:border-gray-300 disabled:text-gray-400"
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
                Nenhuma pessoa encontrada com os filtros aplicados.
              </p>
              <Button
                onClick={handleClearSearch}
                className="bg-yellow-400 text-black hover:bg-yellow-500 border-2 border-yellow-400"
              >
                Limpar filtros
              </Button>
            </div>
          )}
        </div>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}
