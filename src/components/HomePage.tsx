"use client";

import { useState, useEffect } from 'react';
import { PersonCard } from './PersonCard';
import { Header } from './Header';
import { HeroSection } from './HeroSection';
import { Footer } from './Footer';
import { Button } from './ui/button';
import { Person, SearchFilters } from '@/types/person';
import { toast } from 'sonner';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HomePageProps {
  onPersonClick: (person: Person) => void;
}

export function HomePage({ onPersonClick }: HomePageProps) {
  const [persons, setPersons] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState<'desaparecidos' | 'localizados' | 'como-ajudar' | 'contato'>('desaparecidos');
  const [statistics, setStatistics] = useState({ total: 449, localizadas: 23 });
  const [searchFilters, setSearchFilters] = useState<SearchFilters | null>(null);
  
  const pageSize = 12;

  useEffect(() => {
    loadPersons();
    loadStatistics();
  }, [currentPage, searchFilters]);

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
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchFilters(null);
    setCurrentPage(1);
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
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

  const renderContent = () => {
    switch (activeTab) {
      case 'desaparecidos':
      case 'localizados':
        return (
          <>
            {/* Hero Section with integrated search */}
            <HeroSection 
              totalPessoas={statistics.total}
              pessoasLocalizadas={statistics.localizadas}
              onSearch={handleSearch}
              onClear={handleClearSearch}
            />

            {/* Seção de Resultados - Fundo Branco */}
            <motion.div 
              className="bg-white py-12 font-encode-sans"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="max-w-7xl mx-auto px-4">
                <motion.div 
                  className="mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <h2 className="text-2xl font-bold text-black mb-2">
                    {activeTab === 'desaparecidos' ? 'Pessoas Desaparecidas' : 'Pessoas Localizadas'}
                  </h2>
                  <p className="text-gray-700">
                    {activeTab === 'desaparecidos' 
                      ? 'Se você tem informações sobre alguma dessas pessoas, entre em contato conosco.'
                      : 'Pessoas que foram localizadas com sucesso.'
                    }
                  </p>
                </motion.div>

                {/* Loading */}
                <AnimatePresence>
                  {loading && (
                    <motion.div 
                      className="flex justify-center items-center py-12"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Loader2 className="w-8 h-8 text-yellow-500" />
                      </motion.div>
                      <span className="ml-2 text-gray-600">Carregando...</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Results Grid */}
                <AnimatePresence mode="wait">
                  {!loading && persons.length > 0 && (
                    <motion.div
                      key={`page-${currentPage}`}
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
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
                            onClick={() => onPersonClick(person)}
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
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        onClick={prevPage}
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
                        onClick={nextPage}
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
                          onClick={handleClearSearch}
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
          </>
        );

      case 'como-ajudar':
        return (
          <motion.div 
            className="bg-white text-white py-16 font-encode-sans"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="max-w-4xl mx-auto px-4">
              <motion.h1 
                className="text-3xl font-bold text-slate-900 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Como Ajudar
              </motion.h1>
              
              <div className="space-y-8">
                {[
                  {
                    title: "Relatando Informações",
                    content: "Se você tem informações sobre uma pessoa desaparecida, entre em contato conosco imediatamente:",
                    items: [
                      "Telefone: (65) 3648-5100",
                      "Email: atendimento@policiacivil.gov.br",
                      "Presencialmente em qualquer delegacia"
                    ]
                  },
                  {
                    title: "Compartilhando",
                    content: "Compartilhe as informações sobre pessoas desaparecidas em suas redes sociais. Sua divulgação pode ser fundamental para reunir famílias."
                  },
                  {
                    title: "Sendo Voluntário",
                    content: "Participe de grupos de busca organizados e ajude na divulgação de casos. Entre em contato conosco para saber como se voluntariar."
                  }
                ].map((section, index) => (
                  <motion.div 
                    key={section.title}
                    className="border-2 border-slate-200 p-6 rounded-lg"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                  >
                    <h2 className="text-xl font-bold text-slate-900 mb-4">{section.title}</h2>
                    <p className="text-slate-800 mb-4">{section.content}</p>
                    {section.items && (
                      <ul className="list-disc list-inside text-slate-800 space-y-2">
                        {section.items.map((item, itemIndex) => (
                          <motion.li 
                            key={itemIndex}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.5 + index * 0.1 + itemIndex * 0.1 }}
                          >
                            {item}
                          </motion.li>
                        ))}
                      </ul>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        );

      case 'contato':
        return (
          <motion.div 
            className="bg-white text-slate-900 py-16 font-encode-sans"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="max-w-4xl mx-auto px-4">
              <motion.h1 
                className="text-3xl font-bold text-slate-900 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Contato
              </motion.h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  {
                    title: "Central de Atendimento",
                    content: [
                      { label: "Telefone:", value: "(65) 3648-5100" },
                      { label: "Email:", value: "atendimento@policiacivil.gov.br" },
                      { label: "Horário:", value: "24 horas" }
                    ]
                  },
                  {
                    title: "Endereço",
                    content: [
                      { value: "Polícia Civil do Estado de Mato Grosso" },
                      { value: "Unidade de Pessoas Desaparecidas" },
                      { value: "Cuiabá - MT" }
                    ]
                  }
                ].map((section, index) => (
                  <motion.div 
                    key={section.title}
                    className="border-2 border-slate-200 p-6 rounded-lg"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                  >
                    <h2 className="text-xl font-bold text-slate-900 mb-4">{section.title}</h2>
                    <div className="space-y-2 text-slate-800">
                      {section.content.map((item, itemIndex) => (
                        <motion.p 
                          key={itemIndex}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: 0.5 + index * 0.1 + itemIndex * 0.1 }}
                        >
                          {'label' in item && item.label && <strong className="text-white">{item.label}</strong>} {item.value}
                        </motion.p>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div 
                className="mt-8 border-2 border-slate-200 p-6 rounded-lg"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <h2 className="text-xl font-bold text-slate-900 mb-4">Redes Sociais</h2>
                <p className="text-slate-800">
                  Siga-nos nas redes sociais para acompanhar atualizações e informações importantes.
                </p>
              </motion.div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white font-encode-sans">
     <HeroSection onSearch={() => {}} onClear={() => {}} />
     
    </div>
  );
}
