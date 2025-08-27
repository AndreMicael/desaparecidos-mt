"use client";

import { Phone, Mail, MapPin, AlertTriangle, Heart, Share2, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ComoAjudarPage() {
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
            COMO AJUDAR
          </motion.h1>
          <motion.p 
            className="text-xl text-black/80 max-w-2xl mx-auto"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Sua ajuda pode fazer a diferença na localização de pessoas desaparecidas
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
        <div className="max-w-4xl mx-auto px-4">
          
          {/* O que fazer se alguém desapareceu */}
          <motion.div 
            className="mb-12"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <motion.h2 
              className="text-3xl font-bold text-black mb-6 flex items-center gap-3"
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </motion.div>
              O que fazer se alguém desapareceu?
            </motion.h2>
            
            <motion.div 
              className="bg-gray-50 rounded-lg p-6 mb-6"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <h3 className="text-xl font-semibold text-black mb-4">Passos imediatos:</h3>
              <ol className="space-y-3 text-gray-700">
                {[
                  "Procure em locais onde a pessoa costuma frequentar (casa de amigos, trabalho, escola)",
                  "Entre em contato com familiares, amigos e conhecidos",
                  "Dirija-se imediatamente à Delegacia mais próxima para registrar o Boletim de Ocorrência",
                  "Forneça fotos recentes e informações detalhadas sobre a pessoa",
                  "Mantenha contato com a Delegacia para acompanhar as investigações"
                ].map((step, index) => (
                  <motion.li 
                    key={index}
                    className="flex items-start gap-3"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1.4 + index * 0.1 }}
                  >
                    <motion.span 
                      className="bg-yellow-400 text-black font-bold rounded-full w-6 h-6 flex items-center justify-center text-sm flex-shrink-0 mt-0.5"
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ duration: 0.3 }}
                    >
                      {index + 1}
                    </motion.span>
                    <span>{step}</span>
                  </motion.li>
                ))}
              </ol>
            </motion.div>
          </motion.div>

          {/* Como você pode ajudar */}
          <motion.div 
            className="mb-12"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.6 }}
          >
            <motion.h2 
              className="text-3xl font-bold text-black mb-6 flex items-center gap-3"
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.8 }}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                <Heart className="w-8 h-8 text-red-600" />
              </motion.div>
              Como você pode ajudar?
            </motion.h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  icon: Eye,
                  title: "Fique atento",
                  description: "Observe pessoas ao seu redor. Se reconhecer alguém da lista de desaparecidos, entre em contato imediatamente com a Polícia Civil."
                },
                {
                  icon: Share2,
                  title: "Compartilhe",
                  description: "Compartilhe as informações dos desaparecidos em suas redes sociais. Quanto mais pessoas souberem, maiores as chances de localização."
                },
                {
                  icon: Phone,
                  title: "Denuncie",
                  description: "Se tiver qualquer informação sobre um desaparecido, mesmo que pareça insignificante, entre em contato conosco. Toda informação é importante."
                },
                {
                  icon: Mail,
                  title: "Mantenha contato",
                  description: "Siga nossas redes sociais para receber atualizações sobre casos de desaparecimento e localizações."
                }
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  className="bg-white border-2 border-yellow-400 rounded-lg p-6"
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 2.0 + index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <item.icon className="w-6 h-6 text-yellow-400" />
                    </motion.div>
                    <h3 className="text-xl font-semibold text-black">{item.title}</h3>
                  </div>
                  <p className="text-gray-700">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Informações importantes */}
          <motion.div 
            className="mb-12"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 2.4 }}
          >
            <motion.h2 
              className="text-3xl font-bold text-black mb-6"
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 2.6 }}
            >
              Informações importantes
            </motion.h2>
            
            <motion.div 
              className="bg-red-50 border-l-4 border-red-500 p-6 mb-6"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 2.8 }}
              whileHover={{ scale: 1.01 }}
            >
              <h3 className="text-xl font-semibold text-red-800 mb-3">⚠️ Atenção</h3>
              <p className="text-red-700">
                <strong>Não tente abordar sozinho</strong> uma pessoa que você suspeita ser um desaparecido. 
                Entre em contato com a Polícia Civil imediatamente. A abordagem deve ser feita por 
                profissionais treinados para garantir a segurança de todos.
              </p>
            </motion.div>

            <motion.div 
              className="bg-blue-50 border-l-4 border-blue-500 p-6"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 3.0 }}
              whileHover={{ scale: 1.01 }}
            >
              <h3 className="text-xl font-semibold text-blue-800 mb-3">ℹ️ Lembre-se</h3>
              <p className="text-blue-700">
                <strong>Não há prazo mínimo</strong> para registrar um desaparecimento. Se você suspeita 
                que alguém desapareceu, procure a Delegacia imediatamente. Quanto mais rápido 
                o registro, maiores as chances de localização.
              </p>
            </motion.div>
          </motion.div>

          {/* Contatos de emergência */}
          <motion.div 
            className="bg-black text-white rounded-lg p-8"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 3.2 }}
          >
            <motion.h2 
              className="text-3xl font-bold mb-6 text-center"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 3.4 }}
            >
              Contatos de Emergência
            </motion.h2>
            
            <div className="grid md:grid-cols-2 gap-6">
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
                }
              ].map((contact, index) => (
                <motion.div 
                  key={index}
                  className="text-center"
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 3.6 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.div 
                    className="flex justify-center mb-3"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <contact.icon className="w-8 h-8 text-yellow-400" />
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-2">{contact.title}</h3>
                  <p className="text-yellow-400 font-bold text-lg">{contact.value}</p>
                  <p className="text-gray-300 text-sm">{contact.subtitle}</p>
                </motion.div>
              ))}
            </div>

            <motion.div 
              className="mt-8 text-center"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 3.8 }}
              whileHover={{ scale: 1.02 }}
            >
              <motion.div 
                className="flex justify-center mb-3"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <MapPin className="w-8 h-8 text-yellow-400" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-2">Delegacias</h3>
              <p className="text-gray-300">
                Procure a Delegacia mais próxima da sua região para registrar ocorrências
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
