// src/main.jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { NotificationProvider } from './context/NotificationContext';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    {/* The NotificationProvider must wrap the entire application */}
    {/* so that all components have access to the context. */}
    <NotificationProvider>
      <BrowserRouter future={{ v7_startTransition: true , v7_relativeSplatPath: true }}>
        <App />
      </BrowserRouter>
    </NotificationProvider>
  </React.StrictMode>
);
