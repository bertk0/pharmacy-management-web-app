import './main.css';
import PageTitle from '../PageTitle/PageTitle';
import { Outlet, useLocation } from "react-router-dom";


const Main = () => {

  const location = useLocation(); // Dapatkan informasi lokasi path saat ini

  // Fungsi untuk mendapatkan nama halaman berdasarkan path
  const getPageTitle = () => {
    switch (true) {
      case location.pathname.startsWith('/medicine'):
        return 'Medicine';
      case location.pathname.startsWith('/patient'):
        return 'Patient';
      case location.pathname.startsWith('/doctor'):
        return 'Doctor';
      case location.pathname.startsWith('/supplier'):
        return 'Supplier';
      case location.pathname.startsWith('/sale'):
        return 'Sale';
      case location.pathname.startsWith('/sale/create'):
        return 'Sale';
      case location.pathname.startsWith('/sale/edit'):
        return 'Sale';
      case location.pathname.startsWith('/purchase'):
        return 'Purchase';
      case location.pathname.startsWith('/purchase/create'):
        return 'Purchase';
      case location.pathname.startsWith('/purchase/edit'):
        return 'Purchase';
      case location.pathname.startsWith('/forecast_medicine'):
        return 'Forecast Medicine';
      default:
        return 'Dashboard'; // Default untuk route /
    }
  };

  const getBreadcrumb = () => {
    if (location.pathname.startsWith('/sale/create')) {
      return 'Sale / Create'; 
    }
    if (location.pathname.startsWith('/sale/edit')) {
      return 'Sale / Edit'; 
    }
    if (location.pathname.startsWith('/purchase/create')) {
      return 'Purchase / Create'; 
    }
    if (location.pathname.startsWith('/purchase/edit')) {
      return 'Purchase / Edit'; 
    }
    return getPageTitle();
  };


  return (
    <main id="main" className="main">
      <PageTitle pagetitle={getPageTitle()} breadcrumb={getBreadcrumb()}></PageTitle>
      <Outlet />
    </main>
  );
}

export default Main;
