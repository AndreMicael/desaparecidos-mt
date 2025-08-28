"use client";

import LogoPJC from '../../public/logo_pjc.svg';
import Image from 'next/image';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, Mail, LogIn, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export function Header() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Verificar se o admin está logado
    const checkLoginStatus = () => {
      const token = localStorage.getItem('adminToken');
      setIsLoggedIn(!!token);
    };

    checkLoginStatus();

    // Escutar mudanças no localStorage
    const handleStorageChange = () => {
      checkLoginStatus();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Também escutar mudanças no mesmo contexto
    const interval = setInterval(checkLoginStatus, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsLoggedIn(false);
    window.location.href = '/';
  };

  return (
    <motion.div 
      className="bg-black text-white font-encode-sans"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Top contact bar */}
      <motion.div 
        className="border-b border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.05 }}
      >
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex justify-between items-center text-xs sm:text-sm">
            <div className="flex items-center gap-4 lg:gap-6">
              <motion.div 
                className="flex items-center gap-2"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.15 }}
              >
                <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
                <span className="text-white">(65) 3648-5100</span>
              </motion.div>
              <motion.div 
                className="hidden sm:flex items-center gap-2"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.15 }}
              >
                <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
                <span className="text-white">atendimento@policiacivil.gov.br</span>
              </motion.div>
            </div>
            <motion.div 
              className="hidden lg:flex items-center gap-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <span className="text-gray-300 text-xs">Emergência:</span>
              <motion.span 
                className="font-medium text-yellow-400"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.15 }}
              >
                197
              </motion.span>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and title */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.15 }}
          >
            <Link href="/" className="flex items-center gap-3 sm:gap-4 hover:opacity-90 transition-opacity">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.15 }}
              >
                <Image src={LogoPJC} alt="Logo" width={40} height={40} className="sm:w-[50px] sm:h-[50px]" />
              </motion.div>
              <div>
                <h1 className="text-base sm:text-xl font-bold text-white">POLÍCIA JUDICIÁRIA CIVIL</h1>
                <p className="text-xs sm:text-sm text-gray-300">ESTADO DE MATO GROSSO</p>
              </div>
            </Link>
          </motion.div>

          {/* Navigation */}
          <nav className="hidden md:flex gap-6 lg:gap-8">
            {[
              { href: '/', label: 'Desaparecidos' },
              { href: '/localizados', label: 'Localizados' },
              { href: '/como-ajudar', label: 'Como Ajudar' },
              { href: '/contato', label: 'Contato' }
            ].map((link, index) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
              >
                <Link
                  href={link.href}
                  className={`px-3 py-2 transition-colors font-medium text-sm ${
                    isActive(link.href)
                      ? 'text-yellow-400 border-b-2 border-yellow-400'
                      : 'text-white hover:text-yellow-400'
                  }`}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Login/Logout button and mobile menu */}
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <motion.button 
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors font-medium text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.15 }}
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" />
                Sair
              </motion.button>
            ) : (
              <motion.button 
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-yellow-400 text-white rounded-md hover:bg-yellow-500 transition-colors font-medium text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.15 }}
                onClick={() => window.location.href = '/admin/login'}
              >
                <LogIn className="w-4 h-4" />
                Login
              </motion.button>
            )}
            
            {/* Mobile menu button */}
            <motion.button 
              className="md:hidden p-2 text-white hover:text-yellow-400"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.15 }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
