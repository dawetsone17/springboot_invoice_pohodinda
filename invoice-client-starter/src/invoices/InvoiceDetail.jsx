import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const InvoiceDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/invoices/${id}`);
                if (!response.ok) {
                    throw new Error('Faktura nebyla nalezena.');
                }
                const data = await response.json();
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

    const deleteInvoice = async () => {
        if (window.confirm('Opravdu chcete smazat tuto fakturu?')) {
            try {
                const response = await fetch(`http://localhost:8080/api/invoices/${id}`, {
                    method: 'DELETE',
                });
                if (!response.ok) {
                    throw new Error('Nepodařilo se smazat fakturu.');
                }
                navigate('/invoices');
            } catch (err) {
                setError(err.message);
            }
        }
    };

    if (loading) {
        return <div>Načítání...</div>;
    }

    if (error) {
        return <div>Chyba: {error}</div>;
    }

    if (!invoice) {
        return <div>Faktura nebyla nalezena.</div>;
    }

    return (
        <div>
            <h1>Detail faktury</h1>
            <hr />
            <div className="card">
                <div className="card-header">
                    <h2>Faktura č. {invoice.invoiceNumber}</h2>
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
                            {/* Opraveno: Přidání detailů o prodávajícím */}
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
                            {/* Opraveno: Přidání detailů o kupujícím */}
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
            
            <div className="mt-4">
                <Link to={`/invoices/edit/${invoice.id}`} className="btn btn-warning">Upravit</Link>
                <button onClick={deleteInvoice} className="btn btn-danger ms-2">Smazat</button>
            </div>
        </div>
    );
};

export default InvoiceDetail;