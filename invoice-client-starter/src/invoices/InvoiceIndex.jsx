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
    const [products, setProducts] = useState([]);

    const [filters, setFilters] = useState({
        minPrice: "",
        maxPrice: "",
        product: "",
        buyerIdentificationNumber: "",
        sellerIdentificationNumber: "",
        dateFrom: "",
        dateTo: "",
    });

    const [pageable, setPageable] = useState({
        page: 0,
        size: 5,
        totalPages: 0,
        totalElements: 0,
    });
    
    const [sort, setSort] = useState({ column: 'id', direction: 'asc' });

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
                const queryParams = new URLSearchParams({
                    ...debouncedFilters,
                    page: pageable.page,
                    size: pageable.size,
                    sort: `${sort.column},${sort.direction}`
                }).toString();
                const url = `/api/invoices?${queryParams}`;

                console.log("Fetching invoices from URL:", url);
                const response = await apiGet(url);
                console.log("Invoices fetched successfully:", response);

                setInvoices(response.content);
                setPageable(prev => ({
                    ...prev,
                    totalPages: response.totalPages,
                    totalElements: response.totalElements,
                    page: response.number
                }));
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
                const data = await apiGet(url);
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

        const fetchProducts = async () => {
            try {
                const productsData = await apiGet("/api/invoices/products");
                setProducts(productsData);
            } catch (err) {
                console.error("Failed to fetch products:", err);
            }
        };

        fetchPersons();
        fetchStatistics();
        fetchProducts();
        fetchInvoices();
    }, [debouncedFilters, pageable.page, pageable.size, sort.column, sort.direction]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));
        setPageable(prev => ({ ...prev, page: 0 }));
    };

    const handlePageChange = (newPage) => {
        setPageable(prev => ({ ...prev, page: newPage }));
    };

    const handleSizeChange = (e) => {
        const newSize = parseInt(e.target.value, 10);
        setPageable({ ...pageable, size: newSize, page: 0 });
    };

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
    
    const handlePriceChange = (e) => {
        const { name, value } = e.target;
        const numericValue = value ? parseFloat(value) : "";
        if (numericValue < 0) {
            setFilters(prev => ({ ...prev, [name]: 0 }));
        } else {
            setFilters(prev => ({ ...prev, [name]: numericValue }));
        }
    };
    
    const handleSort = (column) => {
        setSort(prevSort => {
            if (prevSort.column !== column) {
                return { column, direction: 'asc' };
            } else if (prevSort.direction === 'asc') {
                return { column, direction: 'desc' };
            } else {
                return { column: 'id', direction: 'asc' };
            }
        });
    };

    const getSortArrow = (column) => {
        if (sort.column === column) {
            return sort.direction === 'asc' ? ' ↑' : ' ↓';
        } else if (column === 'id' && sort.column !== 'id') {
            return ' ↕';
        }
        return ' ↕';
    };

    if (loading) {
        return <div className="loading-container">Načítání...</div>;
    }

    if (error) {
        return <div className="error-container">Chyba: {error}</div>;
    }

    return (
        <div className="invoice-index-container">
            {/* Přesun tlačítka nahoru vedle nadpisu */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1>Seznam faktur</h1>
                <Link to="/invoices/new" className="btn btn-primary">Nová faktura</Link>
            </div>
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
                        <div className="input-group-with-currency">
                            <input
                                type="number"
                                name="minPrice"
                                value={filters.minPrice}
                                onChange={handlePriceChange}
                                min="0"
                            />
                            <span className="currency">Kč</span>
                        </div>
                    </label>
                    <label className="filter-label">
                        Maximální cena:
                        <div className="input-group-with-currency">
                            <input
                                type="number"
                                name="maxPrice"
                                value={filters.maxPrice}
                                onChange={handlePriceChange}
                                min="0"
                            />
                            <span className="currency">Kč</span>
                        </div>
                    </label>
                    <label className="filter-label">
                        Název produktu:
                        <select
                            name="product"
                            value={filters.product}
                            onChange={handleFilterChange}
                        >
                            <option value="">-- Vyberte produkt --</option>
                            {products
                                .slice()
                                .sort()
                                .map((product, index) => (
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
                            {persons
                                .slice()
                                .sort((a, b) => a.name.localeCompare(b.name))
                                .map((person) => (
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
                            {persons
                                .slice()
                                .sort((a, b) => a.name.localeCompare(b.name))
                                .map((person) => (
                                    <option key={person.id} value={person.identificationNumber}>
                                        {person.name}
                                    </option>
                                ))}
                        </select>
                    </label>
                    <label className="filter-label">
                        Datum od:
                        <input
                            type="date"
                            name="dateFrom"
                            value={filters.dateFrom}
                            onChange={handleFilterChange}
                        />
                    </label>
                    <label className="filter-label">
                        Datum do:
                        <input
                            type="date"
                            name="dateTo"
                            value={filters.dateTo}
                            onChange={handleFilterChange}
                        />
                    </label>
                </div>
            </div>

            <hr />
            {/* Tlačítko pro vytvoření nové faktury bylo přesunuto výše */}

            <table className="table table-striped invoice-table">
                <thead>
                    <tr>
                        <th onClick={() => handleSort('id')} className={sort.column === 'id' ? 'active-sort' : ''}>ID {getSortArrow('id')}</th>
                        <th onClick={() => handleSort('invoiceNumber')} className={sort.column === 'invoiceNumber' ? 'active-sort' : ''}>Číslo faktury {getSortArrow('invoiceNumber')}</th>
                        <th onClick={() => handleSort('buyer.name')} className={sort.column === 'buyer.name' ? 'active-sort' : ''}>Kupující {getSortArrow('buyer.name')}</th>
                        <th onClick={() => handleSort('seller.name')} className={sort.column === 'seller.name' ? 'active-sort' : ''}>Prodávající {getSortArrow('seller.name')}</th>
                        <th onClick={() => handleSort('issued')} className={sort.column === 'issued' ? 'active-sort' : ''}>Vystaveno {getSortArrow('issued')}</th>
                        <th onClick={() => handleSort('dueDate')} className={sort.column === 'dueDate' ? 'active-sort' : ''}>Splatnost {getSortArrow('dueDate')}</th>
                        <th onClick={() => handleSort('price')} className={sort.column === 'price' ? 'active-sort' : ''}>Cena {getSortArrow('price')}</th>
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
                            <td>{invoice.price} Kč</td>
                            <td className="action-buttons">
                                <Link to={`/invoices/show/${invoice.id}`} className="btn btn-sm btn-info">Zobrazit</Link>
                                <Link to={`/invoices/edit/${invoice.id}`} className="btn btn-sm btn-warning">Upravit</Link>
                                <button onClick={() => deleteInvoice(invoice.id)} className="btn btn-sm btn-danger">Smazat</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="pagination-container">
                <button
                    onClick={() => handlePageChange(pageable.page - 1)}
                    disabled={pageable.page === 0}
                    className="btn btn-secondary me-2"
                >
                    Předchozí
                </button>
                <button
                    onClick={() => handlePageChange(pageable.page + 1)}
                    disabled={pageable.page >= pageable.totalPages - 1}
                    className="btn btn-secondary me-2"
                >
                    Další
                </button>
                <span>Stránka {pageable.page + 1} z {pageable.totalPages}</span>
                <label className="ms-3">
                    počet záznamů na stránku:
                    <select value={pageable.size} onChange={handleSizeChange} className="form-select d-inline-block w-auto ms-2">
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                        <option value="20">20</option>
                    </select>
                </label>
            </div>
        </div>
    );
};

export default InvoiceIndex;