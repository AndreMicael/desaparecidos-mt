"use client";

import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, AlertTriangle } from 'lucide-react';
import dynamic from 'next/dynamic';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { usePhoneMask } from '@/lib/masks';

// Lazy loading dos componentes
const Button = dynamic(() => import('@/components/ui/button').then(mod => ({ default: mod.Button })), {
  ssr: false
});

const Input = dynamic(() => import('@/components/ui/input').then(mod => ({ default: mod.Input })), {
  ssr: false
});

export default function ContatoPage() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    assunto: '',
    mensagem: ''
  });

  const [loading, setLoading] = useState(false);
  const { handlePhoneChange } = usePhoneMask();

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
    const { name, value } = e.target;
    
    if (name === 'telefone') {
      handlePhoneChange(value, (formattedValue) => {
        setFormData(prev => ({
          ...prev,
          [name]: formattedValue
        }));
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Hero Section */}
      <motion.div 
        className="bg-gradient-to-r from-yellow-400 to-yellow-500 py-16"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold text-black mb-4"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            CONTATO
          </motion.h1>
          <motion.p 
            className="text-xl text-black/80 max-w-2xl mx-auto"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Entre em contato conosco para informações sobre pessoas desaparecidas
          </motion.p>
        </div>
      </motion.div>

      {/* Content Section */}
      <motion.div 
        className="py-12 font-encode-sans"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            
            {/* Informações de Contato */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <motion.h2 
                className="text-3xl font-bold text-black mb-8"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.0 }}
              >
                Informações de Contato
              </motion.h2>
              
              <div className="space-y-6">
                {[
                  {
                    icon: Phone,
                    title: "Central de Atendimento",
                    value: "(65) 3648-5100",
                    subtitle: "24 horas por dia"
                  },
                  {
                    icon: Mail,
                    title: "E-mail",
                    value: "atendimento@policiacivil.gov.br",
                    subtitle: "Para informações gerais"
                  },
                  {
                    icon: MapPin,
                    title: "Endereço",
                    value: "Palácio da Justiça\nAv. Historiador Rubens de Mendonça, 4750\nBairro: CPA - Cuiabá/MT\nCEP: 78050-000",
                    subtitle: ""
                  },
                  {
                    icon: Clock,
                    title: "Horário de Funcionamento",
                    value: "Segunda a Sexta: 8h às 18h\nSábados: 8h às 12h\nEmergências: 24 horas",
                    subtitle: ""
                  }
                ].map((contact, index) => (
                  <motion.div 
                    key={index}
                    className="flex items-start gap-4"
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                  >
                    <motion.div 
                      className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0"
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    >
                      <contact.icon className="w-6 h-6 text-black" />
                    </motion.div>
                    <div>
                      <h3 className="text-xl font-semibold text-black mb-2">{contact.title}</h3>
                      <p className="text-yellow-600 font-bold text-lg whitespace-pre-line">{contact.value}</p>
                      {contact.subtitle && <p className="text-gray-600">{contact.subtitle}</p>}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Alertas importantes */}
              <motion.div 
                className="mt-8 bg-red-50 border-l-4 border-red-500 p-6"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.6 }}
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-start gap-3">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                  </motion.div>
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
              </motion.div>
            </motion.div>

            {/* Formulário de Contato */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <motion.h2 
                className="text-3xl font-bold text-black mb-8"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.0 }}
              >
                Envie uma Mensagem
              </motion.h2>
              
              <motion.form 
                onSubmit={handleSubmit} 
                className="space-y-6"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.2 }}
              >
                <motion.div 
                  className="grid md:grid-cols-2 gap-4"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 1.4 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
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
                      className="w-full bg-white text-black border-gray-300 focus:ring-yellow-400 focus:border-yellow-400"
                      placeholder="Seu nome completo"
                    />
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
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
                      className="w-full bg-white text-black border-gray-300 focus:ring-yellow-400 focus:border-yellow-400"
                      placeholder="seu@email.com"
                    />
                  </motion.div>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 1.6 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone
                  </label>
                  <Input
                    id="telefone"
                    name="telefone"
                    type="tel"
                    value={formData.telefone}
                    onChange={handleChange}
                    className="w-full bg-white text-black border-gray-300 focus:ring-yellow-400 focus:border-yellow-400"
                    placeholder="(65) 99999-9999"
                  />
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 1.8 }}
                  whileHover={{ scale: 1.02 }}
                >
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
                    className="w-full bg-white text-black border-gray-300 focus:ring-yellow-400 focus:border-yellow-400"
                    placeholder="Assunto da mensagem"
                  />
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 2.0 }}
                  whileHover={{ scale: 1.02 }}
                >
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-white text-black"
                    placeholder="Digite sua mensagem..."
                  />
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 2.2 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <motion.div 
                          className="w-4 h-4 border-2 border-black border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <motion.div
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.6 }}
                        >
                          <Send className="w-4 h-4" />
                        </motion.div>
                        Enviar Mensagem
                      </>
                    )}
                  </Button>
                </motion.div>
              </motion.form>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}