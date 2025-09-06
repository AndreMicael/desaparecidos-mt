"use client";

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Trash2, Calendar, MapPin, User, Phone, Mail, FileText, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

interface InformationFormProps {
  isOpen: boolean;
  onClose: () => void;
  personId: string;
  personName: string;
}

interface FormData {
  informantName: string;
  informantPhone: string;
  informantEmail: string;
  sightingDate: string;
  sightingLocation: string;
  description: string;
  isAnonymous: boolean;
  includePhone: boolean;
  includeEmail: boolean;
}

export function InformationForm({ isOpen, onClose, personId, personName }: InformationFormProps) {
  const [formData, setFormData] = useState<FormData>({
    informantName: '',
    informantPhone: '',
    informantEmail: '',
    sightingDate: '',
    sightingLocation: '',
    description: '',
    isAnonymous: false,
    includePhone: false,
    includeEmail: false
  });
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatPhone = (value: string) => {
    // Remove tudo que não é dígito
    const numbers = value.replace(/\D/g, '');
    
    // Aplica máscara (XX) XXXXX-XXXX
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const formatDate = (value: string) => {
    // Remove tudo que não é dígito
    const numbers = value.replace(/\D/g, '');
    
    // Aplica máscara DD/MM/AAAA
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 4) return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
    return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhone(value);
    handleInputChange('informantPhone', formatted);
  };

  const handleDateChange = (value: string) => {
    const formatted = formatDate(value);
    handleInputChange('sightingDate', formatted);
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    if (photos.length + files.length > 5) {
      toast.error('Máximo de 5 fotos permitido');
      return;
    }

    const newPhotos = [...photos, ...files];
    setPhotos(newPhotos);

    // Criar previews
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreviews(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
    setPhotoPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if ((!formData.informantName.trim() && !formData.isAnonymous) || !formData.sightingLocation.trim() || !formData.description.trim()) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    setIsSubmitting(true);

    try {
      // Enviar dados diretamente para a API externa (apenas o necessário conforme Swagger)
      const response = await fetch('/api/informations/external', {
        method: 'POST',
        body: (() => {
          const requestFormData = new FormData();
          
          // Dados obrigatórios conforme Swagger da API externa
          requestFormData.append('personId', personId); // Para identificar a pessoa
          requestFormData.append('sightingDate', formData.sightingDate); // Data do avistamento
          requestFormData.append('sightingLocation', formData.sightingLocation); // Local do avistamento
          requestFormData.append('description', formData.description); // Descrição detalhada (informacao)
          
          // Informações do informante (para descricao do anexo)
          const informantInfo = formData.isAnonymous ? 'Anônimo' : formData.informantName;
          requestFormData.append('informantName', informantInfo);
          
          // Adicionar arquivos reais (opcional conforme Swagger)
          photos.forEach(photo => {
            requestFormData.append('photos', photo);
          });
          
          return requestFormData;
        })(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Erro desconhecido' }));
        console.error('Erro da API:', errorData);
        throw new Error(errorData.error || `Erro ao enviar informações (${response.status})`);
      }

      const result = await response.json();
      
      // Verificar se há aviso sobre fallback
      if (result.warning) {
        toast.warning(result.warning);
      } else {
        toast.success('Informações registradas com sucesso!');
      }
      onClose();
      
             // Reset form
       setFormData({
         informantName: '',
         informantPhone: '',
         informantEmail: '',
         sightingDate: '',
         sightingLocation: '',
         description: '',
         isAnonymous: false,
         includePhone: false,
         includeEmail: false
       });
      setPhotos([]);
      setPhotoPreviews([]);
    } catch (error) {
      console.error('Erro ao enviar informações:', error);
      toast.error('Erro ao enviar informações. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Registrar Novas Informações
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Sobre: <span className="font-medium">{personName}</span>
                </p>
              </div>
              <motion.button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-6 h-6" />
              </motion.button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                             {/* Informações do Informante */}
               <div className="space-y-4">
                 <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                   <User className="w-5 h-5" />
                   Informações do Informante
                 </h3>
                 
                                   {/* Opção Anônima */}
                  <div className="space-y-3 p-3 bg-gray-50 rounded-md border border-gray-200">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="anonymous"
                        checked={formData.isAnonymous}
                        onChange={(e) => handleInputChange('isAnonymous', e.target.checked)}
                        className="w-4 h-4 text-yellow-400 border-gray-300 rounded focus:ring-yellow-400 focus:ring-2"
                      />
                      <label htmlFor="anonymous" className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                        {formData.isAnonymous ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        Enviar informações anonimamente
                      </label>
                    </div>
                    
                                         {formData.isAnonymous && (
                       <div className="space-y-2 ml-7">
                         <div className="flex items-center gap-3">
                           <input
                             type="checkbox"
                             id="includePhone"
                             checked={formData.includePhone}
                             onChange={(e) => handleInputChange('includePhone', e.target.checked)}
                             className="w-4 h-4 text-yellow-400 border-gray-300 rounded focus:ring-yellow-400 focus:ring-2"
                           />
                           <label htmlFor="includePhone" className="text-sm text-gray-600 cursor-pointer">
                             Incluir telefone para contato (opcional)
                           </label>
                         </div>
                         <div className="flex items-center gap-3">
                           <input
                             type="checkbox"
                             id="includeEmail"
                             checked={formData.includeEmail}
                             onChange={(e) => handleInputChange('includeEmail', e.target.checked)}
                             className="w-4 h-4 text-yellow-400 border-gray-300 rounded focus:ring-yellow-400 focus:ring-2"
                           />
                           <label htmlFor="includeEmail" className="text-sm text-gray-600 cursor-pointer">
                             Incluir email para contato (opcional)
                           </label>
                         </div>
                       </div>
                     )}
                  </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">
                       Nome Completo {!formData.isAnonymous && '*'}
                     </label>
                     <input
                       type="text"
                       value={formData.informantName}
                       onChange={(e) => handleInputChange('informantName', e.target.value)}
                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-black"
                       placeholder={formData.isAnonymous ? "Não será exibido" : "Seu nome completo"}
                       required={!formData.isAnonymous}
                       disabled={formData.isAnonymous}
                     />
                   </div>

                                     <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">
                       Telefone {formData.isAnonymous && !formData.includePhone && '(não será exibido)'}
                     </label>
                     <div className="relative">
                       <Phone className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                       <input
                         type="text"
                         value={formData.informantPhone}
                         onChange={(e) => handlePhoneChange(e.target.value)}
                         className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-black"
                         placeholder={formData.isAnonymous && !formData.includePhone ? "Não será exibido" : "(11) 99999-9999"}
                         maxLength={15}
                         disabled={formData.isAnonymous && !formData.includePhone}
                       />
                     </div>
                   </div>
                </div>

                                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">
                     E-mail {formData.isAnonymous && !formData.includeEmail && '(não será exibido)'}
                   </label>
                   <div className="relative">
                     <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                     <input
                       type="email"
                       value={formData.informantEmail}
                       onChange={(e) => handleInputChange('informantEmail', e.target.value)}
                       className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-black"
                       placeholder={formData.isAnonymous && !formData.includeEmail ? "Não será exibido" : "seu@email.com"}
                       disabled={formData.isAnonymous && !formData.includeEmail}
                     />
                   </div>
                 </div>
              </div>

              {/* Informações do Avistamento */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Informações do Avistamento
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Data do Avistamento
                    </label>
                                         <div className="relative">
                       <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                       <input
                         type="text"
                         value={formData.sightingDate}
                         onChange={(e) => handleDateChange(e.target.value)}
                         className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-black"
                         placeholder="DD/MM/AAAA"
                         maxLength={10}
                       />
                     </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Local do Avistamento *
                    </label>
                                       <div className="relative">
                     <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                     <input
                       type="text"
                       value={formData.sightingLocation}
                       onChange={(e) => handleInputChange('sightingLocation', e.target.value)}
                       className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-black"
                       placeholder="Endereço, bairro, cidade..."
                       required
                     />
                   </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição Detalhada *
                  </label>
                                     <div className="relative">
                     <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                     <textarea
                       value={formData.description}
                       onChange={(e) => handleInputChange('description', e.target.value)}
                       className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-black"
                       rows={4}
                       placeholder="Descreva detalhadamente o que você viu, como a pessoa estava vestida, comportamento, etc."
                       required
                     />
                   </div>
                </div>
              </div>

              {/* Upload de Fotos */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Fotos (opcional)
                </h3>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  
                  {photoPreviews.length === 0 ? (
                    <div>
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">
                        Clique para selecionar fotos ou arraste aqui
                      </p>
                      <p className="text-sm text-gray-500">
                        Máximo 5 fotos • JPG, PNG, GIF
                      </p>
                      <motion.button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="mt-4 bg-yellow-400 text-white px-4 py-2 rounded-md hover:bg-yellow-500 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Selecionar Fotos
                      </motion.button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {photoPreviews.map((preview, index) => (
                          <motion.div
                            key={index}
                            className="relative group"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <img
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-24 object-cover rounded-md"
                            />
                            <motion.button
                              type="button"
                              onClick={() => removePhoto(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                          </motion.div>
                        ))}
                      </div>
                      
                      {photoPreviews.length < 5 && (
                        <motion.button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Adicionar Mais Fotos
                        </motion.button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Botões */}
              <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                <motion.button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancelar
                </motion.button>
                
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-black text-white rounded-md hover:bg-transparent hover:outline-2 hover:outline-black hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar Informações'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
