import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const PersonDetail = () => {
    const { id } = useParams();
    const [person, setPerson] = useState(null);
    const [salesInvoices, setSalesInvoices] = useState([]);
    const [purchasesInvoices, setPurchasesInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPersonData = async () => {
            try {
                if (!id) {
                    throw new Error('ID osoby nebylo nalezeno v URL.');
                }
                
                // Načtení detailu osoby
                const personResponse = await fetch(`http://localhost:8080/api/persons/${id}`);
                if (!personResponse.ok) {
                    throw new Error('Nepodařilo se načíst detail osoby.');
                }
                const personData = await personResponse.json();
                setPerson(personData);

                // Načtení faktur (pokud existuje podle id)
                if (personData.identificationNumber) {
                    const salesResponse = await fetch(`http://localhost:8080/api/identification/${personData.identificationNumber}/sales`);
                    const salesData = await salesResponse.json();
                    setSalesInvoices(salesData);

                    const purchasesResponse = await fetch(`http://localhost:8080/api/identification/${personData.identificationNumber}/purchases`);
                    const purchasesData = await purchasesResponse.json();
                    setPurchasesInvoices(purchasesData);
                } else {
                    setSalesInvoices([]);
                    setPurchasesInvoices([]);
                }

                setError(null);
            } catch (err) {
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

    if (loading) {
        return <div>Načítání...</div>;
    }

    if (error) {
        return <div>Chyba: {error}</div>;
    }

    if (!person) {
        return <div>Osoba nebyla nalezena.</div>;
    }

    const country = person.country === 'CZECHIA' ? 'Česká republika' : 'Slovensko';

    return (
        <div>
            <h1>Detail osoby</h1>
            <hr />
            <h3>
                {person.name} ({person.identificationNumber})
            </h3>
            <p>
                <strong>DIČ:</strong> {person.taxNumber}
            </p>
            <p>
                <strong>Bankovní účet:</strong> {person.accountNumber}/{person.bankCode} ({person.iban})
            </p>
            <p>
                <strong>Tel.:</strong> {person.telephone}
            </p>
            <p>
                <strong>Mail:</strong> {person.mail}
            </p>
            <p>
                <strong>Sídlo:</strong> {person.street}, {person.city}, {person.zip}, {country}
            </p>
            <p>
                <strong>Poznámka:</strong> {person.note}
            </p>

            <hr />
            <h2>Vystavené faktury</h2>
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
                                ) : (
                                    'Neznámý kupující'
                                )}
                            </td>
                            <td>{invoice.price}</td>
                            <td>
                                <Link to={`/invoices/show/${invoice.id}`}>Zobrazit</Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <hr />
            <h2>Přijaté faktury</h2>
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
                                ) : (
                                    'Neznámý prodávající'
                                )}
                            </td>
                            <td>{invoice.price}</td>
                            <td>
                                <Link to={`/invoices/show/${invoice.id}`}>Zobrazit</Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PersonDetail;