export function useAppHeader(onLogout: () => void) {
  const handleLogout = () => {
    onLogout();
  };

  return {
    handleLogout,
  };
}