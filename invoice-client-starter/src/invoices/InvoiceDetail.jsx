import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import '../index.css';
import { apiGet, apiDelete } from '../utils/api'; // Použití vašich API funkcí

const InvoiceDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                const data = await apiGet(`/api/invoices/${id}`);
                setInvoice(data);
                setError(null);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchInvoice();
    }, [id]);

    const handleDelete = async () => {
        if (window.confirm('Opravdu chcete smazat tuto fakturu?')) {
            try {
                await apiDelete(`/api/invoices/${id}`);
                alert('Faktura byla úspěšně smazána.');
                navigate('/invoices');
            } catch (err) {
                setError(err.message);
            }
        }
    };

    if (loading) {
        return <div className="loading-container">Načítání...</div>;
    }

    if (error) {
        return <div className="error-container">Chyba: {error}</div>;
    }

    if (!invoice) {
        return <div>Faktura nebyla nalezena.</div>;
    }

    return (
        <div className="invoice-index-container">
            <h1>Detail faktury</h1>
            <hr />
            
            <div className="card">
                {/* Tlačítka jsou přesunuta sem, do card-headeru */}
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h2>Faktura č. {invoice.invoiceNumber}</h2>
                    <div>
                        <button onClick={() => navigate(-1)} className="btn btn-secondary btn-sm me-2">Zpět</button>
                        <Link to={`/invoices/edit/${invoice.id}`} className="btn btn-warning btn-sm me-2">Upravit</Link>
                        <button onClick={handleDelete} className="btn btn-danger btn-sm">Smazat</button>
                    </div>
                </div>
                <div className="card-body">
                    <p><strong>Produkt:</strong> {invoice.product}</p>
                    <p><strong>Cena:</strong> {invoice.price} Kč</p>
                    <p><strong>DPH:</strong> {invoice.vat}%</p>
                    <p><strong>Datum vystavení:</strong> {new Date(invoice.issued).toLocaleDateString()}</p>
                    <p><strong>Datum splatnosti:</strong> {new Date(invoice.dueDate).toLocaleDateString()}</p>
                    <p><strong>Poznámka:</strong> {invoice.note}</p>
                </div>
            </div>
            
            <div className="row mt-4">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header">
                            <h5>Prodávající</h5>
                        </div>
                        <div className="card-body">
                            {invoice.seller ? (
                                <>
                                    <p>
                                        <Link to={`/persons/show/${invoice.seller.id}`}>
                                            <strong>Název:</strong> {invoice.seller.name}
                                        </Link>
                                    </p>
                                    <p><strong>IČO:</strong> {invoice.seller.identificationNumber}</p>
                                    <p><strong>Adresa:</strong> {invoice.seller.street}, {invoice.seller.city}, {invoice.seller.zip}</p>
                                </>
                            ) : (
                                <span>Neznámý prodávající</span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header">
                            <h5>Kupující</h5>
                        </div>
                        <div className="card-body">
                            {invoice.buyer ? (
                                <>
                                    <p>
                                        <Link to={`/persons/show/${invoice.buyer.id}`}>
                                            <strong>Název:</strong> {invoice.buyer.name}
                                        </Link>
                                    </p>
                                    <p><strong>IČO:</strong> {invoice.buyer.identificationNumber}</p>
                                    <p><strong>Adresa:</strong> {invoice.buyer.street}, {invoice.buyer.city}, {invoice.buyer.zip}</p>
                                </>
                            ) : (
                                <span>Neznámý kupující</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvoiceDetail;