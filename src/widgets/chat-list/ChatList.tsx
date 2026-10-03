import type { Chat } from '@/entities/chat/model/types';

import styles from './ChatList.module.scss';

type ChatListProps = {
  chats: Chat[];
  selectedChatId: string | null;
  onSelectChat: (chatId: string) => void;
};

export function ChatList({
  chats,
  selectedChatId,
  onSelectChat,
}: ChatListProps) {
  return (
    <div className={styles.list}>
      {chats.map((chat) => (
        <button
          className={styles.chatButton}
          key={chat.id}
          type="button"
          onClick={() => onSelectChat(chat.id)}
          aria-pressed={chat.id === selectedChatId}
        >
          {chat.title}
        </button>
      ))}
    </div>
  );
}