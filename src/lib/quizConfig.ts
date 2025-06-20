export const QUIZ_CONFIG = {
  capitals: {
    isImageQuestion: false,
    isImageAnswers: false,
  },
  photos: {
    isImageQuestion: true,
    isImageAnswers: false,
  },
  map: {
    isImageQuestion: true,
    isImageAnswers: false,
  },
  flags: {
    isImageQuestion: false,
    isImageAnswers: true,
  },
} as const;
