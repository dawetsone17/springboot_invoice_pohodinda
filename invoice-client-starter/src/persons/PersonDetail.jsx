import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import '../index.css';
import { apiGet, apiDelete } from '../utils/api';

const PersonDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [person, setPerson] = useState(null);
    const [salesInvoices, setSalesInvoices] = useState([]);
    const [purchasesInvoices, setPurchasesInvoices] = useState([]);
    const [statistics, setStatistics] = useState(null); // Nový stav pro statistiky
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPersonData = async () => {
            try {
                if (!id) {
                    throw new Error('ID osoby nebylo nalezeno v URL.');
                }
                
                // Načtení dat o osobě
                const personData = await apiGet(`/api/persons/${id}`);
                setPerson(personData);

                // Načtení statistik pro VŠECHNY osoby
                const statisticsResponse = await apiGet(`/api/persons/statistics`);

                // Nalezení statistiky pro aktuální osobu
                const personStatistics = statisticsResponse.find(stat => stat.personId === Number(id));
                setStatistics(personStatistics || { revenue: 0, expenses: 0 }); // Uložení nalezených statistik, nebo výchozí hodnoty

                if (personData.identificationNumber) {
                    // Načtení vystavených faktur
                    const salesData = await apiGet(`/api/persons/${personData.identificationNumber}/sales`);
                    setSalesInvoices(salesData);

                    // Načtení přijatých faktur
                    const purchasesData = await apiGet(`/api/persons/${personData.identificationNumber}/purchases`);
                    setPurchasesInvoices(purchasesData);
                } else {
                    setSalesInvoices([]);
                    setPurchasesInvoices([]);
                }

                setError(null);
            } catch (err) {
                console.error("Chyba při načítání dat:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchPersonData();
        } else {
            setLoading(false);
            setError('ID osoby nebylo nalezeno v URL.');
        }
    }, [id]);

    const handleDelete = async () => {
        if (window.confirm('Opravdu chcete smazat tuto osobu?')) {
            try {
                await apiDelete(`/api/persons/${id}`);
                alert('Osoba byla úspěšně smazána.');
                navigate('/persons');
            } catch (err) {
                console.error("Nepodařilo se smazat osobu:", err);
                alert(`Chyba při mazání: ${err.message}`);
            }
        }
    };

    if (loading) {
        return <div className="loading-container">Načítání...</div>;
    }

    if (error) {
        return <div className="error-container">Chyba: {error}</div>;
    }

    if (!person) {
        return <div className="invoice-index-container">Osoba nebyla nalezena.</div>;
    }

    const country = person.country === 'CZECHIA' ? 'Česká republika' : 'Slovensko';

    return (
        <div className="invoice-index-container">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1>Detail osoby</h1>
                <div>
                    <button onClick={() => navigate(-1)} className="btn btn-secondary me-2">Zpět</button>
                    <Link to={`/persons/edit/${person.id}`} className="btn btn-warning me-2">Upravit osobu</Link>
                    <button onClick={handleDelete} className="btn btn-danger">Smazat osobu</button>
                </div>
            </div>
            <hr />
            
            <div className="person-detail-container">
                <h3>
                    {person.name} ({person.identificationNumber})
                </h3>
                <p><strong>DIČ:</strong> {person.taxNumber}</p>
                <p><strong>Bankovní účet:</strong> {person.accountNumber}/{person.bankCode} ({person.iban})</p>
                <p><strong>Tel.:</strong> {person.telephone}</p>
                <p><strong>Mail:</strong> {person.mail}</p>
                <p><strong>Sídlo:</strong> {person.street}, {person.city}, {person.zip}, {country}</p>
                <p><strong>Poznámka:</strong> {person.note}</p>
            </div>

            {/* Zde je nová sekce se statistikami */}
            <hr className="my-4" style={{borderColor: '#ccc'}}/>
            
            {statistics && (
                <div className="statistics-container mb-4">
                    <h3>Statistiky</h3>
                    <div className="d-flex justify-content-start align-items-center flex-wrap">
                        <div className="me-5">
                            <strong>Celkový příjem:</strong> <span className="text-success">{statistics.revenue || 0} Kč</span>
                        </div>
                        <div>
                            <strong>Celkové výdaje:</strong> <span className="text-danger">{statistics.expenses || 0} Kč</span>
                        </div>
                    </div>
                </div>
            )}
            
            <hr className="my-4" />

            <div className="statistics-container">
                <h3>Vystavené faktury</h3>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Číslo faktury</th>
                            <th>Kupující</th>
                            <th>Cena (Kč)</th>
                            <th>Detail</th>
                        </tr>
                    </thead>
                    <tbody>
                        {salesInvoices.map(invoice => (
                            <tr key={invoice.id}>
                                <td>{invoice.invoiceNumber}</td>
                                <td>
                                    {invoice.buyer && invoice.buyer.name ? (
                                        <Link to={`/persons/show/${invoice.buyer.id}`}>
                                            {invoice.buyer.name}
                                        </Link>
                                    ) : ('Neznámý kupující')}
                                </td>
                                <td>{invoice.price} Kč</td>
                                <td>
                                    <Link to={`/invoices/show/${invoice.id}`}>Zobrazit</Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <hr />

            <div className="statistics-container">
                <h3>Přijaté faktury</h3>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Číslo faktury</th>
                            <th>Prodávající</th>
                            <th>Cena (Kč)</th>
                            <th>Detail</th>
                        </tr>
                    </thead>
                    <tbody>
                        {purchasesInvoices.map(invoice => (
                            <tr key={invoice.id}>
                                <td>{invoice.invoiceNumber}</td>
                                <td>
                                    {invoice.seller && invoice.seller.name ? (
                                        <Link to={`/persons/show/${invoice.seller.id}`}>
                                            {invoice.seller.name}
                                        </Link>
                                    ) : ('Neznámý prodávající')}
                                </td>
                                <td>{invoice.price} Kč</td>
                                <td>
                                    <Link to={`/invoices/show/${invoice.id}`}>Zobrazit</Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PersonDetail;