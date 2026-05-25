import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/index.css';
import { HashRouter as Router } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import './styles/darkmode.css';

// main.jsx
const saved = localStorage.getItem('theme');
if (saved !== 'light') document.body.classList.add('dark');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <Router>
        <App />
      </Router>
    </ThemeProvider>
  </React.StrictMode>
);
