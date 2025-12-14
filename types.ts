export interface Book {
  name: string;
}

export interface DevotionalState {
  book: string;
  chapter: number;
  verse: number;
  isLoading: boolean;
  generatedText: string | null;
  audioUrl: string | null;
  error: string | null;
}

export enum LoadingStage {
  IDLE = 'IDLE',
  GENERATING_TEXT = 'GENERATING_TEXT',
  GENERATING_AUDIO = 'GENERATING_AUDIO',
  COMPLETED = 'COMPLETED',
}
