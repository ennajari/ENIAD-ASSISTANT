import React from 'react';
import ReactDOM from 'react-dom/client';
import AppWithErrorBoundary from './App';
import { LanguageProvider } from './contexts/LanguageContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <LanguageProvider>
    <AppWithErrorBoundary />
  </LanguageProvider>
);