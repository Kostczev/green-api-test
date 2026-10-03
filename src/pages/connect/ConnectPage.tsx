import { useConnectPage } from './model/useConnectPage';
import styles from './ConnectPage.module.scss';
import type { GreenApiConnection } from '@/shared/api/types';

type ConnectPageProps = {
    onConnected: (connection: GreenApiConnection) => void;
};

export function ConnectPage({ onConnected }: ConnectPageProps) {
    const {
        idInstance,
        apiTokenInstance,
        setIdInstance,
        setApiTokenInstance,
        error,
        success,
        isLoading,
        handleSubmit,
    } = useConnectPage({ onConnected });

    return (
        <main className={styles.page}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <h1 className={styles.title}>Подключение</h1>

                <input
                    className="input"
                    type="text"
                    value={idInstance}
                    onChange={(event) => setIdInstance(event.target.value)}
                    placeholder="ID Instance"
                />

                <input
                    className="input"
                    type="password"
                    value={apiTokenInstance}
                    onChange={(event) => setApiTokenInstance(event.target.value)}
                    placeholder="API Token Instance"
                />

                {error && <p className="error">{error}</p>}

                {success && <p className="success">{success}</p>}

                <button className="button" type="submit" disabled={isLoading}>
                    {isLoading ? 'Подключение...' : 'Подключиться'}
                </button>
            </form>
        </main>
    );
}