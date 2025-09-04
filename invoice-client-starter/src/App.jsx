import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  BrowserRouter as Router,
  Link,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";

import PersonIndex from "./persons/PersonIndex";
import PersonDetail from "./persons/PersonDetail";
import PersonForm from "./persons/PersonForm";
import InvoiceIndex from "./invoices/InvoiceIndex";
import InvoiceForm from "./invoices/InvoiceForm";
import InvoiceDetail from "./invoices/InvoiceDetail";
import './index.css';

const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <ul className="navbar-nav mr-auto">
        <li className="nav-item">
          <Link
            to={"/persons"}
            className={`nav-link ${location.pathname.startsWith("/persons") ? "active-nav-link" : ""}`}
          >
            Osoby
          </Link>
        </li>
        <li className="nav-item">
          <Link
            to={"/invoices"}
            className={`nav-link ${location.pathname.startsWith("/invoices") ? "active-nav-link" : ""}`}
          >
            Faktury
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export function App() {
  return (
    <Router>
      <div className="container">
        <Navigation />

        <Routes>
          <Route index element={<Navigate to={"/persons"} />} />
          <Route path="/persons">
            <Route index element={<PersonIndex />} />
            <Route path="show/:id" element={<PersonDetail />} />
            <Route path="new" element={<PersonForm />} /> {/* OPRAVENO: Přidána správná cesta pro formulář */}
            <Route path="edit/:id" element={<PersonForm />} />
          </Route>
          
          <Route path="/invoices">
            <Route index element={<InvoiceIndex />} />
            <Route path="show/:id" element={<InvoiceDetail />} />
            <Route path="new" element={<InvoiceForm />} />
            <Route path="edit/:id" element={<InvoiceForm />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;