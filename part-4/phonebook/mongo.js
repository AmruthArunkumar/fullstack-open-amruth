const mongoose = require("mongoose");

const mode = process.argv.length === 3 ? "list" : "add";

if (process.argv.length < 3) {
    console.log("give password as argument");
    process.exit(1);
}

const password = process.argv[2];
const databaseName = "phonebookDB";

const url = `mongodb+srv://amruth1618:${password}@cluster0.2tseyra.mongodb.net/${databaseName}?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
});

const Person = mongoose.model("Person", personSchema);

if (mode === "add") {
    const name = process.argv[3];
    const number = process.argv[4];

    const person = new Person({
        name,
        number,
    });

    person.save().then((result) => {
        console.log(`added ${name} number ${number} to phonebook`);
        mongoose.connection.close();
    });
} else {
    Person.find({}).then((result) => {
        console.log("phonebook:");
        result.forEach((person) => {
            console.log(person.name, person.number);
        });
        mongoose.connection.close();
    });
}
