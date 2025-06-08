
export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai' | 'error';
  timestamp: Date;
}

export type Theme = 'light' | 'dark';
