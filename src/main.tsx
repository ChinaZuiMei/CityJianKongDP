import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { Buffer } from 'buffer';
import process from 'process';
import App from './App.tsx';
import './index.css';

// Polyfills for Node.js globals in the browser
window.Buffer = Buffer;
window.process = process;
if (!window.process.nextTick) {
  window.process.nextTick = (fn: any, ...args: any[]) => setTimeout(() => fn(...args), 0);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
