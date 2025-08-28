"use client";

import { useState, useEffect } from 'react';
import { Person } from '@/types/person';
import { toast } from 'sonner';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { HeroSection } from '@/components/HeroSection';
import { PersonCard } from '@/components/PersonCard';
import { SearchFilters } from '@/types/person';
import dynamic from 'next/dynamic';

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

export default function HomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [persons, setPersons] = useState<Person[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPessoas, setTotalPessoas] = useState(449);
  const [pessoasLocalizadas, setPessoasLocalizadas] = useState(23);
  
  const pageSize = 12;

  useEffect(() => {
    // Carregar dados iniciais apenas uma vez
    loadPersons(1);
  }, []);

  const loadPersons = async (page: number = 1, filters?: SearchFilters) => {
    try {
      setLoading(true);
      
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
      setPersons(result.data);
      setTotalPages(Math.ceil(result.total / pageSize));
    } catch (error) {
      console.error('Erro ao carregar pessoas:', error);
      toast.error('Erro ao carregar dados.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (filters: SearchFilters) => {
    setCurrentPage(1);
    
    // Executar a busca diretamente sem atualizar a URL
    await loadPersons(1, filters);
    
    // Atualizar a URL apenas após a busca ser concluída
    const params = new URLSearchParams();
    params.set('page', '1');
    
    if (filters.nome) params.set('nome', filters.nome);
    if (filters.idadeMinima) params.set('idadeMinima', filters.idadeMinima);
    if (filters.idadeMaxima) params.set('idadeMaxima', filters.idadeMaxima);
    if (filters.sexos && filters.sexos.length > 0) {
      params.set('sexos', filters.sexos.join(','));
    }
    if (filters.status && filters.status.length > 0) {
      params.set('status', filters.status.join(','));
    }
    
    // Usar push em vez de replace para evitar conflitos
    router.push(`/?${params.toString()}`, { scroll: false });
  };

  const handleClear = () => {
    setCurrentPage(1);
    loadPersons(1);
    router.push('/');
  };

  const navigateToPage = (page: number) => {
    setCurrentPage(page);
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`/?${params.toString()}#resultados`);
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
                <PersonCardGridSkeleton />
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
          {totalPages > 1 && (
            <motion.div 
              className="flex justify-center items-center gap-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => navigateToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  variant="outline"
                  className="flex items-center gap-2 bg-transparent border-2 border-yellow-400 text-gray-700 hover:bg-[#877a4e] hover:text-white disabled:bg-gray-100 disabled:border-gray-300 disabled:text-gray-400"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Anterior
                </Button>
              </motion.div>
              
              <motion.span 
                className="text-gray-700 font-medium"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                Página {currentPage} de {totalPages}
              </motion.span>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => navigateToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  variant="outline"
                  className="flex items-center gap-2 bg-transparent border-2 border-yellow-400 text-gray-700 hover:bg-[#877a4e] hover:text-white disabled:bg-gray-100 disabled:border-gray-300 disabled:text-gray-400"
                >
                  Próxima
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </motion.div>
            </motion.div>
          )}

          {/* No Results */}
          <AnimatePresence>
            {!loading && persons.length === 0 && (
              <motion.div 
                className="text-center py-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <p className="text-gray-600 text-lg mb-4">
                  Nenhuma pessoa encontrada com os filtros aplicados.
                </p>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={handleClear}
                    className="bg-yellow-400 text-black hover:bg-yellow-500 border-2 border-yellow-400"
                  >
                    Limpar filtros
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      <Toaster position="top-right" />
    </motion.div>
  );
}
