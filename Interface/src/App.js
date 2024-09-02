// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/navBar';
import HomePage from './components/HomePage';
import ServicesPage from './components/ServicesPage';
import ProjetsPage from './components/ProjetsPage';
import ContactPage from './components/ContactPage';
import ZoneUrbaineDetails from './components/ZoneUrbaineDetails';
import UserManagementPage from './components/UserManagementPage'

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/projets" element={<ProjetsPage />} />

        <Route path="/zones-urbaines" element={<ZoneUrbaineDetails />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/users" element={<UserManagementPage/>} />
         {/* Définissez la route pour /zones-urbaines */}
      </Routes>
    </Router>
  );
}

export default App;
