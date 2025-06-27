require("dotenv").config();
const express = require("express");
var morgan = require("morgan");
const Person = require("./models/person");
const app = express();

app.use(express.json());
app.use((req, res, next) => {
    req.requestTime = new Date().toString();
    next();
});
app.use(express.static("dist"));
morgan.token("data", function (req, res) {
    return JSON.stringify(req.body);
});
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :data"));

app.get("/api/persons", (request, response) => {
    Person.find({}).then((people) => {
        response.json(people);
    });
});

app.get("/api/persons/:id", (request, response, next) => {
    Person.findById(request.params.id)
        .then((person) => {
            if (person) {
                response.json(person);
            } else {
                response.status(404).end();
            }
        })
        .catch((error) => {
            next(error);
        });
});

app.delete("/api/persons/:id", (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then((result) => {
            response.status(204).end();
        })
        .catch((error) => next(error));
});

app.post("/api/persons", (request, response, next) => {
    const body = request.body;

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: body.number ? "name missing" : "number missing",
        });
    }

    const person = new Person({
        ...body,
    });

    person
        .save()
        .then((person) => {
            response.json(person);
        })
        .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response) => {
    const body = request.body;

    Person.findById(request.params.id)
        .then((person) => {
            if (!person) {
                response.status(404).end();
            }

            person.name = body.name;
            person.number = body.number;

            person.save().then((person) => {
                response.json(person);
            });
        })
        .catch((error) => {
            next(error);
        });
});

app.get("/info", (request, response) => {
    Person.find({}).then((people) => {
        response.send(`
            <div>Phonebook has info for ${people.length} people</div>
            <div>${request.requestTime}</div>
        `);
    });
});

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
    console.log(error.message);

    if (error.name === "CastError") {
        return response.status(400).send({ error: "malformatted id" });
    } else if (error.name === "ValidationError") {
        return response.status(400).json({ error: error.message });
    }

    next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
