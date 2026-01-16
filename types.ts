export type QuizSection = 'Agriculture Core' | 'Rural Sociology';

export interface Question {
  id: string | number;
  question: string;
  questionHindi?: string;
  options: string[];
  correctAnswerIndex: number;
  category: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  subject?: string;
}

export interface User {
  name: string;
  phone: string;
  avatar?: string;
}

export interface GameSettings {
  timerDuration: number;
  section: QuizSection;
  availableLifelines: {
    fiftyFifty: boolean;
    audiencePoll: boolean;
    phoneAFriend: boolean;
    doubleDip: boolean;
  };
}

export interface GameState {
  currentQuestionIndex: number;
  selectedOption: number | null;
  isLocked: boolean;
  isCorrect: boolean | null;
  score: number;
  lifelines: {
    fiftyFifty: boolean;
    audiencePoll: boolean;
    phoneAFriend: boolean;
    doubleDip: boolean;
  };
  gameStatus: 'playing' | 'won' | 'lost'; 
  activeLifeline: string | null;
  eliminatedOptions: number[];
  doubleDipActive: boolean;
  moneyWon: number;
}

export const PRIZE_LADDER = [
  1000, 2000, 3000, 5000, 10000, 
  20000, 40000, 80000, 160000, 320000, 
  640000, 1250000, 2500000, 5000000, 10000000, 70000000 
];

export const SAFE_HAVENS = [4, 9, 14];