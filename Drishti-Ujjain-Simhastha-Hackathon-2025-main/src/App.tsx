import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginScreen from './components/LoginScreen';
import Dashboard from './components/Dashboard';
import { AppProvider } from './contexts/AppContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ToastNotifications from './components/ToastNotifications';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
  <ThemeProvider>
  <AppProvider>
      <Router>
        <div className="min-h-screen bg-slate-950">
          <ToastNotifications />
          <Routes>
            <Route 
              path="/login" 
              element={
                isAuthenticated ? 
                <Navigate to="/dashboard" replace /> : 
                <LoginScreen onLogin={() => setIsAuthenticated(true)} />
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                isAuthenticated ? 
                <Dashboard /> : 
                <Navigate to="/login" replace />
              } 
            />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </AppProvider>
    </ThemeProvider>
  );
}

export default App;
