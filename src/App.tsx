import { useStore } from './context/StoreContext';
import { LoginView } from './components/LoginView';
import { Dashboard } from './components/Dashboard';
import { Toast } from './components/Toast';

export default function App() {
  const { role } = useStore();

  return (
    <>
      {role ? <Dashboard /> : <LoginView />}
      <Toast />
    </>
  );
}
