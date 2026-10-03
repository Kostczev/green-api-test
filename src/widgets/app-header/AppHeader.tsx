import styles from './AppHeader.module.scss';

type AppHeaderProps = {
  onLogout: () => void;
};

export function AppHeader({ onLogout }: AppHeaderProps) {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Green Messenger</h1>

      <button className='button' type="button" onClick={onLogout}>
        Выйти
      </button>
    </header>
  );
}