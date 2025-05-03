import { useState, useEffect, Fragment } from "react";
import axios from "axios";
import phonebookService from "./services/phonebook";

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
                    <Fragment key={e.id}>
                        <div key={e.id}>
                            {e.name} {e.number}
                        </div>
                        <button onClick={() => handleDelete(e.id, e.name)}>delete</button>
                    </Fragment>
                ))}
        </div>
    );
};

const App = () => {
    const [persons, setPersons] = useState([]);
    const [newSearch, setSearch] = useState("");
    const [newName, setNewName] = useState("");
    const [newNumber, setNewNumber] = useState("");

    useEffect(() => {
        phonebookService.getAll().then((response) => {
            setPersons(response);
        });
    }, []);

    const handleDelete = (id, name) => {
        if (window.confirm(`Delete ${name}?`)) {
            phonebookService.remove(id).then((_) => {
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
                phonebookService.update(found.id, { ...found, number: newNumber });
                setPersons(persons.map((p) => p.id == found.id ? { ...found, number: newNumber } : p))
            }
        } else {
            phonebookService.create(nameObject).then((r) => {
                console.log(r);
                setPersons(persons.concat(r));
                setNewName("");
                setNewNumber("");
            });
        }
    };

    return (
        <div>
            <h2>Phonebook</h2>
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
