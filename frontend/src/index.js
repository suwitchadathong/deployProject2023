import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import SimpleReactLightbox from 'simple-react-lightbox'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <SimpleReactLightbox>
    <App />
  </SimpleReactLightbox>
  // </React.StrictMode>
);

