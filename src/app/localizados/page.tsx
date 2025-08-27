"use client";

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Person } from '@/types/person';
import { toast } from 'sonner';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

// Lazy loading dos componentes
const PersonCard = dynamic(() => import('@/components/PersonCard').then(mod => ({ default: mod.PersonCard })), {
  ssr: false
});

const Button = dynamic(() => import('@/components/ui/button').then(mod => ({ default: mod.Button })), {
  ssr: false
});

const PersonCardGridSkeleton = dynamic(() => import('@/components/PersonCardGridSkeleton').then(mod => ({ default: mod.PersonCardGridSkeleton })), {
  ssr: false
});

export default function LocalizadosPage() {
  const router = useRouter();
  const resultsRef = useRef<HTMLDivElement>(null);
  const [persons, setPersons] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  
  const pageSize = 12;
  const currentPage = 1; // Sempre página 1 para a rota principal

  useEffect(() => {
    loadLocalizados();
  }, []);

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
      {/* Hero Section */}
      <motion.div 
        className="bg-gradient-to-r from-yellow-400 to-yellow-500 py-16"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold text-black mb-4"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            PESSOAS LOCALIZADAS
          </motion.h1>
          <motion.p 
            className="text-xl text-black/80 max-w-2xl mx-auto"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Pessoas que foram localizadas com sucesso pela Polícia Civil de Mato Grosso
          </motion.p>
        </div>
      </motion.div>

      {/* Results Section */}
      <motion.div 
        ref={resultsRef} 
        className="py-12 font-encode-sans"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            className="mb-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <h2 className="text-2xl font-bold text-black mb-2">
              Pessoas Localizadas
            </h2>
            <p className="text-gray-700">
              Pessoas que foram localizadas com sucesso e retornaram para suas famílias.
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
                  Nenhuma pessoa localizada encontrada.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
