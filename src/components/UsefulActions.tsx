"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, Copy, Printer, Check } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface UsefulActionsProps {
  person: {
    id: number;
    nome: string;
    dtDesaparecimento?: string;
    localDesaparecimentoConcat?: string;
    localizado: boolean;
    foto?: string;
  };
  className?: string;
}

export function UsefulActions({ person, className = "" }: UsefulActionsProps) {
  const [copied, setCopied] = useState(false);

  // Função para compartilhamento nativo
  const handleNativeShare = async () => {
    if (!navigator.share) {
      // Fallback para navegadores que não suportam Web Share API
      handleCopyLink();
      return;
    }

    try {
      const shareData = {
        title: `${person.localizado ? 'Pessoa Localizada' : 'Pessoa Desaparecida'}: ${person.nome}`,
        text: `${person.localizado ? '✅ PESSOA LOCALIZADA' : '🔍 PESSOA DESAPARECIDA'}: ${person.nome}\n📅 Desde: ${person.dtDesaparecimento ? new Date(person.dtDesaparecimento).toLocaleDateString('pt-BR') : 'Data não informada'}\n📍 Local: ${person.localDesaparecimentoConcat || 'Não informado'}\n\n${person.localizado ? 'Esta pessoa foi localizada com sucesso pela Polícia Civil de Mato Grosso!' : 'Se você tem informações, entre em contato: 197'}`,
        url: window.location.href
      };

      await navigator.share(shareData);
      toast.success('Compartilhado com sucesso!');
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Erro ao compartilhar:', error);
        toast.error('Erro ao compartilhar. Tente novamente.');
      }
    }
  };

  // Função para copiar link
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success('Link copiado para a área de transferência!');
      
      // Reset do estado após 2 segundos
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Erro ao copiar link:', error);
      toast.error('Erro ao copiar link. Tente novamente.');
    }
  };

  // Função para imprimir
  const handlePrint = () => {
    try {
      // Criar uma nova janela para impressão
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        toast.error('Não foi possível abrir a janela de impressão. Verifique se o popup está bloqueado.');
        return;
      }

      const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${person.localizado ? 'Pessoa Localizada' : 'Pessoa Desaparecida'} - ${person.nome}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
              line-height: 1.6;
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #333;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .status {
              display: inline-block;
              padding: 8px 16px;
              border-radius: 4px;
              font-weight: bold;
              color: white;
              margin-bottom: 20px;
            }
            .desaparecido { background-color: #dc2626; }
            .localizado { background-color: #059669; }
            .info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
              margin: 20px 0;
            }
            .info-item {
              padding: 10px;
              border: 1px solid #ddd;
              border-radius: 4px;
            }
            .info-label {
              font-weight: bold;
              color: #666;
              font-size: 0.9em;
            }
            .info-value {
              margin-top: 5px;
              font-size: 1.1em;
            }
            .contact {
              background-color: #f5f5f5;
              padding: 20px;
              border-radius: 8px;
              margin-top: 30px;
              text-align: center;
            }
            .logo {
              text-align: center;
              margin-bottom: 20px;
            }
            @media print {
              body { margin: 0; padding: 15px; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="logo">
            <h1>Polícia Civil de Mato Grosso</h1>
            <h2>Sistema de Pessoas Desaparecidas</h2>
          </div>
          
          <div class="header">
            ${person.foto ? `
              <div style="text-align: center; margin-bottom: 20px;">
                <img src="${person.foto}" alt="${person.nome}" style="max-width: 200px; max-height: 250px; border-radius: 8px; border: 2px solid #ddd;" />
              </div>
            ` : ''}
            <h1>${person.nome}</h1>
            <div class="status ${person.localizado ? 'localizado' : 'desaparecido'}">
              ${person.localizado ? 'PESSOA LOCALIZADA' : 'PESSOA DESAPARECIDA'}
            </div>
          </div>

          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">Nome Completo</div>
              <div class="info-value">${person.nome}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Data do Desaparecimento</div>
              <div class="info-value">${person.dtDesaparecimento ? new Date(person.dtDesaparecimento).toLocaleDateString('pt-BR') : 'Não informada'}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Local do Desaparecimento</div>
              <div class="info-value">${person.localDesaparecimentoConcat || 'Não informado'}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Status</div>
              <div class="info-value">${person.localizado ? 'Localizada' : 'Desaparecida'}</div>
            </div>
          </div>

          <div class="contact">
            <h3>${person.localizado ? 'Esta pessoa foi localizada com sucesso!' : 'Se você tem informações sobre esta pessoa:'}</h3>
            <p><strong>Telefone:</strong> 197 (Disque Denúncia)</p>
            <p><strong>E-mail:</strong> desaparecidos@policiacivil.mt.gov.br</p>
            <p><strong>Site:</strong> ${window.location.origin}</p>
          </div>

          <div style="margin-top: 30px; text-align: center; font-size: 0.9em; color: #666;">
            <p>Documento gerado em: ${new Date().toLocaleString('pt-BR')}</p>
            <p>URL: ${window.location.href}</p>
          </div>
        </body>
        </html>
      `;

      printWindow.document.write(printContent);
      printWindow.document.close();
      
      // Aguardar o conteúdo carregar e então imprimir
      printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      };

      toast.success('Abrindo janela de impressão...');
    } catch (error) {
      console.error('Erro ao imprimir:', error);
      toast.error('Erro ao imprimir. Tente novamente.');
    }
  };

  return (
    <motion.div 
      className={`space-y-3 ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-3">
        Ações Úteis
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Compartilhar */}
        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
          <Button
            onClick={handleNativeShare}
            variant="outline"
            className="w-full cursor-pointer border-gray-300 text-white hover:outline-2 hover:outline-black hover:text-black hover:bg-gray-50 hover:border-gray-400 font-normal py-2.5 px-4 rounded-sm text-sm transition-colors duration-200"
          >
            <div className="flex items-center justify-center gap-2">
              <Share2 className="w-4 h-4" />
              Compartilhar
            </div>
          </Button>
        </motion.div>

        {/* Copiar Link */}
        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
          <Button
            onClick={handleCopyLink}
            variant="outline"
            className={`w-full cursor-pointer border-gray-300 font-normal py-2.5 px-4 rounded-sm text-sm transition-colors duration-200 ${
              copied 
                ? 'bg-green-50 border-green-300 text-green-700 hover:outline-2 hover:outline-green-500' 
                : 'text-white hover:outline-2 hover:outline-black hover:text-black hover:bg-gray-50 hover:border-gray-400'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copiado!' : 'Copiar Link'}
            </div>
          </Button>
        </motion.div>

        {/* Imprimir */}
        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
          <Button
            onClick={handlePrint}
            variant="outline"
            className="w-full cursor-pointer border-gray-300 text-white hover:outline-2 hover:outline-black hover:text-black hover:bg-gray-50 hover:border-gray-400 font-normal py-2.5 px-4 rounded-sm text-sm transition-colors duration-200"
          >
            <div className="flex items-center justify-center gap-2">
              <Printer className="w-4 h-4" />
              Imprimir
            </div>
          </Button>
        </motion.div>
      </div>

      {/* Informação sobre compartilhamento nativo */}
      <motion.div 
        className="text-xs text-gray-500 text-center mt-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {typeof navigator !== 'undefined' && 'share' in navigator
          ? 'Compartilhamento nativo disponível no seu dispositivo' 
          : 'Compartilhamento via cópia de link'
        }
      </motion.div>
    </motion.div>
  );
}
