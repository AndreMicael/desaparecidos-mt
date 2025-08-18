import { Person, SearchFilters, SearchResult, Statistics } from '@/types/person';

// Dados mockados para demonstração
const mockPersons: Person[] = [
  {
    id: 1,
    nome: "Maria Silva Santos",
    dtNascimento: "1995-03-15",
    dtDesaparecimento: "2024-01-10",
    localDesaparecimentoConcat: "Centro, Cuiabá - MT",
    ultimaOcorrencia: "Vista pela última vez no Shopping Pantanal",
    foto: "",
    sexo: "feminino",
    localizado: false
  },
  {
    id: 2,
    nome: "João Pedro Oliveira",
    dtNascimento: "1988-07-22",
    dtDesaparecimento: "2024-02-05",
    localDesaparecimentoConcat: "Jardim Europa, Cuiabá - MT",
    ultimaOcorrencia: "Saiu de casa para trabalhar e não retornou",
    foto: "",
    sexo: "masculino",
    localizado: false
  },
  {
    id: 3,
    nome: "Ana Beatriz Costa",
    dtNascimento: "2005-11-08",
    dtDesaparecimento: "2023-12-20",
    localDesaparecimentoConcat: "Bairro Santa Rosa, Cuiabá - MT",
    ultimaOcorrencia: "Vista pela última vez na escola",
    foto: "",
    sexo: "feminino",
    localizado: true
  },
  {
    id: 4,
    nome: "Carlos Eduardo Lima",
    dtNascimento: "1992-04-12",
    dtDesaparecimento: "2024-01-25",
    localDesaparecimentoConcat: "Jardim das Américas, Cuiabá - MT",
    ultimaOcorrencia: "Saiu para uma caminhada e não retornou",
    foto: "",
    sexo: "masculino",
    localizado: false
  },
  {
    id: 5,
    nome: "Fernanda Rodrigues",
    dtNascimento: "1990-09-30",
    dtDesaparecimento: "2023-11-15",
    localDesaparecimentoConcat: "Centro Político Administrativo, Cuiabá - MT",
    ultimaOcorrencia: "Vista pela última vez no trabalho",
    foto: "",
    sexo: "feminino",
    localizado: true
  },
  {
    id: 6,
    nome: "Roberto Almeida",
    dtNascimento: "1985-12-03",
    dtDesaparecimento: "2024-02-10",
    localDesaparecimentoConcat: "Bairro Tijucal, Cuiabá - MT",
    ultimaOcorrencia: "Saiu para comprar pão e não retornou",
    foto: "",
    sexo: "masculino",
    localizado: false
  },
  {
    id: 7,
    nome: "Juliana Pereira",
    dtNascimento: "1998-06-18",
    dtDesaparecimento: "2024-01-30",
    localDesaparecimentoConcat: "Jardim Imperial, Cuiabá - MT",
    ultimaOcorrencia: "Vista pela última vez em uma festa",
    foto: "",
    sexo: "feminino",
    localizado: false
  },
  {
    id: 8,
    nome: "Lucas Mendes",
    dtNascimento: "2002-01-25",
    dtDesaparecimento: "2023-12-10",
    localDesaparecimentoConcat: "Bairro Santa Isabel, Cuiabá - MT",
    ultimaOcorrencia: "Saiu para estudar na biblioteca",
    foto: "",
    sexo: "masculino",
    localizado: true
  }
];

export async function searchPersons(params: {
  page: number;
  pageSize: number;
  filters?: SearchFilters;
}): Promise<SearchResult> {
  // Simular delay de rede
  await new Promise(resolve => setTimeout(resolve, 500));

  let filteredPersons = [...mockPersons];

  // Aplicar filtros
  if (params.filters) {
    if (params.filters.nome) {
      filteredPersons = filteredPersons.filter(person =>
        person.nome.toLowerCase().includes(params.filters!.nome.toLowerCase())
      );
    }

    if (params.filters.sexos.length > 0) {
      filteredPersons = filteredPersons.filter(person =>
        params.filters!.sexos.includes(person.sexo)
      );
    }

    if (params.filters.status.length > 0) {
      filteredPersons = filteredPersons.filter(person => {
        const status = person.localizado ? 'localizado' : 'desaparecido';
        return params.filters!.status.includes(status);
      });
    }

    // Filtro por idade
    if (params.filters.idadeMinima || params.filters.idadeMaxima) {
      filteredPersons = filteredPersons.filter(person => {
        if (!person.dtNascimento) return true;
        
        const birthDate = new Date(person.dtNascimento);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }

        const minAge = params.filters.idadeMinima ? parseInt(params.filters.idadeMinima) : 0;
        const maxAge = params.filters.idadeMaxima ? parseInt(params.filters.idadeMaxima) : 150;

        return age >= minAge && age <= maxAge;
      });
    }
  }

  const total = filteredPersons.length;
  const startIndex = (params.page - 1) * params.pageSize;
  const endIndex = startIndex + params.pageSize;
  const data = filteredPersons.slice(startIndex, endIndex);

  return {
    data,
    total,
    page: params.page,
    pageSize: params.pageSize
  };
}

export async function getPersonStatistics(): Promise<Statistics> {
  // Simular delay de rede
  await new Promise(resolve => setTimeout(resolve, 300));

  const total = mockPersons.length;
  const localizadas = mockPersons.filter(person => person.localizado).length;

  return {
    total,
    localizadas
  };
}

export async function getPersonById(id: string): Promise<Person | null> {
  // Simular delay de rede
  await new Promise(resolve => setTimeout(resolve, 400));

  const person = mockPersons.find(p => p.id.toString() === id);
  return person || null;
}
