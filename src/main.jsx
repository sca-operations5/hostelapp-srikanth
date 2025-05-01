
    import React from 'react';
    import ReactDOM from 'react-dom/client';
    import App from '@/App';
    import '@/index.css';

    const rootElement = document.getElementById('root');

    if (!rootElement) {
      console.error("Fatal Error: Root element with ID 'root' was not found. Check index.html.");
      throw new Error("Root element not found");
    }

    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  