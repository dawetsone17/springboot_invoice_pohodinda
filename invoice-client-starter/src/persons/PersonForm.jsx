import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiGet, apiPost, apiPut } from "../utils/api";
import '../index.css';

const PersonForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [person, setPerson] = useState({
        name: "",
        identificationNumber: "",
        taxNumber: "",
        accountNumber: "",
        bankCode: "",
        iban: "",
        telephone: "",
        mail: "",
        street: "",
        zip: "",
        city: "",
        country: "CZECHIA",
        note: ""
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        const fetchPerson = async () => {
            try {
                if (id) {
                    const data = await apiGet("/api/persons/" + id);
                    setPerson(data);
                }
            } catch (err) {
                setError("Nepodařilo se načíst osobu.");
            } finally {
                setLoading(false);
            }
        };
        fetchPerson();
    }, [id]);

    const validateField = (name, value) => {
        let error = '';
        if (typeof value === 'string' && value.trim() === '') {
            error = 'Toto pole je povinné.';
        } else if (name === 'identificationNumber' && value.length !== 8) {
            error = 'IČO musí mít přesně 8 znaků.';
        } else if (name === 'zip' && (value.length !== 5 || !/^\d+$/.test(value))) {
            error = 'PSČ musí mít přesně 5 číslic.';
        } else if (name === 'mail' && !value.includes('@')) {
            error = 'E-mail musí obsahovat zavináč (@).';
        } else if (name === 'telephone' && (value.length !== 9 || !/^\d+$/.test(value))) {
            error = 'Telefon musí mít přesně 9 číslic.';
        }
        return error;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        let updatedTaxNumber = person.taxNumber;
        if (name === 'identificationNumber' && value.length === 8) {
            updatedTaxNumber = `CZ${value}`;
        } else if (name === 'identificationNumber' && value.length !== 8) {
            updatedTaxNumber = '';
        }

        setPerson(prevPerson => ({ 
            ...prevPerson, 
            [name]: value,
            taxNumber: name === 'identificationNumber' ? updatedTaxNumber : prevPerson.taxNumber
        }));

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
        
        for (const key of ['name', 'identificationNumber', 'taxNumber', 'accountNumber', 'bankCode', 'iban', 'telephone', 'mail', 'street', 'zip', 'city', 'country']) {
            if (key === 'note') continue;
            const error = validateField(key, person[key]);
            if (error) {
                newErrors[key] = error;
                isValid = false;
            }
        }
        
        setFormErrors(newErrors);

        if (!isValid) {
            return;
        }
        
        try {
            if (id) {
                await apiPut("/api/persons/" + id, person);
            } else {
                await apiPost("/api/persons", person);
            }
            navigate("/persons");
        } catch (err) {
            setError(err.message || "Nepodařilo se uložit osobu.");
        }
    };

    if (loading) {
        return <div className="loading-container">Načítání...</div>;
    }

    if (error) {
        return <div className="error-container">Chyba: {error}</div>;
    }

    return (
        <div className="invoice-form-container">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1>{id ? "Upravit" : "Vytvořit"} osobu</h1>
                <div className="btn-group">
                    <button type="button" onClick={() => navigate(-1)} className="btn btn-secondary me-2">Zpět</button>
                    <button type="submit" onClick={handleSubmit} className="btn btn-primary">{id ? "Uložit úpravy" : "Vytvořit osobu"}</button>
                </div>
            </div>
            <hr />
            
            <div className="card">
                <div className="card-body">
                    <form onSubmit={handleSubmit} noValidate>
                        <div className={`form-group ${formErrors.name ? 'error' : ''}`}>
                            <label htmlFor="name">Jméno *:</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={person.name || ""}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                aria-invalid={!!formErrors.name}
                                aria-describedby="name-error"
                                required
                            />
                            {formErrors.name && (
                                <div id="name-error" className="error-message">{formErrors.name}</div>
                            )}
                        </div>

                        <div className={`form-group ${formErrors.identificationNumber ? 'error' : ''}`}>
                            <label htmlFor="identificationNumber">IČO *:</label>
                            <input
                                type="text"
                                id="identificationNumber"
                                name="identificationNumber"
                                value={person.identificationNumber || ""}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                aria-invalid={!!formErrors.identificationNumber}
                                aria-describedby="identificationNumber-error"
                                required
                                maxLength={8}
                            />
                            {formErrors.identificationNumber && (
                                <div id="identificationNumber-error" className="error-message">{formErrors.identificationNumber}</div>
                            )}
                        </div>


                        <div className={`form-group ${formErrors.taxNumber ? 'error' : ''}`}>
                            <label htmlFor="taxNumber">DIČ *:</label>
                            <input
                                type="text"
                                id="taxNumber"
                                name="taxNumber"
                                value={person.taxNumber || ""}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                aria-invalid={!!formErrors.taxNumber}
                                aria-describedby="taxNumber-error"
                                required
                                readOnly
                            />
                            {formErrors.taxNumber && (
                                <div id="taxNumber-error" className="error-message">{formErrors.taxNumber}</div>
                            )}
                        </div>


                        <div className="form-group-inline">
                            <label>Číslo účtu a kód banky *:</label>
                            <div className="form-group-row">
                                <div className={`form-group account-number-group ${formErrors.accountNumber ? 'error' : ''}`}>
                                    <input
                                        type="text"
                                        id="accountNumber"
                                        name="accountNumber"
                                        value={person.accountNumber || ""}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        aria-invalid={!!formErrors.accountNumber}
                                        aria-describedby="accountNumber-error"
                                        required
                                        placeholder="Číslo účtu"
                                    />
                                    {formErrors.accountNumber && (
                                        <div id="accountNumber-error" className="error-message">{formErrors.accountNumber}</div>
                                    )}
                                </div>
                                <span className="separator">/</span>
                                <div className={`form-group bank-code-group ${formErrors.bankCode ? 'error' : ''}`}>
                                    <input
                                        type="text"
                                        id="bankCode"
                                        name="bankCode"
                                        value={person.bankCode || ""}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        aria-invalid={!!formErrors.bankCode}
                                        aria-describedby="bankCode-error"
                                        required
                                        placeholder="Kód banky"
                                    />
                                    {formErrors.bankCode && (
                                        <div id="bankCode-error" className="error-message">{formErrors.bankCode}</div>
                                    )}
                                </div>
                            </div>
                        </div>


                        <div className={`form-group ${formErrors.iban ? 'error' : ''}`}>
                            <label htmlFor="iban">IBAN *:</label>
                            <input
                                type="text"
                                id="iban"
                                name="iban"
                                value={person.iban || ""}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                aria-invalid={!!formErrors.iban}
                                aria-describedby="iban-error"
                                required
                            />
                            {formErrors.iban && (
                                <div id="iban-error" className="error-message">{formErrors.iban}</div>
                            )}
                        </div>

                        
                        <div className={`form-group ${formErrors.telephone ? 'error' : ''}`}>
                            <label htmlFor="telephone">Telefon *:</label>
                            <input
                                type="text"
                                id="telephone"
                                name="telephone"
                                value={person.telephone || ""}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                aria-invalid={!!formErrors.telephone}
                                aria-describedby="telephone-error"
                                required
                            />
                            {formErrors.telephone && (
                                <div id="telephone-error" className="error-message">{formErrors.telephone}</div>
                            )}
                        </div>

                        
                        <div className={`form-group ${formErrors.mail ? 'error' : ''}`}>
                            <label htmlFor="mail">E-mail *:</label>
                            <input
                                type="text"
                                id="mail"
                                name="mail"
                                value={person.mail || ""}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                aria-invalid={!!formErrors.mail}
                                aria-describedby="mail-error"
                                required
                            />
                            {formErrors.mail && (
                                <div id="mail-error" className="error-message">{formErrors.mail}</div>
                            )}
                        </div>

                       
                        <div className={`form-group ${formErrors.street ? 'error' : ''}`}>
                            <label htmlFor="street">Ulice *:</label>
                            <input
                                type="text"
                                id="street"
                                name="street"
                                value={person.street || ""}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                aria-invalid={!!formErrors.street}
                                aria-describedby="street-error"
                                required
                            />
                            {formErrors.street && (
                                <div id="street-error" className="error-message">{formErrors.street}</div>
                            )}
                        </div>

                       
                        <div className={`form-group ${formErrors.zip ? 'error' : ''}`}>
                            <label htmlFor="zip">PSČ *:</label>
                            <input
                                type="text"
                                id="zip"
                                name="zip"
                                value={person.zip || ""}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                aria-invalid={!!formErrors.zip}
                                aria-describedby="zip-error"
                                required
                            />
                            {formErrors.zip && (
                                <div id="zip-error" className="error-message">{formErrors.zip}</div>
                            )}
                        </div>

                        
                        <div className={`form-group ${formErrors.city ? 'error' : ''}`}>
                            <label htmlFor="city">Město *:</label>
                            <input
                                type="text"
                                id="city"
                                name="city"
                                value={person.city || ""}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                aria-invalid={!!formErrors.city}
                                aria-describedby="city-error"
                                required
                            />
                            {formErrors.city && (
                                <div id="city-error" className="error-message">{formErrors.city}</div>
                            )}
                        </div>

                        
                        <div className={`form-group ${formErrors.country ? 'error' : ''}`}>
                            <label htmlFor="country">Země *:</label>
                            <select
                                id="country"
                                name="country"
                                value={person.country || ""}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                aria-invalid={!!formErrors.country}
                                aria-describedby="country-error"
                                required
                            >
                                <option value="">-- Vyberte zemi --</option>
                                <option value="CZECHIA">Česká republika</option>
                                <option value="SLOVAKIA">Slovensko</option>
                            </select>
                            {formErrors.country && (
                                <div id="country-error" className="error-message">{formErrors.country}</div>
                            )}
                        </div>

                        
                        <div className="form-group">
                            <label htmlFor="note">Poznámka:</label>
                            <textarea
                                id="note"
                                name="note"
                                value={person.note || ""}
                                onChange={handleChange}
                            ></textarea>
                        </div>
                        
                        <div className="required-fields-note">
                            <p>* Povinná pole</p>
                        </div>
                        
                        <div className="d-flex justify-content-end">
                            <button type="button" onClick={() => navigate(-1)} className="btn btn-secondary me-2">Zpět</button>
                            <button type="submit" onClick={handleSubmit} className="btn btn-primary">{id ? "Uložit úpravy" : "Vytvořit osobu"}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PersonForm;