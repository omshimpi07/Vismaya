import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Signup from './components/SignUp';
import Dashboard from './components/Dashboard';
import './App.css'
import VismayaLandingPage from './components/VismayaLandingPage';
import PharmacyFinder from './components/NearByPharmacy'
import PeriodPredictor from './components/PeriodPredictor'
import Fitness from './components/Fitness';
import NutritionFinder from './components/NutritionFinder';
import WomensBMICalculator from './components/WomensBMICalculator'
import FakeCallSafety from './components/FakeCallSafety'
import NearbyPoliceStations from './components/NearbyPoliceStations'
import HealthTipsCarousel from './components/HealthTipsCarousel';
import Services from './components/HealthServices';
import SafetyServices from './components/SafetyServices';
import Chat from './components/Chat';
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">

        <Routes>
          <Route path="/" element={<VismayaLandingPage/>}/>
          <Route path="/login" element={<Login />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/bmi" element={<WomensBMICalculator/>}/>
          <Route path="/Safety" element={<SafetyServices/>}/>
          <Route path="/Health" element={<Services/>}/>
          <Route path="/nutrition-finder" element={<NutritionFinder/>}/>
          <Route path="/fake-call" element={<FakeCallSafety/>}/>
          <Route path="/fitness" element={<Fitness/>}/>
          <Route path="/pharmacy-finder" element={<PharmacyFinder/>}/>
          <Route path="/period-predictor" element={<PeriodPredictor/>}/>
          <Route path="/nearby-police station" element={<NearbyPoliceStations/>}/>
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
