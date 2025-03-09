import React from 'react';
import ReactDOM from 'react-dom/client'; // For React 18 and later
import App from './App'; // Adjust the import if your main component is in a different file


// Get the root DOM element
const rootElement = document.getElementById('root');

// Create a root for the React DOM (for React 18+)
const root = ReactDOM.createRoot(rootElement);

// Render the App component inside the root
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
