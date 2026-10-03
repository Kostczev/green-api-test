import {
    useEffect,
    useRef,
    useState,
} from 'react';
import { greenApi } from '@/shared/api/greenApi';
import { splitMessage } from '@/shared/lib/splitMessage';
import type { GreenApiConnection } from '@/shared/api/types';
import type { Chat } from '@/entities/chat/model/types';
import type { Message } from '@/entities/message/model/types';

type UseChatParams = {
    chat: Chat;
    connection: GreenApiConnection;
};

export function useChat({
    chat,
    connection,
}: UseChatParams) {
    const [messages, setMessages] = useState<Message[]>([]);

    const [isLoadingHistory, setIsLoadingHistory] =
        useState(true);

    const [historyError, setHistoryError] =
        useState('');

    const [message, setMessage] = useState('');

    const [isSending, setIsSending] =
        useState(false);

    const [sendError, setSendError] =
        useState('');

    const messagesRef =
        useRef<HTMLDivElement>(null);

    // Автоматически прокручиваем чат вниз
    useEffect(() => {
        const element = messagesRef.current;

        if (element) {
            element.scrollTop = element.scrollHeight;
        }
    }, [messages]);

    // Загружаем историю при открытии / смене чата
    useEffect(() => {
        let isActive = true;

        const loadHistory = async () => {
            setIsLoadingHistory(true);
            setHistoryError('');
            setMessages([]);

            try {
                const history =
                    await greenApi.getChatHistory({
                        ...connection,
                        chatId: chat.chatId,
                    });

                if (!isActive) {
                    return;
                }

                const loadedMessages: Message[] =
                    history
                        .filter(
                            (item: any) =>
                                item.typeMessage === 'textMessage' &&
                                item.textMessage
                        )
                        .map((item: any) => ({
                            id: item.idMessage,
                            text: item.textMessage,
                            direction:
                                item.type === 'incoming'
                                    ? 'incoming'
                                    : 'outgoing',
                            createdAt: new Date(
                                item.timestamp * 1000
                            ),
                        }))
                        .reverse();

                setMessages(loadedMessages);
            } catch (error) {
                if (isActive) {
                    setHistoryError(
                        error instanceof Error
                            ? error.message
                            : 'Не удалось загрузить историю сообщений'
                    );
                }
            } finally {
                if (isActive) {
                    setIsLoadingHistory(false);
                }
            }
        };

        loadHistory();

        return () => {
            isActive = false;
        };
    }, [chat.chatId, connection]);

    // Получаем новые сообщения
    useEffect(() => {
        let isActive = true;

        const receive = async () => {
            while (isActive) {
                try {
                    const notification =
                        await greenApi.receiveNotification(
                            connection
                        );

                    if (!isActive) {
                        return;
                    }

                    if (!notification) {
                        continue;
                    }

                    const { body, receiptId } =
                        notification;

                    const chatId =
                        body.senderData?.chatId;

                    const text =
                        body.messageData
                            ?.textMessageData
                            ?.textMessage;

                    if (
                        body.typeWebhook ===
                        'incomingMessageReceived' &&
                        chatId === chat.chatId &&
                        text
                    ) {
                        setMessages((currentMessages) => {
                            const alreadyExists =
                                currentMessages.some(
                                    (item) =>
                                        item.id === body.idMessage
                                );

                            if (alreadyExists) {
                                return currentMessages;
                            }

                            return [
                                ...currentMessages,
                                {
                                    id: body.idMessage,
                                    text,
                                    direction: 'incoming',
                                    createdAt: new Date(
                                        body.timestamp * 1000
                                    ),
                                },
                            ];
                        });
                    }

                    await greenApi.deleteNotification({
                        ...connection,
                        receiptId,
                    });
                } catch (error) {
                    if (!isActive) {
                        return;
                    }

                    console.error(
                        'RECEIVE ERROR:',
                        error
                    );

                    await new Promise((resolve) => {
                        setTimeout(resolve, 1000);
                    });
                }
            }
        };

        receive();

        return () => {
            isActive = false;
        };
    }, [connection, chat.chatId]);

    const handleSubmit = async (
        event: Parameters<NonNullable<
            React.ComponentProps<'form'>['onSubmit']
        >>[0]
    ) => {
        event.preventDefault();

        const text = message.trim();

        if (!text || isSending) {
            return;
        }

        setSendError('');
        setIsSending(true);

        try {
            const chunks = splitMessage(text);

            for (const chunk of chunks) {
                const result =
                    await greenApi.sendMessage({
                        ...connection,
                        chatId: chat.chatId,
                        message: chunk,
                    });

                setMessages((currentMessages) => [
                    ...currentMessages,
                    {
                        id: result.idMessage,
                        text: chunk,
                        direction: 'outgoing',
                        createdAt: new Date(),
                    },
                ]);
            }

            setMessage('');
        } catch {
            setSendError(
                'Не удалось отправить сообщение'
            );
        } finally {
            setIsSending(false);
        }
    };

    return {
        messages,
        messagesRef,

        isLoadingHistory,
        historyError,

        message,
        setMessage,
        handleSubmit,

        isSending,
        sendError,
    };
}