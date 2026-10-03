import type { Chat as ChatEntity } from '@/entities/chat/model/types';
import type { GreenApiConnection } from '@/shared/api/types';
import { useChat } from './model/useChat';
import styles from './Chat.module.scss';

type ChatProps = {
    chat: ChatEntity;
    connection: GreenApiConnection;
};

export function Chat({
    chat,
    connection,
}: ChatProps) {
    const {
        messages,
        messagesRef,
        isLoadingHistory,
        historyError,
        message,
        setMessage,
        handleSubmit,
        isSending,
        sendError,
    } = useChat({
        chat,
        connection,
    });

    return (
        <div className={styles.chat}>
            <header className={styles.header}>
                <h2 className={styles.title}>
                    {chat.title}
                </h2>

                <p className={styles.phone}>
                    {chat.phoneNumber}
                </p>
            </header>

            <div className={styles.messages} ref={messagesRef}>
                {isLoadingHistory && (
                    <p>Загрузка сообщений...</p>
                )}

                {historyError && (
                    <p className="error">
                        {historyError}
                    </p>
                )}

                {!isLoadingHistory &&
                    !historyError &&
                    messages.length === 0 && (
                        <p>Сообщений пока нет</p>
                    )}

                {messages.map((message) => (
                    <div
                        className={`${styles.message} ${message.direction === 'outgoing'
                                ? styles.outgoing
                                : styles.incoming
                            }`}
                        key={message.id}
                    >
                        {message.text}
                    </div>
                ))}
            </div>

            <form
                className={styles.form}
                onSubmit={handleSubmit}
            >
                <textarea
                    className={styles.input}
                    value={message}
                    onChange={(event) =>
                        setMessage(event.target.value)
                    }
                    placeholder="Сообщение"
                    rows={1}
                    disabled={isSending}
                />

                <button
                    className='button'
                    type="submit"
                    disabled={isSending}
                >
                    {isSending ? 'Отправка...' : 'Отправить'}
                </button>
            </form>

            {sendError && (
                <p className="error">{sendError}</p>
            )}
        </div>
    );
}