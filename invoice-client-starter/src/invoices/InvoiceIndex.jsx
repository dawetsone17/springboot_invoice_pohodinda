import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const InvoiceIndex = () => {
  const [invoices, setInvoices] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    product: "",
  });

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams(filters).toString();
      const url = query ? `http://localhost:8080/api/invoices?${query}` : `http://localhost:8080/api/invoices`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Nepodařilo se načíst faktury.');
      }
      
      const data = await response.json();
      setInvoices(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/invoices/statistics`);
      
      if (!response.ok) {
        throw new Error('Nepodařilo se načíst statistiky.');
      }
      
      const data = await response.json();
      setStatistics(data);
    } catch (err) {
      setError(err.message); // Nastavení chyby i pro statistiky
    }
  };

  useEffect(() => {
    fetchInvoices();
    fetchStatistics();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };
  
  const deleteInvoice = async (invoiceId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/invoices/${invoiceId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Nepodařilo se smazat fakturu.');
      }
      
      // Aktualizace seznamu faktur po smazání
      fetchInvoices();
      fetchStatistics();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div>Načítání...</div>;
  }

  if (error) {
    return <div>Chyba: {error}</div>;
  }

  return (
    <div>
      <h1>Seznam faktur</h1>
      <hr />
      <h3>Statistiky</h3>
      <p>
        Celkový součet faktur: {statistics.allTimeSum} Kč
      </p>
      <p>
        Součet faktur za letošní rok: {statistics.currentYearSum} Kč
      </p>
      <p>
        Celkový počet faktur: {statistics.invoicesCount}
      </p>
      
      <hr />
      <h3>Filtrování</h3>
      <div className="filter-form">
        <label>
          Minimální cena:
          <input
            type="number"
            name="minPrice"
            value={filters.minPrice}
            onChange={handleFilterChange}
          />
        </label>
        <label>
          Maximální cena:
          <input
            type="number"
            name="maxPrice"
            value={filters.maxPrice}
            onChange={handleFilterChange}
          />
        </label>
        <label>
          Název produktu:
          <input
            type="text"
            name="product"
            value={filters.product}
            onChange={handleFilterChange}
          />
        </label>
      </div>

      <hr />
      <div className="mb-3">
        <Link to="/invoices/new" className="btn btn-primary">Vytvořit novou fakturu</Link>
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Číslo faktury</th>
            <th>Vystaveno</th>
            <th>Splatnost</th>
            <th>Cena (Kč)</th>
            <th>Akce</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice.id}>
              <td>{invoice.id}</td>
              <td>{invoice.invoiceNumber}</td>
              <td>{new Date(invoice.issued).toLocaleDateString()}</td>
              <td>{new Date(invoice.dueDate).toLocaleDateString()}</td>
              <td>{invoice.price}</td>
              <td>
                <Link to={`/invoices/show/${invoice.id}`} className="btn btn-sm btn-info">Zobrazit</Link>
                <Link to={`/invoices/edit/${invoice.id}`} className="btn btn-sm btn-warning ms-2">Upravit</Link>
                <button onClick={() => deleteInvoice(invoice.id)} className="btn btn-sm btn-danger ms-2">Smazat</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvoiceIndex;