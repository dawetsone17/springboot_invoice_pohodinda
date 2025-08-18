import React, { useEffect, useState } from "react";
import { apiDelete, apiGet } from "../utils/api";
import PersonTable from "./PersonTable";
import { Link } from "react-router-dom";

const PersonIndex = () => {
  const [personData, setPersonData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const deletePerson = async (id) => {
    try {
      await apiDelete("/api/persons/" + id);
      setPersonData(personData.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Nepodařilo se smazat osobu:", error);
      alert("Nepodařilo se smazat osobu: " + error.message);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const personsResponse = await apiGet("/api/persons");
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
  }, []);

  if (loading) {
    return <div className="text-center mt-5">Načítání...</div>;
  }

  if (error) {
    return <div className="text-center mt-5 text-danger">Chyba: {error}</div>;
  }

  return (
    <div>
      <h1>Seznam osob</h1>
      <PersonTable deletePerson={deletePerson} items={personData} label="Počet osob:" />
      
      <h2>Statistiky osob</h2>
      <p>Příjmy a výdaje</p>
      
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Jméno/Název</th>
            <th>Příjem (Kč)</th>
            <th>Výdaj (Kč)</th>
          </tr>
        </thead>
        <tbody>
          {personData.map((person) => (
            <tr key={person.id}>
              <td>{person.id}</td>
              <td>
                <Link to={`/persons/show/${person.id}`}>{person.name}</Link>
              </td>
              <td>{person.revenue}</td>
              <td>{person.expenses}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PersonIndex;