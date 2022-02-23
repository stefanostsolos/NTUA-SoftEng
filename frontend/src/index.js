/* An index. js file allow you to import (or require() ) its parent folder as a module. This behavior is copied from Node. js, which has covers this in its documentation under Folders as Modules */ 
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);