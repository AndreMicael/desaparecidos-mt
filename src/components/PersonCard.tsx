"use client";

import { Calendar, MapPin, User, Clock } from 'lucide-react';
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
      className="group cursor-pointer hover:shadow-xl transition-all duration-300 border-2 border-gray-200 hover:border-yellow-400 bg-white text-black overflow-hidden font-encode-sans"
      onClick={handleCardClick}
    >
      <CardContent className="p-0">
        {/* Image */}
        <div className="aspect-square overflow-hidden bg-gray-100">
          <ImageWithFallback
            src={person.foto}
            alt={`Foto de ${person.nome}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            containerClassName="w-full h-full"
            placeholder={<User className="w-16 h-16 text-gray-400" />}
          />
          {/* Status badge overlay */}
          <div className="absolute top-3 right-3">
            <Badge 
              variant={person.localizado ? "default" : "destructive"}
              className={person.localizado 
                ? "bg-yellow-400 text-black hover:bg-yellow-500 border-none font-medium" 
                : "bg-red-600 text-white hover:bg-red-700 border-none font-medium"
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
            <h3 className="font-bold text-black line-clamp-1 text-lg">
              {person.nome}
            </h3>
            <div className="flex items-center justify-between">
              {age && (
                <span className="text-sm text-black font-medium bg-yellow-100 px-2 py-1 rounded">
                  {age} anos
                </span>
              )}
              <span className="text-xs text-gray-600 uppercase tracking-wide font-medium">
                {person.sexo}
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-2 text-sm">
            {person.dtDesaparecimento && (
              <div className="flex items-center gap-2 text-gray-700">
                <Calendar className="w-4 h-4 text-yellow-500" />
                <span>Desapareceu em {formatDate(person.dtDesaparecimento)}</span>
              </div>
            )}
            
            {person.localDesaparecimentoConcat && (
              <div className="flex items-start gap-2 text-gray-700">
                <MapPin className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                <span className="line-clamp-2">{person.localDesaparecimentoConcat}</span>
              </div>
            )}
            
            {person.ultimaOcorrencia && (
              <div className="flex items-start gap-2 text-gray-700">
                <Clock className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                <span className="line-clamp-2">{person.ultimaOcorrencia}</span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-gray-200">
            <div className="bg-yellow-400 text-black text-center py-2 rounded font-medium text-sm group-hover:bg-yellow-500 transition-colors">
              Clique para ver detalhes
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
