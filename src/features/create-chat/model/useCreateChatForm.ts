import { useState } from 'react';
import type { SubmitEvent } from 'react';
import {
  getActiveFormattingMask,
  usePhoneInput,
} from 'react-international-phone';

export type CreateChatResult = 'created' | 'existing';

type UseCreateChatFormParams = {
  onCreateChat: (phoneNumber: string) => Promise<CreateChatResult>;
};

export function useCreateChatForm({
  onCreateChat,
}: UseCreateChatFormParams) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isPhoneComplete, setIsPhoneComplete] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    inputValue,
    handlePhoneValueChange,
    country,
  } = usePhoneInput({
    defaultCountry: 'ru',
    value: phoneNumber,
    onChange: ({ phone }) => {
      const mask = getActiveFormattingMask({
        phone,
        country,
      });

      const phoneDigits = phone.replace(/\D/g, '');
      const countryCode = country.dialCode.replace(/\D/g, '');

      const nationalNumber = phoneDigits.startsWith(countryCode)
        ? phoneDigits.slice(countryCode.length)
        : phoneDigits;

      const requiredDigits = (mask.match(/\./g) ?? []).length;

      setPhoneNumber(phone);
      setError('');

      setIsPhoneComplete(
        requiredDigits > 0 &&
          nationalNumber.length === requiredDigits
      );
    },
  });

  const handleSubmit = async (
    event: SubmitEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!isPhoneComplete) {
      setError('Введите полный номер телефона');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const result = await onCreateChat(phoneNumber);

      if (result === 'existing') {
        setError('Такой чат уже создан');
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Не удалось создать чат'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    inputValue,
    handlePhoneValueChange,
    handleSubmit,
    error,
    isLoading,
  };
}