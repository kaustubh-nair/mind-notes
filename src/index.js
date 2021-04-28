import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Book from './Book.js';
import reportWebVitals from './reportWebVitals';


ReactDOM.render(
  <React.StrictMode>
    <Book />
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals(console.log);
