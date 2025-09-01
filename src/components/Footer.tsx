"use client";

import { ImageWithFallback } from "./ui/image-with-fallback";
import LogoPJC from "../../public/logo_pjc.svg";
import Image from "next/image";
import { useState, useEffect } from "react";

// Componente para indicar o status da API
function ApiStatusIndicator() {
  const [status, setStatus] = useState<'online' | 'offline' | 'checking'>('checking');
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const checkApiStatus = async () => {
    try {
      setStatus('checking');
      const response = await fetch('/api/pessoas', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        setStatus('online');
      } else {
        setStatus('offline');
      }
      setLastCheck(new Date());
    } catch (error) {
      setStatus('offline');
      setLastCheck(new Date());
    }
  };

  useEffect(() => {
    // Verificar imediatamente
    checkApiStatus();
    
    // Verificar a cada minuto (60000ms)
    const interval = setInterval(checkApiStatus, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'offline':
        return 'bg-red-500';
      case 'checking':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'online':
        return 'API Online';
      case 'offline':
        return 'API Offline';
      case 'checking':
        return 'Verificando...';
      default:
        return 'Desconhecido';
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full ${getStatusColor()} animate-pulse`}></div>
      <span className="text-xs text-gray-300">{getStatusText()}</span>
      {lastCheck && (
        <span className="text-xs text-gray-400">
          ({lastCheck.toLocaleTimeString('pt-BR')})
        </span>
      )}
      <button
        onClick={checkApiStatus}
        className="ml-2 px-2 py-1 text-xs bg-yellow-400 text-black rounded hover:bg-yellow-300 transition-colors font-medium"
        title="Verificar status da API agora"
      >
        Verificar
      </button>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="bg-black text-white border-t border-gray-800 font-encode-sans">
      {/* Informational banner */}
      <div className="bg-gray-900 py-6 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-4">
            <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-semibold text-yellow-400">VOCÊ SABIA?</h3>
              <p className="text-sm text-gray-300">
                QUE É NECESSÁRIO AGUARDAR 24 HORAS PARA REGISTRAR O DESAPARECIMENTO DE UMA PESSOA ADULTA?
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Partnerships section */}
      <div className="py-8 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold mb-2 text-yellow-400">PARCEIROS</h3>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-8">
            {/* Logos dos parceiros */}
            <div className="flex items-center justify-center w-24 h-12 bg-yellow-400 rounded p-2">
              <span className="text-xs text-white text-center font-medium">Governo MT</span>
            </div>
            <div className="flex items-center justify-center w-24 h-12 bg-yellow-400 rounded p-2">
              <span className="text-xs text-white text-center font-medium">SESP</span>
            </div>
            <div className="flex items-center justify-center w-24 h-12 bg-yellow-400 rounded p-2">
              <span className="text-xs text-white text-center font-medium">GEIA</span>
            </div>
            <div className="flex items-center justify-center w-24 h-12 bg-yellow-400 rounded p-2">
              <span className="text-xs text-white text-center font-medium">UFMT</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Logo e informações */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-4 mb-4">
              <Image src={LogoPJC} alt="Logo" width={50} height={50} />
                <div>
                  <h3 className="text-xl font-bold text-yellow-400">DESAPARECIDOS</h3>
                  <p className="text-sm text-gray-400">Polícia Civil - MT</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                Sistema oficial da Polícia Civil do Estado de Mato Grosso para consulta 
                e divulgação de informações sobre pessoas desaparecidas.
              </p>
              <div className="space-y-2 text-sm text-gray-300">
                <p><strong className="text-yellow-400">Endereço:</strong> Centro Político Administrativo</p>
                <p>Cuiabá - MT, CEP: 78050-970</p>
                <p><strong className="text-yellow-400">Telefone:</strong> (65) 3648-5100</p>
                <p><strong className="text-yellow-400">Email:</strong> atendimento@policiacivil.mt.gov.br</p>
              </div>
              
              {/* Indicador de status da API */}
              <div className="mt-4 p-3 bg-gray-800 rounded-lg">
                <h5 className="text-sm font-medium text-yellow-400 mb-2">Status do Sistema</h5>
                <ApiStatusIndicator />
              </div>
            </div>

            {/* Links úteis */}
            <div>
              <h4 className="font-semibold text-lg mb-4 text-yellow-400">Links Úteis</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-yellow-400 transition-colors">Como Fazer um B.O.</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition-colors">Delegacias</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition-colors">Ouvidoria</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition-colors">Transparência</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition-colors">Notícias</a></li>
              </ul>
            </div>

            {/* Contato e emergência */}
            <div>
              <h4 className="font-semibold text-lg mb-4 text-yellow-400">Emergência</h4>
              <div className="space-y-3">
                <div className="p-3 bg-transparent rounded-lg text-center outline outline-white">
                  <p className="font-bold text-lg text-white">190</p>
                  <p className="text-xs text-white">Polícia Militar</p>
                </div>
                <div className="p-3 bg-transparent rounded-lg text-center outline outline-white">
                  <p className="font-bold text-lg text-white">193</p>
                  <p className="text-xs text-white">Bombeiros</p>
                </div>
                <div className="p-3 bg-transparent rounded-lg text-center outline outline-white">
                  <p className="font-bold text-lg text-white">197</p>
                  <p className="text-xs text-white">Polícia Civil</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-gray-900 py-4 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-400">
            <p>© 2025 Site criado para fins de estudo e desenvolvimento de habilidades. Não relacionado a Polícia Civil do Estado de Mato Grosso.</p>
            <div className="flex space-x-4 mt-2 md:mt-0">
              <a href="#" className="hover:text-yellow-400 transition-colors">Política de Privacidade</a>
              <a href="#" className="hover:text-yellow-400 transition-colors">Termos de Uso</a>
              <a href="#" className="hover:text-yellow-400 transition-colors">Acessibilidade</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
