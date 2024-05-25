import { log } from 'console';
import express from 'express';
import fs from 'fs';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

const readData = () => {
   try {
    const data = fs.readFileSync("./db.json");
    return JSON.parse(data);
   } catch (error) {
    console.log(error);
   }
}
const writeData = (data) => {
    try {
        fs.writeFileSync("./db.json", JSON.stringify(data));
       } catch (error) {
        console.log(error);
       }
}
app.get("/", (req, res) => {
    res.send("Welcome to first project the node js!!");
})

app.get("/books", (req, res) => {
    const data = readData();
    res.json(data.books);
})

app.get("/books/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const book = data.books.find((book) => book.id === id);
    res.json(book);
})
app.post("/books", (req, res) => {
    const data = readData();
    const body = req.body;
    const newBook = {
        id: data.books.length + 1,
        ...body,
    };
    data.books.push(newBook);
    writeData(data);
    res.json(newBook);
})

app.put("/books/:id", (req, res) => {
    const data = readData();
    const body = req.body;
    const id = parseInt(req.params.id);
    
    const bookIndex = data.books.findIndex((book) => book.id === id);

    if (bookIndex !== -1) {
        data.books[bookIndex] = {
            ...data.books[bookIndex], // Accede correctamente al libro existente
            ...body, // Fusiona los nuevos datos del cuerpo
        };
        
        writeData(data);
        res.json({ message: "Book updated successfully" });
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});

app.delete("/books/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const bookIndex = data.books.findIndex((book) => book.id === id);
    data.books.splice(bookIndex, 1);
    writeData(data);
    res.json( { message: "Book delete successfully" } );

})

app.listen(3000, () => {
    console.log('Server lintening on port 3000');
});