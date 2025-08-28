import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiGet, apiPost, apiPut, apiDelete } from '../utils/api';
import '../index.css';

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
    const [formErrors, setFormErrors] = useState({});
    const [totalPrice, setTotalPrice] = useState(0);
    const [vatAmount, setVatAmount] = useState(0);
    const [generatedInvoiceNumber, setGeneratedInvoiceNumber] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Načtení osob pro select boxy
                const personsData = await apiGet('/api/persons');
                setPersons(personsData);

                if (id) {
                    // Režim úpravy: načtení dat existující faktury
                    const invoiceData = await apiGet(`/api/invoices/${id}`);
                    
                    // Upravená část pro správné formátování data
                    const issuedDate = invoiceData.issued instanceof Array 
                        ? `${invoiceData.issued[0]}-${String(invoiceData.issued[1]).padStart(2, '0')}-${String(invoiceData.issued[2]).padStart(2, '0')}`
                        : invoiceData.issued;

                    const dueDate = invoiceData.dueDate instanceof Array 
                        ? `${invoiceData.dueDate[0]}-${String(invoiceData.dueDate[1]).padStart(2, '0')}-${String(invoiceData.dueDate[2]).padStart(2, '0')}`
                        : invoiceData.dueDate;

                    setInvoice({
                        ...invoiceData,
                        issued: issuedDate || '',
                        dueDate: dueDate || '',
                        seller: invoiceData.seller || { id: '', name: '' },
                        buyer: invoiceData.buyer || { id: '', name: '' },
                    });
                    setGeneratedInvoiceNumber(invoiceData.invoiceNumber);
                } else {
                    // Režim vytváření: načtení nového čísla faktury
                    const newInvoiceNumber = await apiGet('/api/invoices/next-number');
                    setGeneratedInvoiceNumber(newInvoiceNumber);
                    setInvoice(prev => ({ ...prev, invoiceNumber: newInvoiceNumber }));
                }
            } catch (err) {
                console.error("Failed to fetch data:", err);
                setError('Nepodařilo se načíst data.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    useEffect(() => {
        const calculateTotals = () => {
            const price = parseFloat(invoice.price);
            const vatRate = parseFloat(invoice.vat);

            if (!isNaN(price) && !isNaN(vatRate)) {
                const calculatedVatAmount = price * (vatRate / 100);
                const calculatedTotalPrice = price + calculatedVatAmount;

                setVatAmount(calculatedVatAmount.toFixed(2));
                setTotalPrice(calculatedTotalPrice.toFixed(2));
            } else {
                setVatAmount(0);
                setTotalPrice(0);
            }
        };
        calculateTotals();
    }, [invoice.price, invoice.vat]);

    const validateField = (name, value) => {
        let error = '';
        if (value === null || (typeof value === 'string' && value.trim() === '')) {
            error = 'Toto pole je povinné.';
        } else if (name === 'price' && (isNaN(value) || parseFloat(value) < 0)) {
            error = 'Cena musí být kladné číslo.';
        } else if (name === 'vat' && (isNaN(value) || value.toString().trim() === '')) {
            error = 'Vyberte sazbu DPH.';
        }
        return error;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInvoice((prevInvoice) => {
            const newInvoice = { ...prevInvoice };
            if (name === 'sellerId') {
                const selectedPerson = persons.find(p => p.id === parseInt(value));
                newInvoice.seller = selectedPerson || { id: '', name: '' };
            } else if (name === 'buyerId') {
                const selectedPerson = persons.find(p => p.id === parseInt(value));
                newInvoice.buyer = selectedPerson || { id: '', name: '' };
            } else {
                newInvoice[name] = value;
            }
            return newInvoice;
        });

        setFormErrors(prevErrors => ({
            ...prevErrors,
            [name]: '',
        }));
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        const error = validateField(name, value);
        setFormErrors(prevErrors => ({
            ...prevErrors,
            [name]: error,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};
        let isValid = true;
        ['product', 'price', 'issued', 'dueDate'].forEach(key => {
            const error = validateField(key, invoice[key]);
            if (error) {
                newErrors[key] = error;
                isValid = false;
            }
        });

        if (!invoice.seller?.id) { newErrors.sellerId = 'Vyberte prodávajícího.'; isValid = false; }
        if (!invoice.buyer?.id) { newErrors.buyerId = 'Vyberte kupujícího.'; isValid = false; }
        if (invoice.vat === null || invoice.vat === '') { newErrors.vat = 'Vyberte sazbu DPH.'; isValid = false; }

        setFormErrors(newErrors);
        if (!isValid) return;

        try {
            if (id) {
                await apiPut(`/api/invoices/${id}`, invoice);
            } else {
                await apiPost('/api/invoices', invoice);
            }
            navigate('/invoices');
        } catch (err) {
            setError(err.message || 'Nepodařilo se uložit fakturu.');
        }
    };

    if (loading) return <div className="loading-container">Načítání...</div>;
    if (error) return <div className="error-container">Chyba: {error}</div>;

    return (
        <div className="invoice-form-container">
            <h1>{id ? 'Úprava faktury' : 'Vytvoření faktury'}</h1>
            <form onSubmit={handleSubmit} noValidate>
                <div className="form-group">
                    <label htmlFor="invoiceNumber">Číslo faktury (generuje se automaticky):</label>
                    <input
                        type="text"
                        id="invoiceNumber"
                        name="invoiceNumber"
                        value={generatedInvoiceNumber}
                        readOnly
                        className="total-price-input"
                    />
                </div>

                {/* Seller */}
                <div className={`form-group ${formErrors.sellerId ? 'error' : ''}`}>
                    <label htmlFor="sellerId">Prodávající *:</label>
                    <select
                        id="sellerId"
                        name="sellerId"
                        value={invoice.seller?.id || ''}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                    >
                        <option value="">-- Vyberte prodávajícího --</option>
                        {persons.map((person) => (
                            <option key={person.id} value={person.id}>
                                {person.name}
                            </option>
                        ))}
                    </select>
                    {formErrors.sellerId && (
                        <div className="error-message">{formErrors.sellerId}</div>
                    )}
                </div>

                {/* Buyer */}
                <div className={`form-group ${formErrors.buyerId ? 'error' : ''}`}>
                    <label htmlFor="buyerId">Kupující *:</label>
                    <select
                        id="buyerId"
                        name="buyerId"
                        value={invoice.buyer?.id || ''}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                    >
                        <option value="">-- Vyberte kupujícího --</option>
                        {persons.map((person) => (
                            <option key={person.id} value={person.id}>
                                {person.name}
                            </option>
                        ))}
                    </select>
                    {formErrors.buyerId && (
                        <div className="error-message">{formErrors.buyerId}</div>
                    )}
                </div>

                {/* Issued Date */}
                <div className={`form-group ${formErrors.issued ? 'error' : ''}`}>
                    <label htmlFor="issued">Datum vystavení *:</label>
                    <input
                        type="date"
                        id="issued"
                        name="issued"
                        value={invoice.issued || ''}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                    />
                    {formErrors.issued && (
                        <div className="error-message">{formErrors.issued}</div>
                    )}
                </div>

                {/* Due Date */}
                <div className={`form-group ${formErrors.dueDate ? 'error' : ''}`}>
                    <label htmlFor="dueDate">Datum splatnosti *:</label>
                    <input
                        type="date"
                        id="dueDate"
                        name="dueDate"
                        value={invoice.dueDate || ''}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                    />
                    {formErrors.dueDate && (
                        <div className="error-message">{formErrors.dueDate}</div>
                    )}
                </div>

                {/* Product */}
                <div className={`form-group ${formErrors.product ? 'error' : ''}`}>
                    <label htmlFor="product">Produkt *:</label>
                    <input
                        type="text"
                        id="product"
                        name="product"
                        value={invoice.product || ''}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                    />
                    {formErrors.product && (
                        <div className="error-message">{formErrors.product}</div>
                    )}
                </div>

                {/* Price */}
                <div className={`form-group ${formErrors.price ? 'error' : ''}`}>
                    <label htmlFor="price">Cena (bez DPH) *:</label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        value={invoice.price || ''}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                    />
                    {formErrors.price && (
                        <div className="error-message">{formErrors.price}</div>
                    )}
                </div>

                {/* VAT */}
                <div className={`form-group ${formErrors.vat ? 'error' : ''}`}>
                    <label htmlFor="vat">DPH *:</label>
                    <select
                        id="vat"
                        name="vat"
                        value={invoice.vat || ''}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                    >
                        <option value="">-- Vyberte sazbu DPH --</option>
                        <option value="21">21 %</option>
                        <option value="12">12 %</option>
                    </select>
                    {formErrors.vat && (
                        <div className="error-message">{formErrors.vat}</div>
                    )}
                </div>

                {/* Calculated values */}
                <div className="calculated-values">
                    <p className="calculated-vat-amount">DPH: {vatAmount} Kč</p>
                    <p className="calculated-total-price">Celková cena (s DPH): {totalPrice} Kč</p>
                </div>

                {/* Note */}
                <div className="form-group">
                    <label htmlFor="note">Poznámka:</label>
                    <textarea
                        id="note"
                        name="note"
                        value={invoice.note || ''}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    ></textarea>
                </div>

                <div className="required-fields-note">
                    <p>* Povinná pole</p>
                </div>

                <button type="submit">{id ? 'Uložit úpravy' : 'Vytvořit fakturu'}</button>
            </form>
        </div>
    );
};

export default InvoiceForm;