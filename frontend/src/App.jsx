import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom'; 
// components
import Navbar from './components/Navbar/Navbar';
import Home from './components/Home/Home';
import UserLogin from './components/UserLogin';
import UserRegister from './components/UserRegister';
import UserDashboard from './pages/UserDashboard';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

const App = () => {

  const currentTheme = localStorage.getItem('currentTheme');
  const [theme, setTheme] = useState(currentTheme ? currentTheme : 'light');

  useEffect(() => {
    localStorage.setItem('currentTheme', theme);
  }, [theme]);

  return (
    <div className={`container ${theme}`}>
      <Navbar theme={theme} setTheme={setTheme} />
      <Routes>
        <Route path='/' element={<Home theme={theme}/>} />
        <Route path='/login/user' element={<UserLogin theme={theme} />} />
        <Route path='/register/user' element={<UserRegister theme={theme} />} />
        <Route path="/user-dashboard" element={<UserDashboard theme={theme}/>} />
        <Route path='/login/admin' element={<AdminLogin theme={theme} />} />
        <Route path="/admin-dashboard" element={<AdminDashboard theme={theme}/>} />
      </Routes>
    </div>
  );
}

export default App;
