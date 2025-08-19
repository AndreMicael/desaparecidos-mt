"use client";

import { useState, useEffect } from 'react';
import { Person } from '@/types/person';
import { toast } from 'sonner';
import { Loader2, ArrowLeft, Phone, Mail, MapPin, Calendar, CheckCircle } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';

// Lazy loading dos componentes
const Button = dynamic(() => import('@/components/ui/button').then(mod => ({ default: mod.Button })), {
  ssr: false
});

const Toaster = dynamic(() => import('@/components/ui/sonner').then(mod => ({ default: mod.Toaster })), {
  ssr: false
});

export default function LocalizadoPage() {
  const params = useParams();
  const router = useRouter();
  const [person, setPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const personId = params.id as string;

  useEffect(() => {
    loadPerson();
  }, [personId]);

  const loadPerson = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/pessoas/${personId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Pessoa não encontrada');
        } else {
          throw new Error(`Erro na API: ${response.status}`);
        }
        return;
      }

      const result = await response.json();
      setPerson(result.data);
    } catch (error) {
      console.error('Erro ao carregar pessoa:', error);
      setError('Erro ao carregar dados da pessoa');
      toast.error('Erro ao carregar dados.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-yellow-500 mx-auto mb-4" />
          <p className="text-gray-600">Carregando dados da pessoa...</p>
        </div>
      </div>
    );
  }

  if (error || !person) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            {error || 'Pessoa não encontrada'}
          </h1>
          <Button onClick={handleBack} className="bg-yellow-400 text-black hover:bg-yellow-500">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-400 to-green-500 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Button
            onClick={handleBack}
            variant="ghost"
            className="text-black hover:bg-black/10 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-black mb-2">
              PESSOA LOCALIZADA COM SUCESSO
            </h1>
            <p className="text-black/80">
              Informações sobre a localização
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="py-12 font-encode-sans">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Success Message */}
            <div className="bg-green-50 p-6 border-b border-green-200">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <div>
                  <h2 className="text-xl font-semibold text-green-800">
                    Localização Bem-Sucedida
                  </h2>
                  <p className="text-green-700">
                    Esta pessoa foi localizada e retornou para sua família.
                  </p>
                </div>
              </div>
            </div>

            {/* Person Header */}
            <div className="bg-gray-50 p-6 border-b">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                                 {/* Photo */}
                 <div className="w-32 h-32 bg-gray-200 rounded-lg overflow-hidden">
                   <ImageWithFallback
                     src={person.foto}
                     alt={person.nome}
                     className="w-full h-full object-cover"
                     containerClassName="w-full h-full"
                     placeholder={<div className="text-gray-400 text-4xl">👤</div>}
                   />
                 </div>

                {/* Basic Info */}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {person.nome}
                  </h2>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    {person.idade && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {person.idade} anos
                      </div>
                    )}
                    {person.sexo && (
                      <div className="flex items-center gap-1">
                        <span className="capitalize">{person.sexo}</span>
                      </div>
                    )}
                    {person.cidade && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {person.cidade}
                      </div>
                    )}
                  </div>
                </div>

                {/* Status Badge */}
                <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">
                  LOCALIZADO
                </div>
              </div>
            </div>

            {/* Detailed Information */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Informações Pessoais
                    </h3>
                    <div className="space-y-3">
                      {person.nome && (
                        <div>
                          <span className="font-medium text-gray-700">Nome:</span>
                          <span className="ml-2 text-gray-900">{person.nome}</span>
                        </div>
                      )}
                      {person.idade && (
                        <div>
                          <span className="font-medium text-gray-700">Idade:</span>
                          <span className="ml-2 text-gray-900">{person.idade} anos</span>
                        </div>
                      )}
                      {person.sexo && (
                        <div>
                          <span className="font-medium text-gray-700">Sexo:</span>
                          <span className="ml-2 text-gray-900 capitalize">{person.sexo}</span>
                        </div>
                      )}
                      {person.cidade && (
                        <div>
                          <span className="font-medium text-gray-700">Cidade:</span>
                          <span className="ml-2 text-gray-900">{person.cidade}</span>
                        </div>
                      )}
                      {person.estado && (
                        <div>
                          <span className="font-medium text-gray-700">Estado:</span>
                          <span className="ml-2 text-gray-900">{person.estado}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {person.descricao && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Descrição
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        {person.descricao}
                      </p>
                    </div>
                  )}
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {person.dataDesaparecimento && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Data do Desaparecimento
                      </h3>
                      <p className="text-gray-700">
                        {new Date(person.dataDesaparecimento).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  )}

                  {person.localDesaparecimento && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Local do Desaparecimento
                      </h3>
                      <p className="text-gray-700">
                        {person.localDesaparecimento}
                      </p>
                    </div>
                  )}

                  {person.dataLocalizacao && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Data da Localização
                      </h3>
                      <p className="text-gray-700">
                        {new Date(person.dataLocalizacao).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  )}

                  {person.informacoesAdicionais && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Informações Adicionais
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        {person.informacoesAdicionais}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Success Information */}
              <div className="mt-8 pt-6 border-t">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Histórico de Localização
                </h3>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-gray-700 mb-3">
                    Esta pessoa foi localizada com sucesso pela Polícia Civil de Mato Grosso e retornou para sua família.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex items-center gap-2 text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Localização bem-sucedida</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <span>✅ Retornou para a família</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}
