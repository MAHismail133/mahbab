
export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface UserInfo {
  name: string;
  age: string;
}

export enum AppState {
  LANDING = 'LANDING',
  REGISTRATION = 'REGISTRATION',
  QUIZ = 'QUIZ',
  RESULT = 'RESULT'
}
