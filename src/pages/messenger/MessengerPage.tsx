import { AppHeader } from '@/widgets/app-header/AppHeader';
import { ChatList } from '@/widgets/chat-list/ChatList';
import { Chat } from '@/widgets/chat/Chat';
import { CreateChatForm } from '@/features/create-chat/CreateChatForm';
import { useMessengerPage } from './model/useMessengerPage';
import type { GreenApiConnection } from '@/shared/api/types';
import styles from './MessengerPage.module.scss';

type MessengerPageProps = {
    connection: GreenApiConnection;
    onLogout: () => void;
};

export function MessengerPage({
    connection,
    onLogout,
}: MessengerPageProps) {
    const {
        chats,
        selectedChat,
        selectedChatId,
        addChat,
        selectChat,
    } = useMessengerPage({ connection });

    return (
        <main className={styles.page}>
            <AppHeader onLogout={onLogout} />

            <div className={styles.content}>
                <aside className={styles.sidebar}>
                    <CreateChatForm onCreateChat={addChat} />

                    <ChatList
                        chats={chats}
                        selectedChatId={selectedChatId}
                        onSelectChat={selectChat}
                    />
                </aside>

                <section className={styles.chat}>
                    {selectedChat ? (
                        <Chat
                            chat={selectedChat}
                            connection={connection}
                        />
                    ) : (
                        <div className={styles.selectchat}>Выберите чат</div>
                    )}
                </section>
            </div>
        </main>
    );
}