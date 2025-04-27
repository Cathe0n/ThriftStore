import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Home from "./pages/home/Home";
import LoggedInHome from "./pages/home/LoggedInHome";
import Dashboard from "./pages/dashboard/Dashboard";
import LoginDashboard from "./pages/login-dashboard/LoginDashboard";
import Header from "./components/header/Header";
import HeaderLoggedIn from "./components/header/HeaderLoggedIn";
import DashboardHeader from "./components/header/DashboardHeader";  
import DashboardLoginHeader from "./components/header/DashboardLoginHeader";  
import Product from "./pages/product/Product";  

function AppHeader() {
  const location = useLocation();
  
  if (location.pathname === "/login-dashboard") {
    return <DashboardLoginHeader />;
  }
  
  if (location.pathname === "/dashboard") {
    return <DashboardHeader />;
  }

  if (location.pathname.startsWith("/loggedin")) {
    return <HeaderLoggedIn />;
  }
  
  // Default header for public user routes
  return <Header />;
}

function App() {
  return (
    <Router>
      <AppHeader />
      <Routes>
        <Route path="/" element={<Navigate to="/women" />} />
        <Route path="/women" element={<Home />} />
        <Route path="/men" element={<Home />} />
        <Route path="/kids" element={<Home />} />
        <Route path="/women/product" element={<Product />} />
        <Route path="/men/product" element={<Product />} />
        <Route path="/kids/product" element={<Product />} />
        <Route path="/loggedin" element={<LoggedInHome />} />
        

        <Route path="/login-dashboard" element={<LoginDashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;