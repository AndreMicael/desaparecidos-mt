"use client";

import { Phone, Mail, MapPin, AlertTriangle, Heart, Share2, Eye } from 'lucide-react';

export default function ComoAjudarPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
            COMO AJUDAR
          </h1>
          <p className="text-xl text-black/80 max-w-2xl mx-auto">
            Sua ajuda pode fazer a diferença na localização de pessoas desaparecidas
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="py-12 font-encode-sans">
        <div className="max-w-4xl mx-auto px-4">
          
          {/* O que fazer se alguém desapareceu */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-black mb-6 flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-red-600" />
              O que fazer se alguém desapareceu?
            </h2>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-semibold text-black mb-4">Passos imediatos:</h3>
              <ol className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="bg-yellow-400 text-black font-bold rounded-full w-6 h-6 flex items-center justify-center text-sm flex-shrink-0 mt-0.5">1</span>
                  <span>Procure em locais onde a pessoa costuma frequentar (casa de amigos, trabalho, escola)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-yellow-400 text-black font-bold rounded-full w-6 h-6 flex items-center justify-center text-sm flex-shrink-0 mt-0.5">2</span>
                  <span>Entre em contato com familiares, amigos e conhecidos</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-yellow-400 text-black font-bold rounded-full w-6 h-6 flex items-center justify-center text-sm flex-shrink-0 mt-0.5">3</span>
                  <span>Dirija-se imediatamente à Delegacia mais próxima para registrar o Boletim de Ocorrência</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-yellow-400 text-black font-bold rounded-full w-6 h-6 flex items-center justify-center text-sm flex-shrink-0 mt-0.5">4</span>
                  <span>Forneça fotos recentes e informações detalhadas sobre a pessoa</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-yellow-400 text-black font-bold rounded-full w-6 h-6 flex items-center justify-center text-sm flex-shrink-0 mt-0.5">5</span>
                  <span>Mantenha contato com a Delegacia para acompanhar as investigações</span>
                </li>
              </ol>
            </div>
          </div>

          {/* Como você pode ajudar */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-black mb-6 flex items-center gap-3">
              <Heart className="w-8 h-8 text-red-600" />
              Como você pode ajudar?
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white border-2 border-yellow-400 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Eye className="w-6 h-6 text-yellow-400" />
                  <h3 className="text-xl font-semibold text-black">Fique atento</h3>
                </div>
                <p className="text-gray-700">
                  Observe pessoas ao seu redor. Se reconhecer alguém da lista de desaparecidos, 
                  entre em contato imediatamente com a Polícia Civil.
                </p>
              </div>

              <div className="bg-white border-2 border-yellow-400 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Share2 className="w-6 h-6 text-yellow-400" />
                  <h3 className="text-xl font-semibold text-black">Compartilhe</h3>
                </div>
                <p className="text-gray-700">
                  Compartilhe as informações dos desaparecidos em suas redes sociais. 
                  Quanto mais pessoas souberem, maiores as chances de localização.
                </p>
              </div>

              <div className="bg-white border-2 border-yellow-400 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Phone className="w-6 h-6 text-yellow-400" />
                  <h3 className="text-xl font-semibold text-black">Denuncie</h3>
                </div>
                <p className="text-gray-700">
                  Se tiver qualquer informação sobre um desaparecido, mesmo que pareça 
                  insignificante, entre em contato conosco. Toda informação é importante.
                </p>
              </div>

              <div className="bg-white border-2 border-yellow-400 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Mail className="w-6 h-6 text-yellow-400" />
                  <h3 className="text-xl font-semibold text-black">Mantenha contato</h3>
                </div>
                <p className="text-gray-700">
                  Siga nossas redes sociais para receber atualizações sobre casos 
                  de desaparecimento e localizações.
                </p>
              </div>
            </div>
          </div>

          {/* Informações importantes */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-black mb-6">Informações importantes</h2>
            
            <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-6">
              <h3 className="text-xl font-semibold text-red-800 mb-3">⚠️ Atenção</h3>
              <p className="text-red-700">
                <strong>Não tente abordar sozinho</strong> uma pessoa que você suspeita ser um desaparecido. 
                Entre em contato com a Polícia Civil imediatamente. A abordagem deve ser feita por 
                profissionais treinados para garantir a segurança de todos.
              </p>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-6">
              <h3 className="text-xl font-semibold text-blue-800 mb-3">ℹ️ Lembre-se</h3>
              <p className="text-blue-700">
                <strong>Não há prazo mínimo</strong> para registrar um desaparecimento. Se você suspeita 
                que alguém desapareceu, procure a Delegacia imediatamente. Quanto mais rápido 
                o registro, maiores as chances de localização.
              </p>
            </div>
          </div>

          {/* Contatos de emergência */}
          <div className="bg-black text-white rounded-lg p-8">
            <h2 className="text-3xl font-bold mb-6 text-center">Contatos de Emergência</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="text-center">
                <div className="flex justify-center mb-3">
                  <Phone className="w-8 h-8 text-yellow-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Central de Atendimento</h3>
                <p className="text-yellow-400 font-bold text-lg">(65) 3648-5100</p>
                <p className="text-gray-300 text-sm">24 horas por dia</p>
              </div>

              <div className="text-center">
                <div className="flex justify-center mb-3">
                  <Mail className="w-8 h-8 text-yellow-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">E-mail</h3>
                <p className="text-yellow-400 font-bold">atendimento@policiacivil.gov.br</p>
                <p className="text-gray-300 text-sm">Para informações gerais</p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <div className="flex justify-center mb-3">
                <MapPin className="w-8 h-8 text-yellow-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Delegacias</h3>
              <p className="text-gray-300">
                Procure a Delegacia mais próxima da sua região para registrar ocorrências
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
