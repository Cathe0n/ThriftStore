import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';
import Home from "./pages/home/Home";
import Dashboard from "./pages/dashboard/Dashboard";
import LoginDashboard from "./pages/login-dashboard/LoginDashboard";
import Header from "./components/header/Header";
import HeaderLoggedIn from "./components/header/HeaderLoggedIn";
import DashboardHeader from "./components/header/DashboardHeader";  
import DashboardLoginHeader from "./components/header/DashboardLoginHeader";  
import Product from "./pages/product/Product";  
import ProductInformation from "./pages/productinformation/ProductInformation";
import PrivateRoute from "./PrivateRoute";

// Initialize Apollo Client with your correct endpoint
const client = new ApolloClient({
  uri: 'http://localhost:8080/public', // Updated to match your Postman endpoint
  cache: new InMemoryCache(),
});

// API Service with proper query formatting
export const getProductsByCategory = async (gender, category) => {
  const query = gql`
    query GetProductsByCategory($categoryType: String!) {
      getProductbyCategory(category_type: $categoryType) {
        id
        product_name
        price
        gender
        brand
        imagePath
      }
    }
  `;

  // Format matches your Postman test (e.g., "Women's Tops")
  const categoryType = `${gender}'s ${category}`;
  
  try {
    const { data } = await client.query({
      query,
      variables: { categoryType },
    });
    return data.getProductbyCategory;
  } catch (error) {
    console.error("GraphQL Error:", error);
    throw error;
  }
};

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
  
  return <Header />;
}

function App() {
  return (
    <ApolloProvider client={client}>
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
          <Route path="/productInformation/:id" element={<ProductInformation />} />
          <Route path="/loginadmin" element={<LoginDashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/loggedin"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </ApolloProvider>
  );
}

export default App;