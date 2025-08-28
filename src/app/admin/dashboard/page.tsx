"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Search, Filter, Eye, Calendar, MapPin, User, Phone, Mail, FileText, Image as ImageIcon, ExternalLink, Archive, ArchiveX } from 'lucide-react';
import { toast } from 'sonner';

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
  archived: boolean;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Person {
  id: number;
  nome: string;
  foto?: string;
}

export default function AdminDashboard() {
  const [informations, setInformations] = useState<Information[]>([]);
  const [persons, setPersons] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<string>('all');
  const [showDetails, setShowDetails] = useState<string | null>(null);
  const [showPhotoModal, setShowPhotoModal] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'active' | 'archived'>('active');
  const router = useRouter();

  useEffect(() => {
    // Verificar se está logado
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    loadData();
  }, [router]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Carregar pessoas
      const personsResponse = await fetch('/api/pessoas?pageSize=1000');
      const personsData = await personsResponse.json();
      setPersons(personsData.data || []);

      // Carregar informações
      const informationsResponse = await fetch('/api/admin/informations');
      const informationsData = await informationsResponse.json();
      setInformations(informationsData.data || []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  const handleArchive = async (informationId: string, archive: boolean) => {
    try {
      const response = await fetch(`/api/admin/informations/${informationId}/archive`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ archived: archive }),
      });

      if (!response.ok) {
        throw new Error('Erro ao arquivar informação');
      }

      toast.success(archive ? 'Informação arquivada' : 'Informação desarquivada');
      loadData(); // Recarregar dados
    } catch (error) {
      console.error('Erro ao arquivar informação:', error);
      toast.error('Erro ao arquivar informação');
    }
  };

  const filteredInformations = informations.filter(info => {
    const matchesSearch = 
      info.informantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      info.sightingLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      info.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPerson = selectedPerson === 'all' || info.personId === selectedPerson;
    const matchesTab = activeTab === 'active' ? !info.archived : info.archived;
    
    return matchesSearch && matchesPerson && matchesTab;
  });

  const getPersonName = (personId: string) => {
    const person = persons.find(p => p.id.toString() === personId);
    return person ? person.nome : 'Pessoa não encontrada';
  };

  const getPersonPhoto = (personId: string) => {
    const person = persons.find(p => p.id.toString() === personId);
    return person?.foto || '/sem-foto.svg';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <motion.div 
        className="bg-white shadow-sm border-b"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Administrativo</h1>
              <p className="text-gray-600">Gerenciamento de Informações</p>
            </div>
            {/* <motion.button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <LogOut className="w-4 h-4" />
              Sair
            </motion.button> */}
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filtros */}
        <motion.div 
          className="bg-white rounded-lg shadow-sm p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-black" />
                <input
                  type="text"
                  placeholder="Buscar por nome, local ou descrição..."
                  className="w-full pl-10 pr-4 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="md:w-64">
              <select
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                value={selectedPerson}
                onChange={(e) => setSelectedPerson(e.target.value)}
              >
                <option value="all">Todas as pessoas</option>
                {persons.map(person => (
                  <option key={person.id} value={person.id.toString()}>
                    {person.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Estatísticas */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total de Informações</p>
                <p className="text-2xl font-bold text-gray-900">{informations.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <User className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pessoas Únicas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(informations.map(info => info.personId)).size}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Calendar className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Hoje</p>
                <p className="text-2xl font-bold text-gray-900">
                  {informations.filter(info => {
                    const today = new Date().toDateString();
                    const infoDate = new Date(info.createdAt).toDateString();
                    return today === infoDate;
                  }).length}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Lista de Informações */}
        <motion.div 
          className="bg-white rounded-lg shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Informações Recebidas</h2>
              
              {/* Abas */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('active')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'active'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Ativas ({informations.filter(info => !info.archived).length})
                </button>
                <button
                  onClick={() => setActiveTab('archived')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'archived'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Arquivadas ({informations.filter(info => info.archived).length})
                </button>
              </div>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200">
            {filteredInformations.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Nenhuma informação encontrada</p>
              </div>
            ) : (
                             filteredInformations.map((info, index) => (
                 <motion.div
                   key={info.id}
                   className="p-6 hover:bg-gray-50 transition-colors"
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ duration: 0.3, delay: index * 0.05 }}
                 >
                   <div className="flex items-start gap-6">
                     {/* Foto do desaparecido */}
                     <div className="flex-shrink-0">
                       <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-200">
                         <img
                           src={getPersonPhoto(info.personId)}
                           alt={getPersonName(info.personId)}
                           className="w-full h-full object-cover"
                           onError={(e) => {
                             const target = e.target as HTMLImageElement;
                             target.src = '/sem-foto.svg';
                           }}
                         />
                       </div>
                     </div>
                     
                     <div className="flex-1">
                       <div className="flex items-center gap-4 mb-3">
                         <h3 className="text-lg font-medium text-gray-900">
                           {getPersonName(info.personId)}
                         </h3>
                         <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                           {formatDate(info.createdAt)}
                         </span>
                       </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">
                            <User className="w-4 h-4 inline mr-1" />
                            Informante: <span className="font-medium">{info.informantName}</span>
                          </p>
                          {info.informantPhone && (
                            <p className="text-sm text-gray-600 mb-1">
                              <Phone className="w-4 h-4 inline mr-1" />
                              Telefone: {info.informantPhone}
                            </p>
                          )}
                          {info.informantEmail && (
                            <p className="text-sm text-gray-600 mb-1">
                              <Mail className="w-4 h-4 inline mr-1" />
                              Email: {info.informantEmail}
                            </p>
                          )}
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">
                            <MapPin className="w-4 h-4 inline mr-1" />
                            Local: <span className="font-medium">{info.sightingLocation}</span>
                          </p>
                          {info.sightingDate && (
                            <p className="text-sm text-gray-600 mb-1">
                              <Calendar className="w-4 h-4 inline mr-1" />
                              Data: {info.sightingDate}
                            </p>
                          )}
                                                     {info.photos && (
                             <div className="flex items-center gap-2">
                               <p className="text-sm text-gray-600">
                                 <ImageIcon className="w-4 h-4 inline mr-1" />
                                 Fotos: {info.photos.split(',').length} anexo(s)
                               </p>
                               <motion.button
                                 onClick={() => setShowPhotoModal(info.id)}
                                 className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center gap-1"
                                 whileHover={{ scale: 1.05 }}
                                 whileTap={{ scale: 0.95 }}
                               >
                                 <ExternalLink className="w-3 h-3" />
                                 Ver
                               </motion.button>
                             </div>
                           )}
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-1">
                          <FileText className="w-4 h-4 inline mr-1" />
                          Descrição:
                        </p>
                        <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
                          {info.description}
                        </p>
                      </div>

                      {/* Botões de Ação */}
                      <div className="flex gap-2 pt-4 border-t border-gray-100">
                        <motion.button
                          onClick={() => handleArchive(info.id, !info.archived)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                            info.archived
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {info.archived ? (
                            <>
                              <ArchiveX className="w-4 h-4" />
                              Desarquivar
                            </>
                          ) : (
                            <>
                              <Archive className="w-4 h-4" />
                              Arquivar
                            </>
                          )}
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
                 </motion.div>
       </div>

       {/* Modal de Fotos */}
       <AnimatePresence>
         {showPhotoModal && (
           <motion.div
             className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             onClick={() => setShowPhotoModal(null)}
           >
             <motion.div
               className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.9, opacity: 0 }}
               onClick={(e) => e.stopPropagation()}
             >
                               <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Fotos Anexadas
                      </h3>
                      <p className="text-sm text-gray-500">
                        Clique em qualquer foto para visualizar em tamanho completo
                      </p>
                    </div>
                    <motion.button
                      onClick={() => setShowPhotoModal(null)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </motion.button>
                  </div>
                </div>
               
               <div className="p-6">
                 {(() => {
                   const info = informations.find(i => i.id === showPhotoModal);
                   if (!info || !info.photos) {
                     return (
                       <div className="text-center text-gray-500 py-8">
                         <ImageIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                         <p>Nenhuma foto disponível</p>
                       </div>
                     );
                   }
                   
                   const photoUrls = info.photos.split(',').filter(url => url.trim());
                   console.log('Fotos a serem exibidas:', photoUrls);
                   
                                                          if (photoUrls.length === 0) {
                     return (
                       <div className="text-center text-gray-500 py-8">
                         <ImageIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                         <p>Nenhuma foto válida encontrada</p>
                         <p className="text-sm mt-2">URLs originais: {info.photos}</p>
                       </div>
                     );
                   }

                   return (
                     <div className="space-y-4">
                       <div className="text-sm text-gray-600 mb-4">
                         Encontradas {photoUrls.length} foto(s)
                       </div>
                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                         {photoUrls.map((photoUrl, index) => (
                          <motion.div
                            key={index}
                            className="relative cursor-pointer group"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => window.open(photoUrl.trim(), '_blank')}
                          >
                            <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-yellow-400 transition-colors bg-gray-100 shadow-md hover:shadow-lg">
                              <img
                                src={photoUrl.trim()}
                                alt={`Anexo ${index + 1}`}
                                className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  console.error('Erro ao carregar imagem:', photoUrl.trim());
                                  target.src = '/sem-foto.svg';
                                  target.alt = 'Erro ao carregar imagem';
                                }}
                                onLoad={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  console.log('Imagem carregada com sucesso:', photoUrl.trim());
                                }}
                              />
                            </div>
                            {/* Indicador sutil de que é clicável */}
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="bg-black bg-opacity-50 text-white p-1 rounded-full">
                                <ExternalLink className="w-4 h-4" />
                              </div>
                            </div>
                            {/* Label da foto */}
                            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              Foto {index + 1} - Clique para ampliar
                            </div>
                          </motion.div>
                        ))}
                                               </div>
                       </div>
                     );
                   })()}
                 </div>
               </motion.div>
             </motion.div>
           )}
         </AnimatePresence>
       </div>
     );
   }
