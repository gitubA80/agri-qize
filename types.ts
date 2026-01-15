export interface Question {
  id: number;
  question: string;
  questionHindi?: string;
  options: string[];
  correctAnswerIndex: number;
  category: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface User {
  name: string;
  phone: string;
  avatar?: string;
}

export interface GameSettings {
  timerDuration: number;
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
  isCorrect: boolean | null; // null = pending/thinking
  score: number;
  lifelines: {
    fiftyFifty: boolean;
    audiencePoll: boolean;
    phoneAFriend: boolean;
    doubleDip: boolean;
  };
  // 'intro' removed here as it is handled by App navigation now
  gameStatus: 'playing' | 'won' | 'lost'; 
  activeLifeline: string | null;
  eliminatedOptions: number[]; // For 50:50
  doubleDipActive: boolean;
  moneyWon: number;
}

export const PRIZE_LADDER = [
  1000, 2000, 3000, 5000, 10000, // Safe Haven 1 (Index 4)
  20000, 40000, 80000, 160000, 320000, // Safe Haven 2 (Index 9)
  640000, 1250000, 2500000, 5000000, 10000000, 70000000 // 1 Crore (Index 14)
];

export const SAFE_HAVENS = [4, 9, 14];