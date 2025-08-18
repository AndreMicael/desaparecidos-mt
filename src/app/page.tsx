"use client";

import { useState } from 'react';
import { HomePage } from '@/components/HomePage';
import { Person } from '@/types/person';
import { Toaster } from '@/components/ui/sonner';

export default function Home() {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const handlePersonClick = (person: Person) => {
    setSelectedPerson(person);
    // Aqui você pode implementar a navegação para a página de detalhes
    console.log('Pessoa selecionada:', person);
  };

  return (
    <div className="min-h-screen bg-white">
      <HomePage onPersonClick={handlePersonClick} />
      <Toaster position="top-right" />
    </div>
  );
}
