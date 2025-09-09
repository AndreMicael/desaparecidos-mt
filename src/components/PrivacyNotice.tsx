"use client";

import { useState } from 'react';
import { Shield, Eye, Lock, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PrivacyNoticeProps {
  className?: string;
  compact?: boolean;
}

export function PrivacyNotice({ className = "", compact = false }: PrivacyNoticeProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (compact) {
    return (
      <div className={`text-xs text-gray-600 ${className}`}>
        <div className="flex items-center gap-1">
          <Shield className="w-3 h-3" />
          <span>
            Seus dados são protegidos e usados apenas para fins de investigação.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-blue-50 border border-blue-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <Shield className="w-5 h-5 text-blue-600" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-blue-900 mb-2">
            Política de Privacidade e Proteção de Dados
          </h4>
          
          <div className="space-y-2 text-sm text-blue-800">
            <div className="flex items-start gap-2">
              <Lock className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p>
                <strong>Confidencialidade:</strong> Todas as informações fornecidas são tratadas com total confidencialidade e segurança.
              </p>
            </div>
            
            <div className="flex items-start gap-2">
              <Eye className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p>
                <strong>Finalidade:</strong> Os dados coletados são utilizados exclusivamente para fins de investigação e localização de pessoas desaparecidas.
              </p>
            </div>
            
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p>
                <strong>Compartilhamento:</strong> As informações podem ser compartilhadas apenas com autoridades competentes e familiares autorizados.
              </p>
            </div>
          </div>

          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-3 text-sm text-blue-700 hover:text-blue-900 underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isExpanded ? 'Ver menos' : 'Ver mais detalhes'}
          </motion.button>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-3 pt-3 border-t border-blue-200"
              >
                <div className="space-y-3 text-sm text-blue-800">
                  <div>
                    <h5 className="font-semibold mb-1">Dados Coletados:</h5>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Nome e contato do informante</li>
                      <li>Data e local do avistamento</li>
                      <li>Descrição da situação</li>
                      <li>Fotos (quando fornecidas)</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className="font-semibold mb-1">Tempo de Retenção:</h5>
                    <p>Os dados são mantidos pelo tempo necessário para a investigação, conforme legislação vigente.</p>
                  </div>
                  
                  <div>
                    <h5 className="font-semibold mb-1">Seus Direitos:</h5>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Acesso aos seus dados pessoais</li>
                      <li>Correção de informações incorretas</li>
                      <li>Solicitação de exclusão (quando aplicável)</li>
                      <li>Portabilidade dos dados</li>
                    </ul>
                  </div>
                  
                  <div className="bg-blue-100 p-3 rounded-md">
                    <p className="text-xs">
                      <strong>Contato:</strong> Para questões sobre privacidade, entre em contato através do 
                      <a href="/contato" className="underline hover:text-blue-900"> formulário de contato</a>.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
