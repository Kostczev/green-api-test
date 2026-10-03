import { useCreateChatForm } from './model/useCreateChatForm';
import styles from './CreateChatForm.module.scss';

type CreateChatFormProps = {
  onCreateChat: (
    phoneNumber: string
  ) => Promise<'created' | 'existing'>;
};

export function CreateChatForm({
  onCreateChat,
}: CreateChatFormProps) {
  const {
    inputValue,
    handlePhoneValueChange,
    handleSubmit,
    error,
    isLoading,
  } = useCreateChatForm({ onCreateChat });

  return (
    <div className={styles.wrapper}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          className="input"
          type="tel"
          value={inputValue}
          onChange={handlePhoneValueChange}
          placeholder="Номер телефона"
          disabled={isLoading}
        />

        <button
          className="button"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Проверка...' : 'Создать'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}
    </div>
  );
}