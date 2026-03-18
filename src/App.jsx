// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';

import StatePage from './features/masters/state/StatePage';
/*
import CountryMaster from './features/masters/countryMaster';
import CityMaster from './features/masters/CityMaster';
import DepartmentMaster from './features/masters/DepartmentMaster';  
import DesignationMaster from './features/masters/DesignationMaster'; 
import DivisionMaster from './features/masters/DivisionMaster'; 
import EmployeeGradeMaster from './features/masters/EmployeeGradeMaster';

*/


const App = () => {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
   
           <Route path="/masters/state" element={<StatePage />} />
         

           
       
          {/* Add more */}
        </Routes>
      </MainLayout>
    </Router>
  );
};

export default App;