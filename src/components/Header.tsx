"use client";

import LogoPJC from '../../public/logo_pjc.svg';
import Image from 'next/image';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, Mail, Instagram, Facebook } from 'lucide-react';

export function Header() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

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
                <a 
                  href="https://instagram.com/policiacivilmt" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-6 h-6 bg-yellow-400 border border-black rounded flex items-center justify-center hover:bg-yellow-300 transition-colors"
                >
                  <Instagram className="w-3 h-3 text-black" />
                </a>
                <a 
                  href="https://facebook.com/policiacivilmt" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-6 h-6 bg-yellow-400 border border-black rounded flex items-center justify-center hover:bg-yellow-300 transition-colors"
                >
                  <Facebook className="w-3 h-3 text-black" />
                </a>
                <a 
                  href="https://x.com/policiacivilmt" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-6 h-6 bg-yellow-400 border border-black rounded flex items-center justify-center text-black text-xs font-bold hover:bg-yellow-300 transition-colors"
                >
                  X
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and title */}
          <Link href="/" className="flex items-center gap-4 hover:opacity-90 transition-opacity">
            <Image src={LogoPJC} alt="Logo" width={50} height={50} />
            <div>
              <h1 className="text-xl font-bold">POLÍCIA JUDICIÁRIA CIVIL</h1>
              <p className="text-sm text-gray-300">ESTADO DE MATO GROSSO</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex gap-8">
            <Link
              href="/"
              className={`px-4 py-2 transition-colors font-medium ${
                isActive('/')
                  ? 'text-yellow-400 border-b-2 border-yellow-400'
                  : 'text-white hover:text-yellow-400'
              }`}
            >
              Desaparecidos
            </Link>
            <Link
              href="/localizados"
              className={`px-4 py-2 transition-colors font-medium ${
                isActive('/localizados')
                  ? 'text-yellow-400 border-b-2 border-yellow-400'
                  : 'text-white hover:text-yellow-400'
              }`}
            >
              Localizados
            </Link>
            <Link
              href="/como-ajudar"
              className={`px-4 py-2 transition-colors font-medium ${
                isActive('/como-ajudar')
                  ? 'text-yellow-400 border-b-2 border-yellow-400'
                  : 'text-white hover:text-yellow-400'
              }`}
            >
              Como Ajudar
            </Link>
            <Link
              href="/contato"
              className={`px-4 py-2 transition-colors font-medium ${
                isActive('/contato')
                  ? 'text-yellow-400 border-b-2 border-yellow-400'
                  : 'text-white hover:text-yellow-400'
              }`}
            >
              Contato
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
}
