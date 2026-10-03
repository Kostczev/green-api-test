export type GreenApiConnection = {
  idInstance: string;
  apiTokenInstance: string;
};

export type CheckAccountParams = GreenApiConnection & {
  phoneNumber: string;
};

export type SendMessageParams = GreenApiConnection & {
  chatId: string;
  message: string;
};