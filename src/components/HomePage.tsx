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

interface HomePageProps {
  onPersonClick: (person: Person) => void;
}

export function HomePage({ onPersonClick }: HomePageProps) {
  const [persons, setPersons] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState<'desaparecidos' | 'localizados' | 'como-ajudar' | 'contato'>('desaparecidos');
  const [statistics, setStatistics] = useState({ total: 449, localizadas: 127 });
  const [searchFilters, setSearchFilters] = useState<SearchFilters | null>(null);
  
  const pageSize = 12;

  useEffect(() => {
    loadPersons();
    loadStatistics();
  }, [currentPage, searchFilters]);

  const loadPersons = async () => {
    try {
      setLoading(true);
      
      // Construir URL com parâmetros de paginação apenas
      const urlParams = new URLSearchParams({
        page: currentPage.toString(),
        pageSize: pageSize.toString()
      });

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

            {/* Results Section - Fundo Branco */}
            <div className="bg-white py-12 font-encode-sans">
              <div className="max-w-7xl mx-auto px-4">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-black mb-2">
                    {activeTab === 'desaparecidos' ? 'Pessoas Desaparecidas' : 'Pessoas Localizadas'}
                  </h2>
                  <p className="text-gray-700">
                    {activeTab === 'desaparecidos' 
                      ? 'Se você tem informações sobre alguma dessas pessoas, entre em contato conosco.'
                      : 'Pessoas que foram localizadas com sucesso.'
                    }
                  </p>
                </div>

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
                          onClick={() => onPersonClick(person)}
                        />
                      ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex justify-center items-center gap-4">
                        <Button
                          onClick={prevPage}
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
                          onClick={nextPage}
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
          </>
        );

      case 'como-ajudar':
        return (
          <div className="bg-black text-white py-16 font-encode-sans">
            <div className="max-w-4xl mx-auto px-4">
              <h1 className="text-3xl font-bold text-yellow-400 mb-8">Como Ajudar</h1>
              
              <div className="space-y-8">
                <div className="bg-gray-900 p-6 rounded-lg">
                  <h2 className="text-xl font-bold text-yellow-400 mb-4">Relatando Informações</h2>
                  <p className="text-gray-300 mb-4">
                    Se você tem informações sobre uma pessoa desaparecida, entre em contato conosco imediatamente:
                  </p>
                  <ul className="list-disc list-inside text-gray-300 space-y-2">
                    <li>Telefone: (65) 3648-5100</li>
                    <li>Email: atendimento@policiacivil.gov.br</li>
                    <li>Presencialmente em qualquer delegacia</li>
                  </ul>
                </div>

                <div className="bg-gray-900 p-6 rounded-lg">
                  <h2 className="text-xl font-bold text-yellow-400 mb-4">Compartilhando</h2>
                  <p className="text-gray-300">
                    Compartilhe as informações sobre pessoas desaparecidas em suas redes sociais. 
                    Sua divulgação pode ser fundamental para reunir famílias.
                  </p>
                </div>

                <div className="bg-gray-900 p-6 rounded-lg">
                  <h2 className="text-xl font-bold text-yellow-400 mb-4">Sendo Voluntário</h2>
                  <p className="text-gray-300">
                    Participe de grupos de busca organizados e ajude na divulgação de casos. 
                    Entre em contato conosco para saber como se voluntariar.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'contato':
        return (
          <div className="bg-black text-white py-16 font-encode-sans">
            <div className="max-w-4xl mx-auto px-4">
              <h1 className="text-3xl font-bold text-yellow-400 mb-8">Contato</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-900 p-6 rounded-lg">
                  <h2 className="text-xl font-bold text-yellow-400 mb-4">Central de Atendimento</h2>
                  <div className="space-y-2 text-gray-300">
                    <p><strong className="text-white">Telefone:</strong> (65) 3648-5100</p>
                    <p><strong className="text-white">Email:</strong> atendimento@policiacivil.gov.br</p>
                    <p><strong className="text-white">Horário:</strong> 24 horas</p>
                  </div>
                </div>

                <div className="bg-gray-900 p-6 rounded-lg">
                  <h2 className="text-xl font-bold text-yellow-400 mb-4">Endereço</h2>
                  <div className="text-gray-300 space-y-1">
                    <p>Polícia Civil do Estado de Mato Grosso</p>
                    <p>Unidade de Pessoas Desaparecidas</p>
                    <p>Cuiabá - MT</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 bg-gray-900 p-6 rounded-lg">
                <h2 className="text-xl font-bold text-yellow-400 mb-4">Redes Sociais</h2>
                <p className="text-gray-300">
                  Siga-nos nas redes sociais para acompanhar atualizações e informações importantes.
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white font-encode-sans">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      {renderContent()}
      <Footer />
    </div>
  );
}
