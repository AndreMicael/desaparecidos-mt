"use client";

import { Phone, Mail, Instagram, Facebook } from 'lucide-react';

interface HeaderProps {
  activeTab?: 'desaparecidos' | 'localizados' | 'como-ajudar' | 'contato';
  onTabChange?: (tab: 'desaparecidos' | 'localizados' | 'como-ajudar' | 'contato') => void;
}

export function Header({ activeTab = 'desaparecidos', onTabChange }: HeaderProps) {
  return (
    <div className="bg-black text-white font-encode-sans">
      {/* Top contact bar */}
      <div className="border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-yellow-400" />
                <span>Central de Atendimento: (65) 3648-5100</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-yellow-400" />
                <span>atendimento@policiacivil.gov.br</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span>Redes Sociais:</span>
              <div className="flex gap-2">
                <div className="w-6 h-6 bg-yellow-400 border border-black rounded flex items-center justify-center">
                  <Instagram className="w-3 h-3 text-black" />
                </div>
                <div className="w-6 h-6 bg-yellow-400 border border-black rounded flex items-center justify-center">
                  <Facebook className="w-3 h-3 text-black" />
                </div>
                <div className="w-6 h-6 bg-yellow-400 border border-black rounded flex items-center justify-center text-black text-xs font-bold">
                  X
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and title */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">POLÍCIA</span>
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold">POLÍCIA CIVIL</h1>
              <p className="text-sm text-gray-300">ESTADO DE MATO GROSSO</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex gap-8">
            <button
              onClick={() => onTabChange?.('desaparecidos')}
              className={`px-4 py-2 transition-colors font-medium ${
                activeTab === 'desaparecidos'
                  ? 'text-yellow-400 border-b-2 border-yellow-400'
                  : 'text-white hover:text-yellow-400'
              }`}
            >
              Desaparecidos
            </button>
            <button
              onClick={() => onTabChange?.('localizados')}
              className={`px-4 py-2 transition-colors font-medium ${
                activeTab === 'localizados'
                  ? 'text-yellow-400 border-b-2 border-yellow-400'
                  : 'text-white hover:text-yellow-400'
              }`}
            >
              Localizados
            </button>
            <button
              onClick={() => onTabChange?.('como-ajudar')}
              className={`px-4 py-2 transition-colors font-medium ${
                activeTab === 'como-ajudar'
                  ? 'text-yellow-400 border-b-2 border-yellow-400'
                  : 'text-white hover:text-yellow-400'
              }`}
            >
              Como Ajudar
            </button>
            <button
              onClick={() => onTabChange?.('contato')}
              className={`px-4 py-2 transition-colors font-medium ${
                activeTab === 'contato'
                  ? 'text-yellow-400 border-b-2 border-yellow-400'
                  : 'text-white hover:text-yellow-400'
              }`}
            >
              Contato
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
