import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import AppWithErrorBoundary from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <LanguageProvider>
        <AuthProvider>
          <AppWithErrorBoundary />
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>
);