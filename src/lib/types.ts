// lib/types.ts
export type QuestionType = {
  id: string;
  question?: string;
  image?: string;
  options: string[];
  correct: string;
};

export type QuizType = {
  [key: string]: QuestionType[];
};