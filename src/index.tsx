import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {
  HashRouter as Router,
  Route,
  Routes
} from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import Login from './page/login';
import Register from './page/register';
import Home from './page/home';

// Create a React root to render the app into the root element
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// Render the main application structure
root.render(
  <div className='page'>
    <React.StrictMode>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </React.StrictMode>
  </div>
);


reportWebVitals();
