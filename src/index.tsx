/* @refresh reload */
import './index.css';
import { render } from 'solid-js/web';
import { Router, Routes, Route } from '@solidjs/router';

import App from './app';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TabelPengguna from './pages/TabelPengguna';
import Admin from './pages/Admin';
import Absensi from './pages/Absensi';



const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
  );
}

render(
  () => (
    <Router>
      <Routes>
        <Route path='/' component={App}/>
        <Route path='/Register' component={Register}/>
        <Route path='/Login' component={Login}/>
        <Route path='/Dashboard' component={Dashboard}/>
        <Route path='/TabelPengguna' component={TabelPengguna}/>
        <Route path='/Admin' component={Admin}/>
        <Route path='/Absensi' component={Absensi}/>
      
       
      </Routes>
    </Router>
  ),
  root,
);
