import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // 1. Import BrowserRouter
import App from './App.jsx';
import './index.css';
import { NotificationProvider } from './context/NotificationContext.jsx'; // Make sure path is correct
import ErrorBoundary from './components/ErrorBoundary.jsx'; // Make sure path is correct

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 2. Wrap your entire App with BrowserRouter */}
    <BrowserRouter>
      <ErrorBoundary>
        <NotificationProvider>
          <App />
        </NotificationProvider>
      </ErrorBoundary>
    </BrowserRouter>
  </React.StrictMode>
);
