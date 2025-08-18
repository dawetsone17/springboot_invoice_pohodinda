import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiGet, apiPost, apiPut } from '../utils/api';

const InvoiceForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [invoice, setInvoice] = useState({
        invoiceNumber: '',
        seller: { id: '', name: '' },
        buyer: { id: '', name: '' },
        issued: '',
        dueDate: '',
        product: '',
        price: '',
        vat: '',
        note: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [persons, setPersons] = useState([]);

    useEffect(() => {
        const fetchPersons = async () => {
            try {
                const data = await apiGet('/api/persons');
                setPersons(data);
            } catch (err) {
                setError('Nepodařilo se načíst osoby: ' + err.message);
            }
        };
        fetchPersons();
    }, []);

    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                const data = await apiGet(`/api/invoices/${id}`);
                setInvoice(data);
            } catch (err) {
                setError('Faktura nebyla nalezena.');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchInvoice();
        } else {
            setLoading(false);
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInvoice((prevInvoice) => {
            if (name === 'sellerId') {
                const selectedPerson = persons.find(p => p.id === parseInt(value));
                return { ...prevInvoice, seller: selectedPerson || { id: '', name: '' } };
            }
            if (name === 'buyerId') {
                const selectedPerson = persons.find(p => p.id === parseInt(value));
                return { ...prevInvoice, buyer: selectedPerson || { id: '', name: '' } };
            }
            return { ...prevInvoice, [name]: value };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (id) {
                await apiPut(`/api/invoices/${id}`, invoice);
            } else {
                await apiPost('/api/invoices', invoice);
            }
            navigate('/invoices');
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading && id) {
        return <div>Načítání...</div>;
    }

    if (error) {
        return <div>Chyba: {error}</div>;
    }

    return (
        <div>
            <h1>{id ? 'Úprava faktury' : 'Vytvoření faktury'}</h1>
            <hr />
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="invoiceNumber">Číslo faktury:</label>
                    <input
                        type="number"
                        id="invoiceNumber"
                        name="invoiceNumber"
                        value={invoice.invoiceNumber || ''}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="sellerId">Prodávající:</label>
                    <select
                        id="sellerId"
                        name="sellerId"
                        value={invoice.seller?.id || ''}
                        onChange={handleChange}
                        required
                    >
                        <option value="">-- Vyberte prodávajícího --</option>
                        {persons.map((person) => (
                            <option key={person.id} value={person.id}>
                                {person.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="buyerId">Kupující:</label>
                    <select
                        id="buyerId"
                        name="buyerId"
                        value={invoice.buyer?.id || ''}
                        onChange={handleChange}
                        required
                    >
                        <option value="">-- Vyberte kupujícího --</option>
                        {persons.map((person) => (
                            <option key={person.id} value={person.id}>
                                {person.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="issued">Datum vystavení:</label>
                    <input
                        type="date"
                        id="issued"
                        name="issued"
                        value={invoice.issued?.toString() || ''}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="dueDate">Datum splatnosti:</label>
                    <input
                        type="date"
                        id="dueDate"
                        name="dueDate"
                        value={invoice.dueDate?.toString() || ''}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="product">Produkt:</label>
                    <input
                        type="text"
                        id="product"
                        name="product"
                        value={invoice.product || ''}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="price">Cena (bez DPH):</label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        value={invoice.price || ''}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="vat">DPH:</label>
                    <input
                        type="number"
                        id="vat"
                        name="vat"
                        value={invoice.vat || ''}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="note">Poznámka:</label>
                    <textarea
                        id="note"
                        name="note"
                        value={invoice.note || ''}
                        onChange={handleChange}
                    ></textarea>
                </div>
                <button type="submit">{id ? 'Uložit úpravy' : 'Vytvořit fakturu'}</button>
            </form>
        </div>
    );
};

export default InvoiceForm;