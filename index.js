import { JSONFilePreset } from 'lowdb/node'
import express from 'express'

const app = express()

const PORT = 8080;

const defaultData = { 
	books: [],
	authors: [],
	categories: []
}
const db = await JSONFilePreset('db.json', defaultData)

//Books endpoints
app.get('/books', async (_req, res) => {
	console.log("GET Books");

	res.send(db.data.books);
})

//Autors endpoints
app.get('/authors', async (_req, res) => {
	console.log("GET Authors");

	res.send(db.data.authors);
})

//Categories endpoints
app.get('/categories', async (_req, res) => {
	console.log("GET Categories");

	res.send(db.data.categories);
})

app.listen(PORT, () => {
	console.log("Server is running on port: " + PORT)
})
