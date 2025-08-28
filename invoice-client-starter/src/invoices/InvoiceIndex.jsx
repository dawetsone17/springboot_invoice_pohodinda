import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import '../index.css';
import { apiGet, apiDelete } from '../utils/api';

const InvoiceIndex = () => {
    const [invoices, setInvoices] = useState([]);
    const [statistics, setStatistics] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [persons, setPersons] = useState([]);
    const [products, setProducts] = useState([]); // Nový stav pro seznam produktů

    const [filters, setFilters] = useState({
        minPrice: "",
        maxPrice: "",
        product: "",
        buyerIdentificationNumber: "",
        sellerIdentificationNumber: "",
    });

    const [debouncedFilters, setDebouncedFilters] = useState(filters);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedFilters(filters);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [filters]);

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                setLoading(true);
                const query = new URLSearchParams(debouncedFilters).toString();
                const url = `/api/invoices?${query}`;
                
                console.log("Fetching invoices from URL:", url);
                const data = await apiGet(url);
                console.log("Invoices fetched successfully:", data);
                
                setInvoices(data);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch invoices:", err);
                setError('Nepodařilo se načíst faktury.');
            } finally {
                setLoading(false);
            }
        };

        const fetchStatistics = async () => {
            try {
                const url = '/api/invoices/statistics';
                console.log("Fetching statistics from URL:", url);
                const data = await apiGet(url);
                console.log("Statistics fetched successfully:", data);
                setStatistics(data);
            } catch (err) {
                console.error("Failed to fetch statistics:", err);
                setError('Nepodařilo se načíst statistiky.');
            }
        };

        const fetchPersons = async () => {
            try {
                const personsData = await apiGet("/api/persons");
                setPersons(personsData);
            } catch (err) {
                console.error("Failed to fetch persons:", err);
            }
        };

        // Nová funkce pro načítání jedinečných produktů
        const fetchProducts = async () => {
            try {
                const productsData = await apiGet("/api/invoices/products");
                setProducts(productsData);
            } catch (err) {
                console.error("Failed to fetch products:", err);
            }
        };
        
        fetchPersons();
        fetchInvoices();
        fetchStatistics();
        fetchProducts();

    }, [debouncedFilters]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));
    };
    
    // Upraveno pro přidání potvrzovacího okna a správné volání API
    const deleteInvoice = async (invoiceId) => {
        if (window.confirm("Opravdu chcete tuto fakturu smazat?")) {
            try {
                await apiDelete(`/api/invoices/${invoiceId}`);
                setInvoices(invoices.filter(invoice => invoice.id !== invoiceId));
                
            } catch (err) {
                setError('Nepodařilo se smazat fakturu.');
            }
        }
    };

    if (loading) {
        return <div className="loading-container">Načítání...</div>;
    }

    if (error) {
        return <div className="error-container">Chyba: {error}</div>;
    }

    return (
        <div className="invoice-index-container">
            <h1>Seznam faktur</h1>
            <hr />
            <div className="statistics-container">
                <h3>Statistiky</h3>
                <div className="statistics-row">
                    <p>Celkový součet faktur: <strong>{statistics.allTimeSum} Kč</strong></p>
                    <p>Součet faktur za letošní rok: <strong>{statistics.currentYearSum} Kč</strong></p>
                    <p>Celkový počet faktur: <strong>{statistics.invoicesCount}</strong></p>
                </div>
            </div>
            
            <hr />
            <div className="filter-container">
                <h3>Filtrování</h3>
                <div className="filter-form">
                    <label className="filter-label">
                        Minimální cena:
                        <input
                            type="number"
                            name="minPrice"
                            value={filters.minPrice}
                            onChange={handleFilterChange}
                        />
                    </label>
                    <label className="filter-label">
                        Maximální cena:
                        <input
                            type="number"
                            name="maxPrice"
                            value={filters.maxPrice}
                            onChange={handleFilterChange}
                        />
                    </label>
                    <label className="filter-label">
                        Název produktu:
                        <select
                            name="product"
                            value={filters.product}
                            onChange={handleFilterChange}
                        >
                            <option value="">-- Vyberte produkt --</option>
                            {products.map((product, index) => (
                                <option key={index} value={product}>
                                    {product}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label className="filter-label">
                        Kupující:
                        <select
                            name="buyerIdentificationNumber"
                            value={filters.buyerIdentificationNumber}
                            onChange={handleFilterChange}
                        >
                            <option value="">-- Vyberte kupujícího --</option>
                            {persons.map((person) => (
                                <option key={person.id} value={person.identificationNumber}>
                                    {person.name}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label className="filter-label">
                        Prodávající:
                        <select
                            name="sellerIdentificationNumber"
                            value={filters.sellerIdentificationNumber}
                            onChange={handleFilterChange}
                        >
                            <option value="">-- Vyberte prodávajícího --</option>
                            {persons.map((person) => (
                                <option key={person.id} value={person.identificationNumber}>
                                    {person.name}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
            </div>

            <hr />
            <div className="mb-3">
                <Link to="/invoices/new" className="btn btn-primary">Vytvořit novou fakturu</Link>
            </div>

            <table className="table table-striped invoice-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Číslo faktury</th>
                        <th>Kupující</th>
                        <th>Prodávající</th>
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
                            <td>{invoice.buyer?.name}</td>
                            <td>{invoice.seller?.name}</td>
                            <td>{new Date(invoice.issued).toLocaleDateString()}</td>
                            <td>{new Date(invoice.dueDate).toLocaleDateString()}</td>
                            <td>{invoice.price}</td>
                            <td className="action-buttons">
                                <Link to={`/invoices/show/${invoice.id}`} className="btn btn-sm btn-info">Zobrazit</Link>
                                <Link to={`/invoices/edit/${invoice.id}`} className="btn btn-sm btn-warning">Upravit</Link>
                                <button onClick={() => deleteInvoice(invoice.id)} className="btn btn-sm btn-danger">Smazat</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default InvoiceIndex;
