"use client";

import LogoPJC from '../../public/logo_pjc.svg';
import Image from 'next/image';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, Mail } from 'lucide-react';

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
          <div className="flex justify-between items-center text-xs sm:text-sm">
            <div className="flex items-center gap-4 lg:gap-6">
              <div className="flex items-center gap-2">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-white">(65) 3648-5100</span>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-white">atendimento@policiacivil.gov.br</span>
              </div>
            </div>
            <div className="hidden lg:flex items-center gap-3">
              <span className="text-gray-300 text-xs">Emergência:</span>
              <span className="font-medium text-yellow-400">197</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and title */}
          <Link href="/" className="flex items-center gap-3 sm:gap-4 hover:opacity-90 transition-opacity">
            <Image src={LogoPJC} alt="Logo" width={40} height={40} className="sm:w-[50px] sm:h-[50px]" />
            <div>
              <h1 className="text-base sm:text-xl font-bold text-white">POLÍCIA JUDICIÁRIA CIVIL</h1>
              <p className="text-xs sm:text-sm text-gray-300">ESTADO DE MATO GROSSO</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex gap-6 lg:gap-8">
            <Link
              href="/"
              className={`px-3 py-2 transition-colors font-medium text-sm ${
                isActive('/')
                  ? 'text-yellow-400 border-b-2 border-yellow-400'
                  : 'text-white hover:text-yellow-400'
              }`}
            >
              Desaparecidos
            </Link>
            <Link
              href="/localizados"
              className={`px-3 py-2 transition-colors font-medium text-sm ${
                isActive('/localizados')
                  ? 'text-yellow-400 border-b-2 border-yellow-400'
                  : 'text-white hover:text-yellow-400'
              }`}
            >
              Localizados
            </Link>
            <Link
              href="/como-ajudar"
              className={`px-3 py-2 transition-colors font-medium text-sm ${
                isActive('/como-ajudar')
                  ? 'text-yellow-400 border-b-2 border-yellow-400'
                  : 'text-white hover:text-yellow-400'
              }`}
            >
              Como Ajudar
            </Link>
            <Link
              href="/contato"
              className={`px-3 py-2 transition-colors font-medium text-sm ${
                isActive('/contato')
                  ? 'text-yellow-400 border-b-2 border-yellow-400'
                  : 'text-white hover:text-yellow-400'
              }`}
            >
              Contato
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button className="md:hidden p-2 text-white hover:text-yellow-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
