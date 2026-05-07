import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { DesignProvider } from './context/DesignContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <DesignProvider>
        <App />
      </DesignProvider>
    </BrowserRouter>
  </StrictMode>,
);
