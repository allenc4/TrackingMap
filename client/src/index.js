import React from 'react';
import ReactDOM from 'react-dom';
import './css/styles.css';
import SimpleMap from './SimpleMap';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <div>
    <SimpleMap />
  </div>,
  document.getElementById('root')
);

registerServiceWorker();