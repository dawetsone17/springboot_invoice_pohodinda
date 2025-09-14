import React, { useEffect, useState } from "react";
import { apiDelete, apiGet } from "../utils/api";
import { Link } from "react-router-dom";
import '../index.css';

const PersonIndex = () => {
    const [personData, setPersonData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sort, setSort] = useState({ column: 'id', direction: 'asc' });

    const deletePerson = async (id) => {
        try {
            if (window.confirm("Opravdu chcete smazat tuto osobu?")) {
                await apiDelete("/api/persons/" + id);
                setPersonData(personData.filter((item) => item.id !== id));
            }
        } catch (error) {
            console.error("Nepodařilo se smazat osobu:", error);
            setError("Nepodařilo se smazat osobu: " + error.message);
        }
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            const personsResponse = await apiGet(`/api/persons?sort=${sort.column},${sort.direction}`);
            const statisticsResponse = await apiGet("/api/persons/statistics");

            const statsMap = new Map();
            statisticsResponse.forEach((stat) => {
                const key = Number(stat.personId);
                statsMap.set(key, {
                    revenue: stat.revenue || 0,
                    expenses: stat.expenses || 0,
                });
            });

            const combinedData = personsResponse.map((person) => {
                const stats = statsMap.get(person.id) || { revenue: 0, expenses: 0 };
                return {
                    ...person,
                    revenue: stats.revenue,
                    expenses: stats.expenses,
                };
            });

            setPersonData(combinedData);
            setError(null);
        } catch (error) {
            console.error("Chyba při načítání dat:", error);
            setError("Nepodařilo se načíst data: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [sort.column, sort.direction]);

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
        }
        return ' ↕';
    };

    if (loading) {
        return <div className="text-center mt-5">Načítání...</div>;
    }

    if (error) {
        return <div className="text-center mt-5 text-danger">Chyba: {error}</div>;
    }

    return (
        <div className="invoice-index-container">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1>Seznam osob</h1>
                <Link to="/persons/new" className="btn btn-primary">Nová osoba</Link>
            </div>
            <hr />
            
            <div className="statistics-container">
                <h3>Statistiky osob</h3>
                <p>Příjmy a výdaje</p>
                <div className="statistics-row">
                    <table className="table table-striped invoice-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th onClick={() => handleSort('id')} className={sort.column === 'id' ? 'active-sort' : ''}>ID{getSortArrow('id')}</th>
                                <th onClick={() => handleSort('name')} className={sort.column === 'name' ? 'active-sort' : ''}>Jméno/Název{getSortArrow('name')}</th>
                                <th onClick={() => handleSort('revenue')} className={sort.column === 'revenue' ? 'active-sort' : ''}>Příjem (Kč){getSortArrow('revenue')}</th>
                                <th onClick={() => handleSort('expenses')} className={sort.column === 'expenses' ? 'active-sort' : ''}>Výdaj (Kč){getSortArrow('expenses')}</th>
                                <th>Akce k osobě</th> 
                            </tr>
                        </thead>
                        <tbody>
                            {personData.map((person, index) => (
                                <tr key={person.id}>
                                    <td>{index + 1}</td>
                                    <td>{person.id}</td>
                                    <td>
                                        <Link to={`/persons/show/${person.id}`}>{person.name}</Link>
                                    </td>
                                    <td>{person.revenue.toLocaleString('cs-CZ')} Kč</td>
                                    <td>{person.expenses.toLocaleString('cs-CZ')} Kč</td>
                                    <td>
                                        <div className="btn-group">
                                            <Link
                                                to={`/persons/show/${person.id}`}
                                                className="btn btn-sm btn-info me-2"
                                            >
                                                Zobrazit
                                            </Link>
                                            <Link
                                                to={`/persons/edit/${person.id}`}
                                                className="btn btn-sm btn-warning me-2"
                                            >
                                                Upravit
                                            </Link>
                                            <button
                                                onClick={() => deletePerson(person.id)}
                                                className="btn btn-sm btn-danger"
                                            >
                                                Odstranit
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <hr />

            
            
        </div>
    );
};

export default PersonIndex;