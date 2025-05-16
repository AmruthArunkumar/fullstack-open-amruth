const express = require("express");
var morgan = require("morgan");
const app = express();

app.use(express.json());
app.use((req, res, next) => {
    req.requestTime = new Date().toString();
    next();
});
morgan.token("data", function (req, res) {
    return JSON.stringify(req.body);
});
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :data"));

data = [
    {
        id: "1",
        name: "Arto Hellas",
        number: "040-123456",
    },
    {
        id: "2",
        name: "Ada Lovelace",
        number: "39-44-5323523",
    },
    {
        id: "3",
        name: "Dan Abramov",
        number: "12-43-234345",
    },
    {
        id: "4",
        name: "Mary Poppendieck",
        number: "39-23-6423122",
    },
];

app.get("/api/persons", (request, response) => {
    response.json(data);
});

app.get("/api/persons/:id", (request, response) => {
    const id = request.params.id;
    const person = data.find((d) => d.id === id);
    if (person) {
        response.json(person);
    } else {
        response.status(404).end();
    }
});

app.delete("/api/persons/:id", (request, response) => {
    const id = request.params.id;
    data = data.filter((d) => d.id !== id);
    response.status(204).end();
});

app.post("/api/persons", (request, response) => {
    const body = request.body;

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: body.number ? "name missing" : "number missing",
        });
    }

    if (data.find((d) => d.name === body.name)) {
        return response.status(400).json({
            error: "name must be unique",
        });
    }

    const person = {
        ...body,
        id: Math.floor(Math.random() * 1000000),
    };
    data = data.concat(person);
    response.json(person);
});

app.get("/info", (request, response) => {
    response.send(`
        <div>Phonebook has info for ${data.length} people</div>
        <div>${request.requestTime}</div>
    `);
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
