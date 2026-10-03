export type Message = {
  id: string;
  text: string;
  direction: 'incoming' | 'outgoing';
  createdAt: Date;
};