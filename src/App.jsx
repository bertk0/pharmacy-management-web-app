// import Icons
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'remixicon/fonts/remixicon.css';

// import Bootstrap 
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';

import './App.css'
import Header from './components/Header/Header';
import SideBar from './components/SideBar/SideBar';
import Main from './components/Main/Main';
import Footer from './components/Footer/Footer';
import BackToTop from './components/BackToTop/BackToTop';

import { Routes, Route } from 'react-router-dom';

import Dashboard from './components/Dashboard/Dashboard';
import MedicinePage from './pages/medicine';
import DoctorPage from './pages/doctor';
import PatientPage from './pages/patient';
import SupplierPage from './pages/supplier';
import SalePage from './pages/sale';
import CreateSalePage from './pages/createSale';
import ForecastMedicinePage from './pages/forecastMedicine';
import EditSalePage from './pages/editSale';
import CreatePurchasePage from './pages/createPurchase';
import PurchasePage from './pages/purchase';
import EditPurchasePage from './pages/editPurchase';




function App() {

  return (
    <>
      <Header />
      <SideBar />
      <Routes>
        <Route path="/" element={<Main />}>
          {/* Define child routes yang akan ditampilkan di dalam Main */}
          <Route path="/" element={<Dashboard />} />
          <Route path="medicine" element={<MedicinePage />} />
          <Route path="patient" element={<PatientPage />} />
          <Route path="doctor" element={<DoctorPage />} />
          <Route path="supplier" element={<SupplierPage />} />
          <Route path="sale" element={<SalePage />} />
          <Route path="sale/create" element={<CreateSalePage />} />
          <Route path="sale/edit/:id" element={<EditSalePage />} />
          <Route path="purchase" element={<PurchasePage/>} />
          <Route path="purchase/create" element={<CreatePurchasePage />}/>
          <Route path="purchase/edit/:id" element={<EditPurchasePage/>} />


          <Route path="forecast_medicine" element={<ForecastMedicinePage />}/>
        </Route>
      </Routes>
      <Footer />
      <BackToTop />
    </>
  )
}

export default App
