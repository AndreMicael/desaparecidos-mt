"use client";

import { useState, useRef, useEffect } from 'react';
import { Person } from '@/types/person';
import { X, Download, Eye, Phone } from 'lucide-react';
import domtoimage from 'dom-to-image';
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
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && isOpen && person.id) {
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
  }, [isClient, isOpen, person.id]);

  const downloadPoster = async () => {
    if (!posterRef.current) return;
    
    setIsGenerating(true);
    try {
      console.log('Iniciando geração do poster...');
      
      // Aguarda imagens carregarem e converte todas para dataURL (evita CORS)
      const waitForImagesLoaded = async (root: HTMLElement) => {
        const images = Array.from(root.querySelectorAll('img')) as HTMLImageElement[];
        await Promise.all(images.map(img => (
          img.complete && img.naturalWidth > 0
            ? Promise.resolve(true)
            : new Promise(resolve => {
                img.addEventListener('load', () => resolve(true), { once: true });
                img.addEventListener('error', () => resolve(true), { once: true });
              })
        )));
      };

      const convertImageSrcToDataUrl = async (img: HTMLImageElement) => {
        if (!img || !img.src || img.src.startsWith('data:')) return;
        try {
          const response = await fetch(img.src, { mode: 'cors' });
          const blob = await response.blob();
          const reader = new FileReader();
          await new Promise((resolve, reject) => {
            reader.onload = () => {
              img.src = reader.result as string;
              resolve(true);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
        } catch (error) {
          console.log('Falha ao converter imagem para base64:', error);
        }
      };

      const inlineAllImages = async (root: HTMLElement) => {
        const images = Array.from(root.querySelectorAll('img')) as HTMLImageElement[];
        for (const img of images) {
          // Tenta converter cada imagem; falhas não interrompem o fluxo
          await convertImageSrcToDataUrl(img);
        }
      };

      await waitForImagesLoaded(posterRef.current);
      await inlineAllImages(posterRef.current);
      
      // Pequeno atraso para garantir que o DOM reflita as trocas de src
      await new Promise(resolve => setTimeout(resolve, 200));
      
      let dataUrl: string;
      
      try {
        // Tenta primeiro com dom-to-image, com timeout para evitar travas
        console.log('Tentando com dom-to-image...');
        const domToImageWithTimeout = async (node: HTMLElement, timeoutMs = 3000): Promise<string> => {
          return await Promise.race([
            domtoimage.toPng(node, {
              quality: 1.0,
              bgcolor: '#1f2937',
              width: 960,
              height: 800,
              cacheBust: true,
              imagePlaceholder: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
            }) as unknown as Promise<string>,
            new Promise<string>((_, reject) => setTimeout(() => reject(new Error('dom-to-image timeout')), timeoutMs))
          ]);
        };
        dataUrl = await domToImageWithTimeout(posterRef.current);
        console.log('dom-to-image funcionou!');
      } catch (domError) {
        console.log('dom-to-image falhou devido a CORS, tentando html2canvas...');
        // Se falhar por CORS, tenta com html2canvas que lida melhor
        const canvas = await html2canvas(posterRef.current, {
          scale: 2,
          backgroundColor: '#1f2937',
          useCORS: true,
          allowTaint: true,
          logging: false,
          width: 960,
          height: 800,
          imageTimeout: 15000 // Timeout maior para imagens
        });
        dataUrl = canvas.toDataURL();
        console.log('html2canvas funcionou!');
      }
      
      console.log('Poster gerado com sucesso');
      
      const link = document.createElement('a');
      link.download = `cartaz-${person.nome.replace(/\s+/g, '-').toLowerCase()}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error('Erro ao gerar cartaz:', error);
      alert('Erro ao gerar o cartaz. Tente novamente.');
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
             style={{ 
               width: '1000px', 
               height: '800px', 
               position: 'relative', 
               overflow: 'hidden',
               backgroundColor: '#1f2937', 
               fontFamily: 'Inter, sans-serif' 
             }}
           >
          

                         {/* Header */}
             <div style={{ position: 'relative', zIndex: 10, padding: '16px' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                                 {/* Logo Polícia Civil */}
                 <div style={{ width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Image 
                    src={LogoPJC} 
                    alt="Logo Polícia Civil" 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'contain',
                      minWidth: '64px',
                      minHeight: '64px',
                      maxWidth: '64px',
                      maxHeight: '64px'
                    }} 
                  />
                 </div>
                 <div style={{ flex: 1 }}>
                   <h1 style={{ color: '#ffffff', fontSize: '24px', fontWeight: 'bold' }}>DESAPARECIDO(A)</h1>
                 </div>
                                 <div style={{ color: '#ffffff', padding: '8px 12px', textAlign: 'right', borderRadius: '6px', fontWeight: 'bold', fontSize: '14px' }}>
                   DESDE<br />
                   {person.dtDesaparecimento ? formatDate(person.dtDesaparecimento) : 'DATA NÃO INFORMADA'}
                 </div>
              </div>

                             {/* Main Content */}
               <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', padding: '16px', marginBottom: '12px' }}>
                                 {/* Layout em Grid 2x2 para aproveitar espaço quadrado */}
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', height: '500px' }}>
                  {/* Coluna Esquerda - Foto e Nome */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {/* Foto com proporção 3x4 (retrato) */}
                    <div style={{ width: '75%', aspectRatio: '3/4', border: '2px solid #d1d5db', overflow: 'hidden', marginBottom: '12px', backgroundColor: '#e5e7eb' }}>
                     {person.foto ? (
                                               <img
                          src={person.foto}
                          alt={person.nome}
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover',
                            minWidth: '100%',
                            minHeight: '100%',
                            maxWidth: '100%',
                            maxHeight: '100%'
                          }}
                          crossOrigin="anonymous"
                         onError={(e) => {
                           const target = e.target as HTMLImageElement;
                           target.style.display = 'none';
                           const sibling = target.nextElementSibling as HTMLElement;
                           if (sibling) {
                             sibling.style.display = 'flex';
                           }
                         }}
                       />
                     ) : null}
                     <div style={{ 
                       width: '100%', 
                       height: '100%', 
                       display: person.foto ? 'none' : 'flex', 
                       alignItems: 'center', 
                       justifyContent: 'center',
                       backgroundColor: '#f3f4f6' 
                     }}>
                       <span style={{ fontSize: '18px', color: '#6b7280' }}>SEM FOTO</span>
                     </div>
                   </div>
                   
                                       {/* Nome e idade - próximo da foto */}
                    <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                      <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '4px', color: '#111827' }}>
                        {person.nome.toUpperCase()}
                      </h2>
                      <div style={{ fontSize: '18px', color: '#374151' }}>
                        {person.idade && `${person.idade} ANOS`}
                      </div>
                    </div>
                 </div>

                 {/* Coluna Direita - Informações e QR Code */}
                 <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                       {/* Informações - alinhadas ao topo da foto */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: 0 }}>
                                            <div>
                         <span style={{ fontWeight: 'bold', fontSize: '18px', color: '#1f2937' }}>Bairro/Cidade:</span>
                         <div style={{ fontSize: '16px', marginTop: '4px', color: '#374151' }}>
                           {person.localDesaparecimentoConcat || 'NÃO INFORMADO'}
                         </div>
                       </div>

                       <div>
                         <span style={{ fontWeight: 'bold', fontSize: '18px', color: '#1f2937' }}>Informações:</span>
                         <div style={{ fontSize: '16px', marginTop: '4px', color: '#374151' }}>
                           {person.ultimaOcorrencia || 'INFORMAÇÕES NÃO DISPONÍVEIS'}
                         </div>
                       </div>

                       <div>
                         <span style={{ fontWeight: 'bold', fontSize: '18px', color: '#1f2937' }}>Vestimentas:</span>
                         <div style={{ fontSize: '16px', marginTop: '4px', color: '#374151' }}>
                           INFORMAÇÕES NÃO DISPONÍVEIS
                         </div>
                       </div>

                                           <div style={{ textAlign: 'center', marginTop: '80px' }}>
                        {isClient && qrCodeUrl ? (
                          <>
                            <img
                              src={qrCodeUrl}
                              alt="QR Code"
                              style={{ 
                                width: '120px', 
                                height: '120px', 
                                marginBottom: '4px', 
                                margin: '0 auto',
                                minWidth: '120px',
                                minHeight: '120px',
                                maxWidth: '120px',
                                maxHeight: '120px'
                              }}
                            />
                            <div style={{ fontSize: '12px', fontWeight: '500', color: '#4b5563' }}>
                              Escaneie para mais informações
                            </div>
                          </>
                        ) : (
                          <div style={{ width: '120px', height: '120px', marginBottom: '4px', margin: '0 auto', backgroundColor: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px' }}>
                            <span style={{ fontSize: '12px', color: '#6b7280' }}>Carregando QR...</span>
                          </div>
                        )}
                      </div>
                   </div>

                   {/* QR Code abaixo das vestimentas */}
                 
                 </div>
               </div>



                <div style={{ textAlign: 'center', fontSize: '14px', borderTop: '1px solid #d1d5db', marginTop: '32px', paddingTop: '8px', color: '#4b5563' }}>
                  Denúncias / Contato: Núcleo de Pessoas Desaparecidas DHPP / PJC
                </div>
              </div>

              {/* Footer */}
                                                  <div style={{ backgroundColor: '#059669', padding: '12px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <div style={{ color: '#ffffff', fontSize: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', margin: 0, lineHeight: '1' }}>      
               <Phone size={24} style={{ color: '#ffffff', display: 'inline-block', verticalAlign: 'middle' }} />           
                 <span style={{ color: '#ffffff', display: 'inline-block', verticalAlign: 'middle' }}>65 9999-9999</span></div>
             </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}