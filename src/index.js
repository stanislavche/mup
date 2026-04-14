import React from 'react';
import ReactDOM from 'react-dom';
// CSS-only libs — imported here to bypass Sass compiler (no deprecation warnings)
import 'material-icons/iconfont/material-icons.css';
import 'react-input-range-ios-fix/lib/css/index.css';
import '@appigram/react-rangeslider/lib/index.css';
import './index.scss';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);