"use client";

import { useState, useEffect } from 'react';
import { Person } from '@/types/person';
import { toast } from 'sonner';
import { Loader2, ArrowLeft, Phone, Mail, MapPin, Calendar, FileImage, Eye, EyeOff, User, Clock, MessageSquare } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { PersonPhoto } from '@/components/ui/optimized-image';
import { PosterGenerator } from '@/components/PosterGenerator';
import { InformationForm } from '@/components/InformationForm';
import { motion, AnimatePresence } from 'framer-motion';
import { getSimpleStatusBadgeClasses } from '@/lib/status-colors';
import { UsefulActions } from '@/components/UsefulActions';

// Lazy loading dos componentes
const Button = dynamic(() => import('@/components/ui/button').then(mod => ({ default: mod.Button })), {
  ssr: false
});

const Toaster = dynamic(() => import('@/components/ui/sonner').then(mod => ({ default: mod.Toaster })), {
  ssr: false
});

interface Information {
  id: string;
  personId: string;
  informantName: string;
  informantPhone: string | null;
  informantEmail: string | null;
  sightingDate: string | null;
  sightingLocation: string;
  description: string;
  photos: string | null;
  createdAt: string;
  updatedAt: string;
  ocoId?: number;
  informacao?: string;
  descricao?: string;
  data?: string;
  files?: string[];
}

export default function DesaparecidoPage() {
  const params = useParams();
  const router = useRouter();
  const [person, setPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPosterGenerator, setShowPosterGenerator] = useState(false);
  const [showInformationForm, setShowInformationForm] = useState(false);
  const [informations, setInformations] = useState<Information[]>([]);
  const [loadingInformations, setLoadingInformations] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showInformations, setShowInformations] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const personId = params.id as string;

  useEffect(() => {
    loadPerson();
    checkAdminStatus();
  }, [personId]);

  const checkAdminStatus = () => {
    const token = localStorage.getItem('adminToken');
    setIsAdmin(!!token);
  };

  // Funções de paginação
  const totalPages = Math.ceil(informations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentInformations = informations.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const resetPagination = () => {
    setCurrentPage(1);
  };

  const loadInformations = async () => {
    if (!isAdmin) return;
    
    try {
      setLoadingInformations(true);
      
      // Buscar informações específicas desta pessoa
      const response = await fetch(`/api/admin/informations/pessoa/${personId}`);
      const data = await response.json();
      
      if (data.success && data.data) {
        // Mapear dados da API externa para o formato esperado
        const mappedInformations = data.data.map((info: any, index: number) => ({
          id: info.id || `ext_${info.ocoId}_${index}`,
          personId: info.personId || personId,
          informantName: info.descricao || 'Informante Anônimo',
          informantPhone: null,
          informantEmail: null,
          sightingDate: info.data || null,
          sightingLocation: 'Local não especificado',
          description: info.informacao || info.descricao || 'Sem descrição disponível',
          photos: info.files ? info.files.join(',') : null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          // Campos originais da API externa
          ocoId: info.ocoId,
          informacao: info.informacao,
          descricao: info.descricao,
          data: info.data,
          files: info.files
        }));
        
        setInformations(mappedInformations);
        resetPagination(); // Resetar para a primeira página
        console.log('Informações carregadas para pessoa:', personId, mappedInformations.length);
      } else {
        console.log('Nenhuma informação encontrada para pessoa:', personId);
        setInformations([]);
      }
    } catch (error) {
      console.error('Erro ao carregar informações:', error);
      toast.error('Erro ao carregar informações');
      setInformations([]);
    } finally {
      setLoadingInformations(false);
    }
  };

  const loadPerson = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/pessoas/${personId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Pessoa não encontrada');
        } else {
          throw new Error(`Erro na API: ${response.status}`);
        }
        return;
      }

      const result = await response.json();
      setPerson(result.data);
    } catch (error) {
      console.error('Erro ao carregar pessoa:', error);
      setError('Erro ao carregar dados da pessoa');
      toast.error('Erro ao carregar dados.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <motion.div 
        className="min-h-screen bg-white flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <motion.div 
          className="text-center"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="w-8 h-8 text-yellow-500 mx-auto mb-4" />
          </motion.div>
        </motion.div>
      </motion.div>
    );
  }

  if (error || !person) {
    return (
      <motion.div 
        className="min-h-screen bg-white flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <motion.div 
          className="text-center"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            {error || 'Pessoa não encontrada'}
          </h1>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button onClick={handleBack} className="bg-yellow-400 text-black hover:bg-yellow-500">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    );
  }


  const daysSinceDisappearance = person.dtDesaparecimento 
    ? Math.floor((new Date().getTime() - new Date(person.dtDesaparecimento).getTime()) / (1000 * 3600 * 24))
    : null;

  return (
    <motion.div 
      className="min-h-screen bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header com botão voltar */}
      <motion.div 
        className="bg-white border-b border-gray-200"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="max-w-4xl mx-auto px-4 py-3">
          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
            <Button
              onClick={handleBack}
              variant="ghost"
              className="text-gray-700 hover:bg-gray-50 border border-gray-300 hover:border-gray-400"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="py-4 md:py-8">
        <div className="max-w-4xl mx-auto px-3 md:px-4">
          {/* Card Principal */}
          <motion.div 
            className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="p-4 md:p-6">
              <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
                {/* Foto */}
                <motion.div 
                  className="flex-shrink-0 mx-auto lg:mx-0"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <motion.div 
                    className="w-48 h-64 sm:w-56 sm:h-72 lg:w-64 lg:h-80 bg-gray-100 rounded-lg overflow-hidden border border-gray-300"
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.15 }}
                  >
                    <PersonPhoto
                      src={person.foto && person.foto.trim() !== '' ? person.foto : '/sem-foto.svg'}
                      alt={person.nome}
                      size="lg"
                      className="w-full h-full object-cover"
                      priority={true}
                    />
                  </motion.div>
                </motion.div>

                {/* Informações */}
                <motion.div 
                  className="flex-1 space-y-3 md:space-y-4"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  {/* Badge de Status */}
                  <motion.div 
                    className="flex justify-center lg:justify-start"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.5 }}
                  >
                    <span className={getSimpleStatusBadgeClasses(false)}>
                      Desaparecido
                    </span>
                  </motion.div>

                  {/* Nome */}
                  <motion.div 
                    className="text-center lg:text-left"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                  >
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 mb-1">
                      {person.nome}
                    </h1>
                    <p className="text-gray-600 text-base sm:text-lg font-light">
                      {person.idade && `${person.idade} anos`} {person.idade && person.sexo && ' • '} 
                      {person.sexo && <span className="capitalize">{person.sexo}</span>}
                    </p>
                  </motion.div>

                  {/* Dados sobre o Desaparecimento */}
                  <motion.div 
                    className="space-y-4 border-t border-gray-100 pt-4"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                  >
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 text-center lg:text-left">
                      Informações do Desaparecimento
                    </h3>
                    
                    <div className="grid grid-cols-1 gap-3 text-sm">
                      {person.dtDesaparecimento && (
                        <motion.div 
                          className="flex items-start gap-3 text-center lg:text-left"
                          initial={{ x: -10, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ duration: 0.4, delay: 0.8 }}
                        >
                          <svg className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <div>
                            <span className="font-medium text-gray-700">Data:</span>
                            <span className="ml-2 text-gray-600">{new Date(person.dtDesaparecimento).toLocaleDateString('pt-BR')}</span>
                          </div>
                        </motion.div>
                      )}
                      {person.localDesaparecimentoConcat && (
                        <motion.div 
                          className="flex items-start gap-3 text-center lg:text-left"
                          initial={{ x: -10, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ duration: 0.4, delay: 0.9 }}
                        >
                          <svg className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <div>
                            <span className="font-medium text-gray-700">Local:</span>
                            <span className="ml-2 text-gray-600">{person.localDesaparecimentoConcat.charAt(0).toUpperCase() + person.localDesaparecimentoConcat.slice(1)}</span>
                          </div>
                        </motion.div>
                      )}
                    </div>

                    {person.ultimaOcorrencia && (
                      <motion.div 
                        className="text-center lg:text-left"
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.4, delay: 1.0 }}
                      >
                        <div className="flex items-start gap-3">
                          <svg className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div>
                            <span className="font-medium text-gray-700">Informações adicionais:</span>
                            <p className="mt-1 text-gray-600 leading-relaxed text-sm">
                              {person.ultimaOcorrencia}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Badge de dias desaparecido */}
                  {daysSinceDisappearance && (
                    <motion.div 
                      className="bg-gray-100 border border-gray-300 rounded-sm p-3"
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.4, delay: 1.1 }}
                    >
                      <div className="flex items-center gap-2 justify-center lg:justify-start">
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-gray-700 font-medium text-sm sm:text-base text-center lg:text-left">
                          Desaparecido há {daysSinceDisappearance} dias
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* Botões de Ação */}
                  <motion.div 
                    className="pt-4 border-t border-gray-100 space-y-3"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1.2 }}
                  >
                  

                    {/* Botão Registrar Informações */}
                    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                      <Button 
                        className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-medium py-3 px-6 rounded-sm text-sm sm:text-base transition-colors duration-200 border-2 border-yellow-400"
                        onClick={() => setShowInformationForm(true)}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          TEM INFORMAÇÕES? CLIQUE AQUI
                        </div>
                      </Button>
                    </motion.div>
                  </motion.div>
  {/* Botão Principal - Ligar */}
  <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                      <Button 
                        className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-sm text-sm sm:text-base transition-colors duration-200"
                        onClick={() => {
                          const phoneNumber = '197';
                          const message = `Tenho informações sobre ${person.nome}, pessoa desaparecida desde ${person.dtDesaparecimento ? new Date(person.dtDesaparecimento).toLocaleDateString('pt-BR') : 'data não informada'}.`;
                          window.open(`tel:${phoneNumber}`, '_self');
                        }}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                           LIGUE 197
                        </div>
                      </Button>
                    </motion.div>
                  {/* Ações Úteis */}
                  <motion.div 
                    className="pt-4 border-t border-gray-100"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1.3 }}
                  >
                    <UsefulActions person={person} />
                    
                    {/* Botão de Cartaz - só aparece se tiver foto */}
                    {person.foto && (
                      <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                        <Button
                          onClick={() => setShowPosterGenerator(true)}
                          className="w-full bg-black text-white  cursor-pointer hover:text-black hover:bg-gray-50 hover:outline-2 hover:outline-black 00"
                        >
                          <div className="flex items-center justify-center gap-2">
                            <FileImage className="w-4 h-4" />
                            Gerar Cartaz para Impressão
                          </div>
                        </Button>
                      </motion.div>
                    )}
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Seção de Contato */}
          <motion.div 
            className="mt-6 sm:mt-8 bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.4 }}
          >
            <h3 className="text-lg font-medium text-gray-900 mb-4 text-center sm:text-left">
              Informações de Contato
            </h3>
            <div className="bg-gray-50 border border-gray-200 rounded-sm p-4">
              <p className="text-gray-700 mb-4 text-sm sm:text-base text-center sm:text-left">
                Se você tem informações sobre esta pessoa, entre em contato:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <motion.div 
                  className="flex items-center gap-3 text-gray-700 justify-center sm:justify-start"
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 1.5 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <svg className="w-5 h-5 text-gray-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div className="text-center sm:text-left">
                    <p className="font-medium text-sm sm:text-base text-gray-900">197 - Polícia Civil</p>
                    <p className="text-xs sm:text-sm text-gray-600">Disque Denúncia</p>
                  </div>
                </motion.div>
                <motion.div 
                  className="flex items-center gap-3 text-gray-700 justify-center sm:justify-start"
                  initial={{ x: 10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 1.6 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <svg className="w-5 h-5 text-gray-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div className="text-center sm:text-left">
                    <p className="font-medium text-xs sm:text-sm text-gray-900 break-all">desaparecidos@policiacivil.mt.gov.br</p>
                    <p className="text-xs sm:text-sm text-gray-600">E-mail oficial</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Seção de Informações */}
          {!isAdmin && (
            <motion.div 
              className="mt-6 sm:mt-8 bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.5 }}
            >
              <div className="text-center">
                <div className="mb-4">
                  <MessageSquare className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Informações Recebidas
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Existem informações sobre esta pessoa, mas elas são visíveis apenas para administradores.
                  </p>
                </div>
                
                <motion.button
                  onClick={() => router.push('/admin/login')}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-white font-medium rounded-md transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Fazer Login como Admin
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Seção de Informações (Apenas para Admin) */}
          {isAdmin && (
            <motion.div 
              className="mt-6 sm:mt-8 bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.5 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Informações Recebidas
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    Admin
                  </span>
                </h3>
                <motion.button
                  onClick={() => {
                    if (!showInformations) {
                      loadInformations();
                    }
                    setShowInformations(!showInformations);
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-sm bg-black hover:bg-gray-500 rounded-md transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {showInformations ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  {showInformations ? 'Ocultar' : 'Ver'} Informações
                </motion.button>
              </div>

              <AnimatePresence>
                {showInformations && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    {loadingInformations ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
                        <span className="ml-2 text-gray-500">Carregando informações...</span>
                      </div>
                    ) : informations.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>Nenhuma informação recebida ainda</p>
                        <p className="text-sm mt-1">As informações aparecerão aqui quando forem enviadas</p>
                      </div>
                    ) : (
                      <div>
                        {/* Informações de paginação */}
                        <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                          <span>
                            Mostrando {startIndex + 1} a {Math.min(endIndex, informations.length)} de {informations.length} informações
                          </span>
                          {totalPages > 1 && (
                            <span>
                              Página {currentPage} de {totalPages}
                            </span>
                          )}
                        </div>

                        {/* Lista de informações */}
                        <div className="space-y-4">
                          {currentInformations.map((info, index) => (
                          <motion.div
                            key={info.id}
                            className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                          >
                            <div className="flex items-start justify-between mb-3">
                            
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Clock className="w-4 h-4" />
                                {new Date(info.createdAt).toLocaleDateString('pt-BR')}
                              </div>
                            </div>

                            <div className="space-y-2 text-sm">
                              {info.sightingLocation && (
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4 text-gray-500" />
                                  <span className="text-gray-700">
                                    <strong>Local:</strong> {info.sightingLocation}
                                  </span>
                                </div>
                              )}
                              
                              {info.sightingDate && (
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4 text-gray-500" />
                                  <span className="text-gray-700">
                                    <strong>Data do avistamento:</strong> {info.sightingDate}
                                  </span>
                                </div>
                              )}

                              {info.informantPhone && (
                                <div className="flex items-center gap-2">
                                  <Phone className="w-4 h-4 text-gray-500" />
                                  <span className="text-gray-700">
                                    <strong>Telefone:</strong> {info.informantPhone}
                                  </span>
                                </div>
                              )}

                              {info.informantEmail && (
                                <div className="flex items-center gap-2">
                                  <Mail className="w-4 h-4 text-gray-500" />
                                  <span className="text-gray-700">
                                    <strong>Email:</strong> {info.informantEmail}
                                  </span>
                                </div>
                              )}
                            </div>

                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <p className="text-gray-700">
                                <strong>Descrição:</strong>
                              </p>
                              <p className="text-gray-600 mt-1 leading-relaxed">
                                {info.description || info.informacao || 'Sem descrição disponível'}
                              </p>
                            </div>

                            {info.photos && (
                              <div className="mt-3 pt-3 border-t border-gray-200">
                                <p className="text-sm text-gray-700 mb-2">
                                  <strong>Fotos anexadas:</strong> {info.photos.split(',').length} arquivo(s)
                                </p>
                                <div className="flex gap-2">
                                  {info.photos.split(',').map((photo, photoIndex) => (
                                    <div key={photoIndex} className="w-16 h-16 bg-gray-200 rounded border overflow-hidden">
                                      <img
                                        src={photo.trim()}
                                        alt={`Anexo ${photoIndex + 1}`}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                          const target = e.target as HTMLImageElement;
                                          target.src = '/sem-foto.svg';
                                        }}
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between">
                              <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-600">
                                Ativa
                              </span>
                              <span className="text-xs text-gray-500">
                                ID: {info.id}
                              </span>
                            </div>
                          </motion.div>
                        ))}
                        </div>

                        {/* Controles de paginação */}
                        {totalPages > 1 && (
                          <motion.div 
                            className="flex items-center justify-center gap-2 mt-6 pt-4 border-t border-gray-200"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                          >
                            {/* Botão Anterior */}
                            <motion.button
                              onClick={() => handlePageChange(currentPage - 1)}
                              disabled={currentPage === 1}
                              className={`flex items-center gap-1 px-3 py-2 text-sm rounded-md transition-colors ${
                                currentPage === 1
                                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                              }`}
                              whileHover={currentPage !== 1 ? { scale: 1.05 } : {}}
                              whileTap={currentPage !== 1 ? { scale: 0.95 } : {}}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                              </svg>
                              Anterior
                            </motion.button>

                            {/* Números das páginas */}
                            <div className="flex items-center gap-1">
                              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                                // Mostrar apenas algumas páginas ao redor da página atual
                                const showPage = 
                                  page === 1 || 
                                  page === totalPages || 
                                  (page >= currentPage - 1 && page <= currentPage + 1);

                                if (!showPage) {
                                  // Mostrar reticências se necessário
                                  if (page === currentPage - 2 || page === currentPage + 2) {
                                    return (
                                      <span key={page} className="px-2 py-1 text-gray-400">
                                        ...
                                      </span>
                                    );
                                  }
                                  return null;
                                }

                                return (
                                  <motion.button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`px-3 py-2 text-sm rounded-md transition-colors ${
                                      page === currentPage
                                        ? 'bg-yellow-400 text-black font-medium'
                                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                                    }`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    {page}
                                  </motion.button>
                                );
                              })}
                            </div>

                            {/* Botão Próximo */}
                            <motion.button
                              onClick={() => handlePageChange(currentPage + 1)}
                              disabled={currentPage === totalPages}
                              className={`flex items-center gap-1 px-3 py-2 text-sm rounded-md transition-colors ${
                                currentPage === totalPages
                                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                              }`}
                              whileHover={currentPage !== totalPages ? { scale: 1.05 } : {}}
                              whileTap={currentPage !== totalPages ? { scale: 0.95 } : {}}
                            >
                              Próximo
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </motion.button>
                          </motion.div>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
      <Toaster position="top-right" />
      
      {/* Gerador de Cartaz */}
      <AnimatePresence>
        {person && showPosterGenerator && (
          <PosterGenerator
            person={person}
            isOpen={showPosterGenerator}
            onClose={() => setShowPosterGenerator(false)}
          />
        )}
      </AnimatePresence>

      {/* Formulário de Informações */}
      <AnimatePresence>
        {person && showInformationForm && (
          <InformationForm
            isOpen={showInformationForm}
            onClose={() => setShowInformationForm(false)}
            personId={person.id.toString()}
            personName={person.nome}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
