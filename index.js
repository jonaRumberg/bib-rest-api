import { JSONFilePreset } from 'lowdb/node';
import express from 'express';
import {v4 as uuid } from 'uuid';

const app = express()
app.use(express.json()) // for parsing application/json

const PORT = 8080;

const defaultData = { 
	books: [],
	authors: [],
	categories: []
}

const model = {
	books: {},
	authors: {
		name: (a) => typeof a == 'string',
		birthdate: (a) => true
	},
	categories: {}
}


const db = await JSONFilePreset('db.json', defaultData)

//Books endpoints
app.get('/books', async (_req, res) => {
	console.log("GET Books");

	res.status(200).send(db.data.books);
})

//Autors endpoints
app.get('/authors', async (_req, res) => {
	console.log("GET Authors");

	res.status(200).send(db.data.authors);
})

app.post('/authors', async (req, res) => {
	console.log("POST Authors");

	if(validate(req.body, model.authors)){

		req.body.id = uuid();

		console.log("Inserting into db")
		console.log(req.body)

		db.data.authors.push(req.body);
		db.write()
		res.sendStatus(201);
	} else {
		console.log("Bad request")

		res.sendStatus(400);
	}
})

//Categories endpoints
app.get('/categories', async (_req, res) => {
	console.log("GET Categories");

	res.status(200).send(db.data.categories);
})

app.listen(PORT, () => {
	console.log("Server is running on port: " + PORT)
})




//function to iterate over input object and check against validator functions
function validate(obj, args) {
	// iterate over fields
	for (const [key, validator] of Object.entries(args)) {
		if (obj[key] == undefined) {
			return false;
		}
		if (!validator(obj[key])) {
			return false;
		}
	}

	return true;
}
