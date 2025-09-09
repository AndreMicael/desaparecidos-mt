"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Search, Filter, Eye, Calendar, MapPin, User, Phone, Mail, FileText, Image as ImageIcon, ExternalLink, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { Modal } from '@/components/ui/modal';
import { PersonPhoto, GridImage } from '@/components/ui/optimized-image';

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
  // Campos da API externa
  ocoId?: number;
  informacao?: string;
  descricao?: string;
  data?: string;
  files?: string[];
}

interface Person {
  id: number;
  nome: string;
  foto?: string;
  ocoId?: number;
}

export default function AdminDashboard() {
  const [informations, setInformations] = useState<Information[]>([]);
  const [persons, setPersons] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPerson, setSelectedPerson] = useState<string>('all');
  const [showDetails, setShowDetails] = useState<string | null>(null);
  const [showPhotoModal, setShowPhotoModal] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<{ url: string; index: number; total: number } | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Verificar se está logado
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    loadPersons();
  }, [router]);

  useEffect(() => {
    // Carregar informações quando uma pessoa for selecionada
    if (selectedPerson && selectedPerson !== 'all') {
      loadInformationsForPerson(selectedPerson);
    } else {
      setInformations([]);
    }
  }, [selectedPerson]);

  const loadPersons = async () => {
    try {
      setLoading(true);
      
      // Carregar pessoas
      const personsResponse = await fetch('/api/pessoas?pageSize=1000');
      const personsData = await personsResponse.json();
      setPersons(personsData.data || []);
      
    } catch (error) {
      console.error('Erro ao carregar pessoas:', error);
      toast.error('Erro ao carregar pessoas');
      setPersons([]);
    } finally {
      setLoading(false);
    }
  };

  const loadInformationsForPerson = async (personId: string) => {
    if (!personId || personId === 'all') {
      setInformations([]);
      return;
    }

    try {
      setLoading(true);
      
      // Buscar informações específicas desta pessoa
      const infoResponse = await fetch(`/api/admin/informations/pessoa/${personId}`);
      const infoData = await infoResponse.json();
      
      if (infoData.success && infoData.data && Array.isArray(infoData.data)) {
        // Mapear dados da API externa para o formato esperado pelo dashboard
        const mappedInformations = infoData.data.map((info: any, index: number) => ({
          id: info.id || `ext_${info.ocoId}_${personId}_${index}`,
          personId: personId,
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
        console.log(`Informações encontradas para pessoa ${personId}:`, mappedInformations.length);
      } else {
        setInformations([]);
        console.log('Nenhuma informação encontrada para pessoa:', personId);
      }
      
    } catch (error) {
      console.error('Erro ao carregar informações:', error);
      toast.error('Erro ao carregar informações');
      setInformations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };


  const filteredInformations = informations;

  const getPersonName = (personId: string) => {
    const person = persons.find(p => p.id.toString() === personId);
    return person ? person.nome : `Pessoa ${personId}`;
  };

  const getPersonPhoto = (personId: string) => {
    const person = persons.find(p => p.id.toString() === personId);
    return person?.foto && person.foto.trim() !== '' ? person.foto : '/sem-foto.svg';
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
        {/* Seletor de Pessoa */}
        <motion.div 
          className="bg-white rounded-lg shadow-sm p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="max-w-md">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selecione uma pessoa desaparecida:
            </label>
            <select
              className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              value={selectedPerson}
              onChange={(e) => setSelectedPerson(e.target.value)}
            >
              <option value="all">Selecione uma pessoa...</option>
              {persons.map(person => (
                <option key={person.id} value={person.id.toString()}>
                  {person.nome}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Estatísticas */}
        {selectedPerson !== 'all' && (
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
                  <p className="text-sm font-medium text-gray-600">Pessoa Selecionada</p>
                  <p className="text-lg font-bold text-gray-900">
                    {getPersonName(selectedPerson)}
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
                  <p className="text-sm font-medium text-gray-600">Com Fotos</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {informations.filter(info => info.photos && info.photos.trim()).length}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Lista de Informações */}
        {selectedPerson !== 'all' && (
          <motion.div 
            className="bg-white rounded-lg shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Informações de {getPersonName(selectedPerson)}
                </h2>
                
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
                       <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-100">
                         <PersonPhoto
                           src={getPersonPhoto(info.personId)}
                           alt={getPersonName(info.personId)}
                           size="sm"
                           className="w-full h-full object-cover"
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

                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
          </motion.div>
        )}
      </div>

       {/* Modal de Fotos */}
       <Modal
         isOpen={!!showPhotoModal}
         onClose={() => setShowPhotoModal(null)}
         title="Fotos Anexadas"
         size="xl"
       >
         <div className="space-y-4">
           <p className="text-sm text-gray-600 mb-4">
             Clique em qualquer foto para visualizar em tamanho completo
           </p>
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
                       onClick={() => setSelectedImage({ url: photoUrl.trim(), index, total: photoUrls.length })}
                          >
                            <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-yellow-400 transition-colors bg-gray-100 shadow-md hover:shadow-lg">
                              <GridImage
                                src={photoUrl.trim()}
                                alt={`Anexo ${index + 1}`}
                                className="w-full h-full transition-transform duration-200 hover:scale-105"
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
       </Modal>

        {/* Modal de Imagem Ampliada */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[60] p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
            >
              <motion.div
                className="relative max-w-[90vw] max-h-[90vh] w-full h-full flex items-center justify-center"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Botão de Fechar */}
                <motion.button
                  className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedImage(null)}
                >
                  <X className="w-6 h-6" />
                </motion.button>

                {/* Navegação (se houver múltiplas imagens) */}
                {selectedImage.total > 1 && (
                  <>
                    {/* Botão Anterior */}
                    {selectedImage.index > 0 && (
                      <motion.button
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          const info = informations.find(i => i.id === showPhotoModal);
                          if (info && info.photos) {
                            const photoUrls = info.photos.split(',').filter(url => url.trim());
                            const newIndex = selectedImage.index - 1;
                            setSelectedImage({
                              url: photoUrls[newIndex].trim(),
                              index: newIndex,
                              total: photoUrls.length
                            });
                          }
                        }}
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </motion.button>
                    )}

                    {/* Botão Próximo */}
                    {selectedImage.index < selectedImage.total - 1 && (
                      <motion.button
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          const info = informations.find(i => i.id === showPhotoModal);
                          if (info && info.photos) {
                            const photoUrls = info.photos.split(',').filter(url => url.trim());
                            const newIndex = selectedImage.index + 1;
                            setSelectedImage({
                              url: photoUrls[newIndex].trim(),
                              index: newIndex,
                              total: photoUrls.length
                            });
                          }
                        }}
                      >
                        <ChevronRight className="w-6 h-6" />
                      </motion.button>
                    )}
                  </>
                )}

                {/* Imagem Ampliada */}
                <motion.img
                  src={selectedImage.url}
                  alt={`Foto ${selectedImage.index + 1} de ${selectedImage.total}`}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/sem-foto.svg';
                  }}
                />

                {/* Contador de Fotos */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                  {selectedImage.index + 1} de {selectedImage.total}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
