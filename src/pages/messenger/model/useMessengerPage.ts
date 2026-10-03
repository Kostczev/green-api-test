import { useEffect, useState } from 'react';
import { greenApi } from '@/shared/api/greenApi';
import type { GreenApiConnection } from '@/shared/api/types';
import type { Chat } from '@/entities/chat/model/types';

const STORAGE_KEY = 'green-messenger-chats';

type UseMessengerPageParams = {
    connection: GreenApiConnection;
};

export function useMessengerPage({
    connection,
}: UseMessengerPageParams) {
    const [chats, setChats] = useState<Chat[]>(() => {
        const savedChats = localStorage.getItem(STORAGE_KEY);

        if (!savedChats) {
            return [];
        }

        try {
            return JSON.parse(savedChats);
        } catch {
            return [];
        }
    });

    const [selectedChatId, setSelectedChatId] = useState<string | null>(
        () => chats[0]?.id ?? null
    );

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
    }, [chats]);

    const addChat = async (
        phoneNumber: string
    ): Promise<'created' | 'existing'> => {
        const normalizedPhone = phoneNumber.replace(/\D/g, '');

        const existingChat = chats.find(
            (chat) =>
                chat.phoneNumber.replace(/\D/g, '') === normalizedPhone
        );

        if (existingChat) {
            setSelectedChatId(existingChat.id);
            return 'existing';
        }

        const result = await greenApi.checkAccount({
            ...connection,
            phoneNumber: normalizedPhone,
        });

        if (!result.exist) {
            throw new Error('Пользователь Telegram не найден');
        }

        const newChat: Chat = {
            id: crypto.randomUUID(),
            title: result.username || phoneNumber,
            phoneNumber,
            chatId: result.chatId,
        };

        setChats((currentChats) => [
            ...currentChats,
            newChat,
        ]);

        setSelectedChatId(newChat.id);

        return 'created';
    };

    const selectedChat =
        chats.find((chat) => chat.id === selectedChatId) ?? null;

    return {
        chats,
        selectedChat,
        selectedChatId,
        addChat,
        selectChat: setSelectedChatId,
    };
}