// src/App.js
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { ApolloProvider } from '@apollo/client';
import client from './apollo/client';
import { AuthProvider } from './context/AuthContext';
import Home from "./pages/home/Home";
import Dashboard from "./pages/dashboard/Dashboard";
import LoginDashboard from "./pages/login-dashboard/LoginDashboard";
import Header from "./components/header/Header";
import DashboardHeader from "./components/header/DashboardHeader";
import DashboardLoginHeader from "./components/header/DashboardLoginHeader";
import Product from "./pages/product/Product";
import ProductInformation from "./pages/productinformation/ProductInformation";
import { AdminLoginPage } from "./pages/Adminlogin-admin/AdminLoginPage";
import AdminPage from './pages/Adminpage/Adminpage.js';
import PrivateRoute from "./PrivateRoute";
import ShoppingBag from "./pages/shoppingbag/ShoppingBag.js"; 
import Wishlist from "./pages/wishlist/Wishlist";

function AppHeader() {
  const location = useLocation();
  const noHeaderPaths = ["/adminloginpage", "/adminpage"];

  if (noHeaderPaths.includes(location.pathname)) return null;
  if (location.pathname === "/login-dashboard") return <DashboardLoginHeader />;
  if (location.pathname === "/dashboard") return <DashboardHeader />;
  return <Header />;
}

function App() {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <Router>
          <AppHeader />
          <Routes>
            <Route path="/" element={<Navigate to="/women" />} />
            <Route path="/women" element={<Home />} />
            <Route path="/men" element={<Home />} />
            <Route path="/kids" element={<Home />} />
            <Route path="/product" element={<Product />} />
            <Route path="/women/product" element={<Product />} />
            <Route path="/men/product" element={<Product />} />
            <Route path="/kids/product" element={<Product />} />
            <Route path="/productInformation/:id" element={<ProductInformation />} />
            <Route path="/loginadmin" element={<LoginDashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/adminloginpage" element={<AdminLoginPage />} />
            <Route path="/adminpage" element={<AdminPage />} />
            <Route path="/bag" element={<ShoppingBag />} />
            <Route path="/wishlist" element={<Wishlist />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;