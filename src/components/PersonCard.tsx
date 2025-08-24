"use client";

import { User } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './ui/image-with-fallback';
import { Person } from '@/types/person';
import { useRouter } from 'next/navigation';

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
    <Card 
      className="group cursor-pointer hover:shadow-sm transition-all duration-200 border border-gray-200 hover:border-gray-400 bg-white text-black overflow-hidden font-encode-sans"
      onClick={handleCardClick}
    >
      <CardContent className="p-0">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <ImageWithFallback
            src={person.foto}
            alt={`Foto de ${person.nome}`}
            className="w-full h-full object-cover transition-transform duration-200"
            containerClassName="w-full h-full"
            placeholder={
              <div className="w-full h-full flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
            }
          />
          {/* Status badge overlay */}
          <div className="absolute top-2 right-2 z-10">
            <Badge 
              variant={person.localizado ? "default" : "destructive"}
              className={person.localizado 
                ? "bg-emerald-700 text-white hover:bg-gray-800 border-none font-medium text-xs rounded-sm" 
                : "bg-red-800 text-white hover:bg-gray-800 border-none font-medium text-xs rounded-sm"
              }
            >
              {person.localizado ? 'Localizado' : 'Desaparecido'}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3 bg-white">
          {/* Header */}
          <div className="space-y-2">
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
          </div>

          {/* Details */}
          <div className="space-y-2 text-sm">
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
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-gray-100">
            <div className="bg-gray-900 hover:bg-gray-50 hover:text-black hover:outline-2 hover:outline-black text-white text-center py-2 rounded-sm font-medium text-sm group-hover:bg-gray-800 transition-colors">
              Ver detalhes
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
