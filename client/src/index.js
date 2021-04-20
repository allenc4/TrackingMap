import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import SideDrawer from './SideDrawer';
import registerServiceWorker from './registerServiceWorker';

import './css/styles.css';


 ReactDOM.render(
    <BrowserRouter>
        <SideDrawer/> 
    </BrowserRouter>,
    document.getElementById('root'));

registerServiceWorker();