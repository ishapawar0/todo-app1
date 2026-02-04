import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Todos from './components/Todos';
import { useAuth } from './hooks/useAuth';

function App() {
  const { token } = useAuth();
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
        <Routes>
          <Route path="/login" element={!token ? <Login /> : <Navigate to="/todos" />} />
          <Route path="/register" element={!token ? <Register /> : <Navigate to="/todos" />} />
          <Route path="/todos" element={token ? <Todos /> : <Navigate to="/login" />} />
          <Route path="/" element={<Navigate to={token ? "/todos" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
