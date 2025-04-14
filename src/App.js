import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Home from "./pages/home/Home";
import LoggedInHome from "./pages/home/LoggedInHome";
import Header from "./components/header/Header";
import HeaderLoggedIn from "./components/header/HeaderLoggedIn";

function AppHeader() {
  const location = useLocation();
  return location.pathname.startsWith("/loggedin") ? <HeaderLoggedIn /> : <Header />;
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
        <Route path="/loggedin" element={<LoggedInHome />} />
        {/* Removed: <Route path="/login" element={<Login />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
