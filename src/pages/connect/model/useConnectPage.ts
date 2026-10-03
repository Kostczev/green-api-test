import { useState } from 'react';
import type { SyntheticEvent } from 'react';
import { greenApi } from '@/shared/api/greenApi';
import type { GreenApiConnection } from '@/shared/api/types';

type UseConnectPageParams = {
  onConnected: (connection: GreenApiConnection) => void;
};

export function useConnectPage({
  onConnected,
}: UseConnectPageParams) {
  const [idInstance, setIdInstance] = useState('');
  const [apiTokenInstance, setApiTokenInstance] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();

    setError('');
    setSuccess('');

    if (!idInstance.trim() || !apiTokenInstance.trim()) {
      setError('Поля не могут быть пустыми');
      return;
    }

    setIsLoading(true);

    try {
      const result = await greenApi.getStateInstance({
        idInstance: idInstance.trim(),
        apiTokenInstance: apiTokenInstance.trim(),
      });

      if (result.stateInstance === 'authorized') {
        onConnected({
          idInstance: idInstance.trim(),
          apiTokenInstance: apiTokenInstance.trim(),
        });
        return;
      }

      if (result.stateInstance === 'notAuthorized') {
        setError('Инстанс не авторизован в Telegram');
        return;
      }

      setError(`Инстанс имеет статус: ${result.stateInstance}`);
    } catch {
      setError('Кажется, данные неверные');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    idInstance,
    apiTokenInstance,
    setIdInstance,
    setApiTokenInstance,
    error,
    success,
    isLoading,
    handleSubmit,
  };
}