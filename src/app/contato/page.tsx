"use client";

import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function ContatoPage() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    assunto: '',
    mensagem: ''
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simular envio do formulário
    setTimeout(() => {
      toast.success('Mensagem enviada com sucesso! Entraremos em contato em breve.');
      setFormData({
        nome: '',
        email: '',
        telefone: '',
        assunto: '',
        mensagem: ''
      });
      setLoading(false);
    }, 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
            CONTATO
          </h1>
          <p className="text-xl text-black/80 max-w-2xl mx-auto">
            Entre em contato conosco para informações sobre pessoas desaparecidas
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="py-12 font-encode-sans">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            
            {/* Informações de Contato */}
            <div>
              <h2 className="text-3xl font-bold text-black mb-8">Informações de Contato</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-black mb-2">Central de Atendimento</h3>
                    <p className="text-yellow-600 font-bold text-lg">(65) 3648-5100</p>
                    <p className="text-gray-600">24 horas por dia</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-black mb-2">E-mail</h3>
                    <p className="text-yellow-600 font-bold">atendimento@policiacivil.gov.br</p>
                    <p className="text-gray-600">Para informações gerais</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-black mb-2">Endereço</h3>
                    <p className="text-gray-700">
                      Palácio da Justiça<br />
                      Av. Historiador Rubens de Mendonça, 4750<br />
                      Bairro: CPA - Cuiabá/MT<br />
                      CEP: 78050-000
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-black mb-2">Horário de Funcionamento</h3>
                    <p className="text-gray-700">
                      Segunda a Sexta: 8h às 18h<br />
                      Sábados: 8h às 12h<br />
                      <span className="text-red-600 font-semibold">Emergências: 24 horas</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Alertas importantes */}
              <div className="mt-8 bg-red-50 border-l-4 border-red-500 p-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-red-800 mb-2">Informações Importantes</h3>
                    <ul className="text-red-700 space-y-1 text-sm">
                      <li>• Para denúncias urgentes, ligue diretamente para (65) 3648-5100</li>
                      <li>• Não use este formulário para casos de emergência</li>
                      <li>• Para registrar desaparecimento, procure uma Delegacia</li>
                      <li>• Mantenha sigilo sobre informações sensíveis</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Formulário de Contato */}
            <div>
              <h2 className="text-3xl font-bold text-black mb-8">Envie uma Mensagem</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
                      Nome Completo *
                    </label>
                    <Input
                      id="nome"
                      name="nome"
                      type="text"
                      required
                      value={formData.nome}
                      onChange={handleChange}
                      className="w-full"
                      placeholder="Seu nome completo"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      E-mail *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full"
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone
                  </label>
                  <Input
                    id="telefone"
                    name="telefone"
                    type="tel"
                    value={formData.telefone}
                    onChange={handleChange}
                    className="w-full"
                    placeholder="(65) 99999-9999"
                  />
                </div>

                <div>
                  <label htmlFor="assunto" className="block text-sm font-medium text-gray-700 mb-2">
                    Assunto *
                  </label>
                  <Input
                    id="assunto"
                    name="assunto"
                    type="text"
                    required
                    value={formData.assunto}
                    onChange={handleChange}
                    className="w-full"
                    placeholder="Assunto da mensagem"
                  />
                </div>

                <div>
                  <label htmlFor="mensagem" className="block text-sm font-medium text-gray-700 mb-2">
                    Mensagem *
                  </label>
                  <textarea
                    id="mensagem"
                    name="mensagem"
                    required
                    value={formData.mensagem}
                    onChange={handleChange}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    placeholder="Digite sua mensagem..."
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Enviar Mensagem
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}