// app/data.ts

// Definindo um tipo básico para as instalações para melhor organização (opcional, mas bom)
export interface Facility {
    id: number;
    name: string;
    status: "Disponível" | "Ocupado" | "Manutenção"; // Usando tipos literais para status
    type: string;
  }
  
  // Definindo um tipo básico para os instrutores
  export interface Instructor {
    id: number;
    name: string;
    specialty: string;
    contact: string;
  }
  
  // Lista de dados fictícios para as instalações esportivas
  export const facilitiesData: Facility[] = [
    { id: 1, name: "Quadra Poliesportiva A", status: "Disponível", type: "Quadra" },
    { id: 2, name: "Campo de Futebol Society", status: "Ocupado", type: "Campo" },
    { id: 3, name: "Piscina Semi-olímpica", status: "Manutenção", type: "Piscina" },
    { id: 4, name: "Quadra de Tênis 1", status: "Disponível", type: "Quadra" },
    { id: 5, name: "Sala de Ginástica", status: "Disponível", type: "Sala" },
  ];
  
  // Lista de dados fictícios para os instrutores/professores
  export const instructorsData: Instructor[] = [
    { id: 101, name: "Carlos Silva", specialty: "Futebol de Salão", contact: "carlos.silva@email.com" },
    { id: 102, name: "Ana Pereira", specialty: "Natação (Adulto/Infantil)", contact: "ana.p@email.com" },
    { id: 103, name: "João Costa", specialty: "Treinamento Funcional", contact: "joao.costa.trainer@email.com" },
    { id: 104, name: "Mariana Lima", specialty: "Yoga e Pilates", contact: "mari.lima.yoga@email.com" },
    { id: 105, name: "Ricardo Alves", specialty: "Musculação", contact: "ricardo.gym@email.com" },
  ];