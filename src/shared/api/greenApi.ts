import type {
  GreenApiConnection,
  CheckAccountParams,
  SendMessageParams,
} from './types';

const GREEN_API_BASE_URL = 'https://api.green-api.com';

export const greenApi = {
  async getStateInstance({
    idInstance,
    apiTokenInstance,
  }: GreenApiConnection) {
    const response = await fetch(
      `${GREEN_API_BASE_URL}/waInstance${idInstance}/getStateInstance/${apiTokenInstance}`
    );

    if (!response.ok) {
      throw new Error(`Green API error: ${response.status}`);
    }

    return response.json();
  },

  async checkAccount({
    idInstance,
    apiTokenInstance,
    phoneNumber,
  }: CheckAccountParams) {
    const response = await fetch(
      `${GREEN_API_BASE_URL}/waInstance${idInstance}/checkAccount/${apiTokenInstance}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: Number(phoneNumber),
          force: true,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Green API error: ${response.status}`);
    }

    return response.json();
  },

  async sendMessage({
    idInstance,
    apiTokenInstance,
    chatId,
    message,
  }: SendMessageParams) {
    const response = await fetch(
      `${GREEN_API_BASE_URL}/waInstance${idInstance}/sendMessage/${apiTokenInstance}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatId,
          message,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Green API error: ${response.status}`);
    }

    return response.json();
  },

  async getChatHistory({
    idInstance,
    apiTokenInstance,
    chatId,
  }: GreenApiConnection & { chatId: string }) {
    const response = await fetch(
      `${GREEN_API_BASE_URL}/waInstance${idInstance}/getChatHistory/${apiTokenInstance}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatId,
          count: 100,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Green API error: ${response.status}`);
    }

    return response.json();
  },

  async receiveNotification({
    idInstance,
    apiTokenInstance,
  }: GreenApiConnection) {
    const response = await fetch(
      `${GREEN_API_BASE_URL}/waInstance${idInstance}/receiveNotification/${apiTokenInstance}?receiveTimeout=60`
    );

    if (!response.ok) {
      throw new Error(`Green API error: ${response.status}`);
    }

    return response.json();
  },

  async deleteNotification({
    idInstance,
    apiTokenInstance,
    receiptId,
  }: GreenApiConnection & { receiptId: number }) {
    const response = await fetch(
      `${GREEN_API_BASE_URL}/waInstance${idInstance}/deleteNotification/${apiTokenInstance}/${receiptId}`,
      {
        method: 'DELETE',
      }
    );

    if (!response.ok) {
      throw new Error(`Green API error: ${response.status}`);
    }

    return response.json();
  },
};