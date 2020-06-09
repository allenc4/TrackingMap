import React from 'react';
import ReactDOM from 'react-dom';
import SideDrawer from './SideDrawer';
import registerServiceWorker from './registerServiceWorker';

import './css/styles.css';


 ReactDOM.render(<SideDrawer/>, document.getElementById('root'));

registerServiceWorker();