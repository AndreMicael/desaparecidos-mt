"use client";

import { useState, useRef, useEffect } from 'react';
import { Person } from '@/types/person';
import { X, Download, Eye } from 'lucide-react';
import html2canvas from 'html2canvas';
import QRCode from 'qrcode';
import { WhatsappLogoIcon } from '@phosphor-icons/react';
import LogoPJC from '../../public/logo_pjc.svg';
import Image from 'next/image';

interface PosterGeneratorProps {
  person: Person;
  isOpen: boolean;
  onClose: () => void;
}

export function PosterGenerator({ person, isOpen, onClose }: PosterGeneratorProps) {
  const posterRef = useRef<HTMLDivElement>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (isOpen && person.id) {
      const currentUrl = `${window.location.origin}/desaparecidos/pessoa/${person.id}`;
      QRCode.toDataURL(currentUrl, {
        width: 120,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      }).then(setQrCodeUrl);
    }
  }, [isOpen, person.id]);

  const downloadPoster = async () => {
    if (!posterRef.current) return;
    
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(posterRef.current, {
        scale: 2,
        backgroundColor: '#1f2937',
        useCORS: true,
        allowTaint: true,
        logging: false,
        width: 960,
        height: 800
      });
      
      const link = document.createElement('a');
      link.download = `cartaz-${person.nome.replace(/\s+/g, '-').toLowerCase()}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error('Erro ao gerar cartaz:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR');
    } catch {
      return '';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Cartaz de Pessoa Desaparecida</h2>
          <div className="flex gap-2">
            <button
              onClick={downloadPoster}
              disabled={isGenerating}
              className="flex items-center gap-2 cursor-pointer c bg-gray-900 text-white px-4 py-2 rounded-sm hover:bg-gray-700 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {isGenerating ? 'Gerando...' : 'Baixar Cartaz'}
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Poster Content */}
        <div className="p-6 flex justify-center">
          <div
            ref={posterRef}
            className="w-[1000px] h-[800px] relative overflow-hidden"
            style={{ backgroundColor: '#1f2937', fontFamily: 'Ubuntu, sans-serif' }}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="text-white text-[180px] font-bold transform rotate-90 absolute -left-16 top-1/2 -translate-y-1/2">
                DESAPARECIDO(A)
              </div>
              <div className="text-white text-[180px] font-bold transform -rotate-90 absolute -right-16 top-1/2 -translate-y-1/2">
                DESAPARECIDO(A)
              </div>
            </div>

            {/* Header */}
            <div className="relative z-10 p-4">
              <div className="flex items-center gap-4 mb-3">
                {/* Logo Polícia Civil */}
                <div className="w-16 h-16 rounded-full flex items-center justify-center">
                 <Image src={LogoPJC} alt="Logo Polícia Civil" className="w-full h-full object-contain" />
                </div>
                <div className="flex-1">
                  <h1 className="text-white text-2xl font-bold">DESAPARECIDO(A)</h1>
                </div>
                <div className=" text-white px-3 py-2 justify-end text-right rounded-md font-bold text-sm">
                  DESDE<br />
                  {person.dtDesaparecimento ? formatDate(person.dtDesaparecimento) : 'DATA NÃO INFORMADA'}
                </div>
              </div>

              {/* Main Content */}
              <div className="bg-white rounded-lg p-4 mb-3">
                                 {/* Layout em Grid 2x2 para aproveitar espaço quadrado */}
                 <div className="grid grid-cols-2 gap-6 h-[500px]">
                  {/* Coluna Esquerda - Foto e Nome */}
                  <div className="flex flex-col items-center">
                    {/* Foto com proporção 3x4 (retrato) */}
                    <div className="w-3/4 aspect-[3/4] border-2 overflow-hidden mb-3" style={{ backgroundColor: '#e5e7eb', borderColor: '#d1d5db' }}>
                     {person.foto ? (
                       <img
                         src={person.foto}
                         alt={person.nome}
                         className="w-full h-full object-cover"
                         crossOrigin="anonymous"
                         onError={(e) => {
                           const target = e.target as HTMLImageElement;
                           target.style.display = 'none';
                           target.nextElementSibling?.classList.remove('hidden');
                         }}
                       />
                     ) : null}
                     <div className={`w-full h-full flex items-center justify-center ${person.foto ? 'hidden' : ''}`} style={{ backgroundColor: '#f3f4f6' }}>
                       <span className="text-lg" style={{ color: '#6b7280' }}>SEM FOTO</span>
                     </div>
                   </div>
                   
                                       {/* Nome e idade - próximo da foto */}
                    <div className="text-center mb-4">
                      <h2 className="text-xl font-bold mb-1" style={{ color: '#111827' }}>
                        {person.nome.toUpperCase()}
                      </h2>
                      <div className="text-lg" style={{ color: '#374151' }}>
                        {person.idade && `${person.idade} ANOS`}
                      </div>
                    </div>
                 </div>

                 {/* Coluna Direita - Informações e QR Code */}
                 <div className="flex flex-col justify-between">
                                       {/* Informações - alinhadas ao topo da foto */}
                    <div className="space-y-4 mt-0">
                                            <div>
                         <span className="font-bold text-lg" style={{ color: '#1f2937' }}>Bairro/Cidade:</span>
                         <div className="text-base mt-1" style={{ color: '#374151' }}>
                           {person.localDesaparecimentoConcat || 'NÃO INFORMADO'}
                         </div>
                       </div>

                       <div>
                         <span className="font-bold text-lg" style={{ color: '#1f2937' }}>Informações:</span>
                         <div className="text-base mt-1" style={{ color: '#374151' }}>
                           {person.ultimaOcorrencia || 'INFORMAÇÕES NÃO DISPONÍVEIS'}
                         </div>
                       </div>

                       <div>
                         <span className="font-bold text-lg" style={{ color: '#1f2937' }}>Vestimentas:</span>
                         <div className="text-base mt-1" style={{ color: '#374151' }}>
                           INFORMAÇÕES NÃO DISPONÍVEIS
                         </div>
                       </div>

                     {qrCodeUrl && (
                       <div className="text-center mt-20">
                         <img
                           src={qrCodeUrl}
                           alt="QR Code"
                           className="w-30 h-30 mb-1 mx-auto"
                         />
                         <div className="text-xs font-medium" style={{ color: '#4b5563' }}>
                           Escaneie para mais informações
                         </div>
                       </div>
                     )}
                   </div>

                   {/* QR Code abaixo das vestimentas */}
                 
                 </div>
               </div>



                <div className="text-center mt-2 text-sm border-t  mt-8 pt-2" style={{ color: '#4b5563', borderColor: '#d1d5db' }}>
                  Denúncias / Contato: Núcleo de Pessoas Desaparecidas DHPP / PJC
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-center gap-4 p-3 rounded-lg" style={{ backgroundColor: '#059669', color: '#ffffff' }}>
                <WhatsappLogoIcon weight="fill" size={22} className="text-white" />
                <span className="text-xl font-bold">65 99999-8888</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}