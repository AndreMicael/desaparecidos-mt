"use client";

import { User } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { PersonPhoto } from './ui/optimized-image';
import { Person } from '@/types/person';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { getStatusColors, getStatusBadgeClasses } from '@/lib/status-colors';

interface PersonCardProps {
  person: Person;
  onClick?: () => void;
}

export function PersonCard({ person, onClick }: PersonCardProps) {
  const router = useRouter();

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Data não informada';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR');
    } catch {
      return 'Data inválida';
    }
  };

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return null;
    
    try {
      const birth = new Date(birthDate);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      
      return age;
    } catch {
      return null;
    }
  };

  // Usar idade da API se disponível, senão calcular pela data de nascimento
  const age = person.idade || (person.dtNascimento ? calculateAge(person.dtNascimento) : null);

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else {
      // Navegar para a página individual da pessoa
      const personId = person.id as number;
      const route = person.localizado 
        ? `/localizados/pessoa/${personId}`
        : `/desaparecidos/pessoa/${personId}`;
      
      router.push(route);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2 }}
      layout
    >
      <Card 
        className="group cursor-pointer hover:shadow-lg transition-all duration-200 border border-gray-200 hover:border-gray-400 bg-white text-black overflow-hidden font-encode-sans"
        onClick={handleCardClick}
      >
        <CardContent className="p-0">
          {/* Image */}
          <div className="relative aspect-square overflow-hidden bg-gray-100">
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.15 }}
              className="w-full h-full"
            >
              <PersonPhoto
                src={person.foto}
                alt={`Foto de ${person.nome}`}
                size="md"
                className="w-full h-full object-cover"
              />
            </motion.div>
            {/* Status badge overlay */}
            <motion.div 
              className="absolute top-2 right-2 z-10"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.05 }}
            >
              <Badge 
                variant={getStatusColors(person.localizado).variant}
                className={getStatusBadgeClasses(person.localizado)}
              >
                {getStatusColors(person.localizado).label}
              </Badge>
            </motion.div>
          </div>

          {/* Content */}
          <div className="p-4 space-y-3 bg-white">
            {/* Header */}
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <h3 className="font-semibold text-gray-900 line-clamp-1 text-base">
                {person.nome}
              </h3>
              <div className="flex items-center justify-between text-sm">
                {age && (
                  <span className="text-gray-600 font-medium">
                    {age} anos
                  </span>
                )}
                <span className="text-gray-600 capitalize">
                  {person.sexo}
                </span>
              </div>
            </motion.div>

            {/* Details */}
            <motion.div 
              className="space-y-2 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.15 }}
            >
              {person.dtDesaparecimento && (
                <div className="flex items-center gap-2 text-gray-600">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Desde {formatDate(person.dtDesaparecimento)}</span>
                </div>
              )}
              
              {person.localDesaparecimentoConcat && (
                <div className="flex items-start gap-2 text-gray-600">
                  <svg className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="line-clamp-2">{person.localDesaparecimentoConcat}</span>
                </div>
              )}
            </motion.div>

            {/* Footer */}
            <motion.div 
              className="pt-3 border-t border-gray-100"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <motion.div 
                className="bg-gray-900 hover:bg-gray-50 hover:text-black hover:outline-2 hover:outline-black text-white text-center py-2 rounded-sm font-medium text-sm group-hover:bg-gray-800 transition-colors"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                Ver detalhes
              </motion.div>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
