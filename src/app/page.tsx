"use client";

import { useState, useEffect, Suspense } from 'react';
import { Person } from '@/types/person';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { HeroSection } from '@/components/HeroSection';
import { PersonCard } from '@/components/PersonCard';
import { SearchFilters } from '@/types/person';
import { usePagination } from '@/hooks/usePagination';
import { Pagination } from '@/components/ui/pagination';
import { PeopleListSkeleton, PeopleEmptyState, PeopleErrorState } from '@/components/ui/network-states';
import { useMemoizedFetch } from '@/hooks/useMemoizedFetch';
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

// Lazy loading dos componentes
const Button = dynamic(() => import('@/components/ui/button').then(mod => ({ default: mod.Button })), {
  ssr: false
});

const PersonCardGridSkeleton = dynamic(() => import('@/components/PersonCardGridSkeleton').then(mod => ({ default: mod.PersonCardGridSkeleton })), {
  ssr: false
});

const Toaster = dynamic(() => import('@/components/ui/sonner').then(mod => ({ default: mod.Toaster })), {
  ssr: false
});

function HomePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [totalPessoas, setTotalPessoas] = useState(449);
  const [pessoasLocalizadas, setPessoasLocalizadas] = useState(23);
  
  const { currentPage, pageSize, setPage, setPageSize, updateUrl } = usePagination({
    defaultPageSize: 12,
    defaultPage: 1
  });

  // Cache para dados das pessoas
  const { 
    data: personsData, 
    loading, 
    error, 
    refetch: revalidate,
    isCached,
    isStale
  } = useMemoizedFetch<{ persons: Person[]; totalPages: number }>(
    `persons-page-${currentPage}-size-${pageSize}`,
    () => loadPersons(currentPage),
    {
      cacheTime: 5 * 60 * 1000, // 5 minutos
      staleTime: 1 * 60 * 1000, // 1 minuto
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    }
  );

  const persons = personsData?.persons || [];
  const totalPages = personsData?.totalPages || 1;

  const loadPersons = async (page: number = 1, filters?: SearchFilters): Promise<{ persons: Person[]; totalPages: number }> => {
    const urlParams = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString()
    });

    // Adicionar filtros se fornecidos
    if (filters) {
      if (filters.nome) urlParams.append('nome', filters.nome);
      if (filters.idadeMinima) urlParams.append('idadeMinima', filters.idadeMinima);
      if (filters.idadeMaxima) urlParams.append('idadeMaxima', filters.idadeMaxima);
      if (filters.sexos && filters.sexos.length > 0) {
        filters.sexos.forEach(sexo => urlParams.append('sexos', sexo));
      }
      if (filters.status && filters.status.length > 0) {
        filters.status.forEach(status => urlParams.append('status', status));
      }
    }

    const response = await fetch(`/api/pessoas?${urlParams.toString()}`);
    
    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status}`);
    }

    const result = await response.json();
    const totalPages = Math.ceil(result.total / pageSize);
    
    // Atualizar estatísticas globais
    setTotalPessoas(result.total);
    const localizadas = result.data.filter((p: Person) => p.localizado).length;
    setPessoasLocalizadas(localizadas);
    
    return {
      persons: result.data,
      totalPages
    };
  };

  const handleSearch = async (filters: SearchFilters) => {
    // Reset para página 1 ao fazer nova busca
    setPage(1);
    
    // Atualizar a URL com os filtros
    const params: Record<string, string> = {};
    
    if (filters.nome) params.nome = filters.nome;
    if (filters.idadeMinima) params.idadeMinima = filters.idadeMinima;
    if (filters.idadeMaxima) params.idadeMaxima = filters.idadeMaxima;
    if (filters.sexos && filters.sexos.length > 0) {
      params.sexos = filters.sexos.join(',');
    }
    if (filters.status && filters.status.length > 0) {
      params.status = filters.status.join(',');
    }
    
    updateUrl(params);
    
    // Revalidar cache com novos filtros
    revalidate();
  };

  const handleClear = () => {
    setPage(1);
    router.push('/');
    revalidate();
  };


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Hero Section with integrated search */}
      <HeroSection 
        totalPessoas={totalPessoas}
        pessoasLocalizadas={pessoasLocalizadas}
        onSearch={handleSearch}
        onClear={handleClear}
      />

      {/* Results Section - Fundo Branco */}
      <motion.div 
        id="resultados"
        className="bg-white py-12 font-encode-sans"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4">
          {/* Barra de Busca Rápida - Aparece em todas as páginas */}
          <motion.div 
            className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="max-w-2xl mx-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                Busca Rápida
              </h3>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Digite o nome da pessoa..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-black"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const target = e.target as HTMLInputElement;
                      if (target.value.trim()) {
                        handleSearch({ 
                          nome: target.value.trim(),
                          idadeMinima: '',
                          idadeMaxima: '',
                          sexos: [],
                          status: []
                        });
                        target.value = '';
                      }
                    }
                  }}
                />
                <motion.button
                  onClick={() => {
                    const input = document.querySelector('input[placeholder="Digite o nome da pessoa..."]') as HTMLInputElement;
                    if (input && input.value.trim()) {
                      handleSearch({ 
                        nome: input.value.trim(),
                        idadeMinima: '',
                        idadeMaxima: '',
                        sexos: [],
                        status: []
                      });
                      input.value = '';
                    }
                  }}
                  className="px-6 py-2 bg-yellow-400 text-white rounded-md hover:bg-yellow-500 transition-colors font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Buscar
                </motion.button>
                <motion.button
                  onClick={handleClear}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Limpar
                </motion.button>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="mb-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <h2 className="text-2xl font-bold text-black mb-2">
              Pessoas Desaparecidas
            </h2>
            <p className="text-gray-700">
              Se você tem informações sobre alguma dessas pessoas, entre em contato conosco.
            </p>
          </motion.div>

          {/* Loading */}
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <PeopleListSkeleton count={pageSize} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results Grid */}
          <AnimatePresence>
            {!loading && persons.length > 0 && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8"
              >
                {persons.map((person, index) => (
                  <motion.div
                    key={person.id}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 }
                    }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <PersonCard
                      person={person}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
            totalItems={totalPessoas}
            className="mt-8"
          />

          {/* Error State */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <PeopleErrorState onRetry={revalidate} error={error} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Empty State */}
          <AnimatePresence>
            {!loading && !error && persons.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <PeopleEmptyState onRetry={revalidate} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      <Toaster position="top-right" />
    </motion.div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-yellow-400" />
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    }>
      <HomePageContent />
    </Suspense>
  );
}
