import { useState, useEffect, Fragment } from "react";
import axios from "axios";
import phonebookService from "./services/phonebook";
import Notification from "./components/Notification";

const Filter = ({ setSearch }) => {
    return (
        <div>
            <button>filter shown with</button>
            <input onChange={(event) => setSearch(event.target.value)}></input>
        </div>
    );
};

const PersonForm = ({ handleFormSubmit, newName, setNewName, newNumber, setNewNumber }) => {
    return (
        <div>
            <form onSubmit={handleFormSubmit}>
                <div>
                    name: <input value={newName} onChange={(event) => setNewName(event.target.value)} />
                </div>
                <div>
                    number: <input value={newNumber} onChange={(event) => setNewNumber(event.target.value)} />
                </div>
                <div>
                    <button type="submit">add</button>
                </div>
            </form>
        </div>
    );
};

const Persons = ({ persons, newSearch, handleDelete }) => {
    return (
        <div>
            {persons
                .filter((p) => p.name.toLowerCase().includes(newSearch.toLowerCase()))
                .map((e) => (
                    <div key={e.id}>
                        {e.name} {e.number} <button onClick={() => handleDelete(e.id, e.name)}>delete</button>
                    </div>
                ))}
        </div>
    );
};

const App = () => {
    const [persons, setPersons] = useState([]);
    const [newSearch, setSearch] = useState("");
    const [newName, setNewName] = useState("");
    const [newNumber, setNewNumber] = useState("");
    const [Message, setMessage] = useState(null);
    const [isSuccess, setIsSuccess] = useState(true);

    useEffect(() => {
        phonebookService.getAll().then((response) => {
            setPersons(response);
        });
    }, []);

    const handleDelete = (id, name) => {
        if (window.confirm(`Delete ${name}?`)) {
            phonebookService
                .remove(id)
                .then((_) => {
                    setPersons(persons.filter((p) => p.id !== id));
                })
                .catch((error) => {
                    setIsSuccess(false);
                    setMessage(`${name} was already removed from server`);
                    setTimeout(() => {
                        setMessage(null);
                        setIsSuccess(true);
                    }, 3000);
                    setPersons(persons.filter((p) => p.id !== id));
                });
        }
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();
        const nameObject = {
            name: newName,
            number: newNumber,
            id: (Math.max(0, ...persons.map((p) => p.id)) + 1).toString(),
        };
        const found = persons.find((p) => p.name == newName);
        if (found) {
            if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
                phonebookService.update(found.id, { ...found, number: newNumber }).catch((error) => {
                    setIsSuccess(false);
                    setMessage(`${found.name} was already removed from server`);
                    setTimeout(() => {
                        setMessage(null);
                        setIsSuccess(true);
                    }, 3000);
                    setPersons(persons.filter((p) => p.id !== id));
                });
                setPersons(persons.map((p) => (p.id == found.id ? { ...found, number: newNumber } : p)));
                setMessage(`Modified ${found.name}`);
                setTimeout(() => {
                    setMessage(null);
                }, 3000);
            }
        } else {
            phonebookService.create(nameObject).then((r) => {
                setPersons(persons.concat(r));
                setNewName("");
                setNewNumber("");
                setMessage(`Added ${r.name}`);
                setTimeout(() => {
                    setMessage(null);
                }, 3000);
            });
        }
    };

    return (
        <div>
            <h2>Phonebook</h2>
            <Notification message={Message} type={isSuccess ? "success" : "failure"} />
            <Filter setSearch={setSearch} />
            <h2>add a new</h2>
            <PersonForm
                handleFormSubmit={handleFormSubmit}
                newName={newName}
                setNewName={setNewName}
                newNumber={newNumber}
                setNewNumber={setNewNumber}
            />
            <h2>Numbers</h2>
            <Persons persons={persons} newSearch={newSearch} handleDelete={handleDelete} />
        </div>
    );
};

export default App;
