import { Layout } from './layout/Layout';
import { OrderPage } from './features/order/OrderPage';
import { AuthProvider } from './context/AuthContext';
import { AuthGate } from './components/AuthGate';

function App() {
  return (
    <AuthProvider>
      <AuthGate>
        <Layout>
          <OrderPage />
        </Layout>
      </AuthGate>
    </AuthProvider>
  );
}

export default App;
