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

const validators = {
	string: (a) => typeof a == 'string',
	uuid: (a) => validators.string(a),
	date: (a) => validators.string(a), 
}

const model = {
	books: {
		title: validators.string,
		author: validators.uuid,
		category: validators.uuid,
	},
	authors: {
		name: validators.string,
		birthdate: validators.date
	},
	categories: {
		title: validators.string,
	}
}


const db = await JSONFilePreset('db.json', defaultData)

//Books endpoints
app.get('/books', async (_req, res) => {
	console.log("GET Books");

	res.status(200).send(db.data.books);
})

app.get('/books/:id', async (req, res) => {
	console.log("GET Book " + req.params.id)
	
	const book = db.data.books.find(b => b.id == req.params.id)

	if(book != undefined) {
		console.log(book);
		res.status(200).send(book)
	} else {
		console.log("Not found");
		res.sendStatus(404);
	}
})

app.post('/books', (req, res) => {
	console.log("POST Books");

	if(validate(req.body, model.books)){

		req.body.id = uuid();

		console.log("Inserting into db")
		console.log(req.body)

		db.data.books.push(req.body);
		db.write()
		res.sendStatus(201);
	} else {
		console.log("Bad request")

		res.sendStatus(400);
	}
});

//Autors endpoints
app.get('/authors', async (_req, res) => {
	console.log("GET Authors");

	res.status(200).send(db.data.authors);
})

app.post('/authors', (req, res) => {
	console.log("POST Authors");

	if(validate(req.body, args)){

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
});

//Categories endpoints
app.get('/categories', async (_req, res) => {
	console.log("GET Categories");

	res.status(200).send(db.data.categories);
})

app.post('/categories', (req, res) => {
	console.log("POST Categories");

	if(validate(req.body, model.categories)){

		req.body.id = uuid();

		console.log("Inserting into db")
		console.log(req.body)

		db.data.categories.push(req.body);
		db.write()
		res.sendStatus(201);
	} else {
		console.log("Bad request")

		res.sendStatus(400);
	}
});

//start the server
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
