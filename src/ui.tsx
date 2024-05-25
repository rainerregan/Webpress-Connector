import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

document.addEventListener('DOMContentLoaded', function () {
  let root = ReactDOM.createRoot(document.getElementById('root') as HTMLDivElement);
  console.log(document);

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
});