import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./Components/Header/Header";
import Content from "./Components/Content/Content";
import Footer from "./Components/Footer/Footer";
import ProtectedRoute from "./Components/Auth/ProtectedRoute";
// import Citizen from "./Components/Header/Navbar-2/Citizen";
import CitizenPortal from "./Components/CitizenPortal/CitizenPortal";
import University from "./Components/University/University";
import Industry from "./Components/industry & CSR/Industry";
import GovtAdmin from "./Components/Govt Analytics/Govt";

const App = () => {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Content />} />
        <Route
          path="/CitizenPortal"
          element={
            <ProtectedRoute role="citizen">
              <CitizenPortal />
            </ProtectedRoute>
          }
        />
        <Route
          path="/University"
          element={
            <ProtectedRoute role="university">
              <University />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Industry"
          element={
            <ProtectedRoute role="industry">
              <Industry />
            </ProtectedRoute>
          }
        />
        <Route
          path="/GovtAdmin"
          element={
            <ProtectedRoute role="government">
              <GovtAdmin />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
