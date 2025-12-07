export enum StatType {
  ACADEMICS = 'Academics',
  INTELLIGENCE = 'Intelligence',
  STRENGTH = 'Strength',
  ENDURANCE = 'Endurance',
  DISCIPLINE = 'Discipline',
}

export enum Rank {
  E = 'E',
  D = 'D',
  C = 'C',
  B = 'B',
  A = 'A',
  S = 'S',
  SS = 'SS',
  SSS = 'SSS',
}

export interface Quest {
  id: string;
  name: string;
  stat: StatType;
  difficulty: number; // 1-10
  date: string; // ISO Date string YYYY-MM-DD
  completed: boolean;
}

export interface UserStats {
  [StatType.ACADEMICS]: number;
  [StatType.INTELLIGENCE]: number;
  [StatType.STRENGTH]: number;
  [StatType.ENDURANCE]: number;
  [StatType.DISCIPLINE]: number;
}

export interface UserProfile {
  name: string;
  age: number;
  level: number;
  rank: Rank;
  totalXp: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}
