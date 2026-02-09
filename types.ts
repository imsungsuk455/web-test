export type PersonalityType = 'EGEN' | 'TETO' | 'HYBRID';

export interface Question {
  id: number;
  text: string;
  options: {
    A: string; // Egen answer
    B: string; // Teto answer
  };
}

export interface ResultData {
  type: PersonalityType;
  title: string;
  description: string;
  emoji: string;
  colorClass: string;
  bgClass: string;
  barColor: string;
  traits: string[];
}

export interface AppState {
  screen: 'WELCOME' | 'QUIZ' | 'RESULT';
  currentQuestionIndex: number;
  answers: ('A' | 'B')[]; // A = Egen, B = Teto
}