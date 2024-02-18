import { JSONFilePreset } from 'lowdb/node';
import express from 'express';
import moment from 'moment';
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
	uuid: {
		books: (a) => 
			validators.string(a) &&
        	a.length == 36 &&
        	db.data.books.findIndex(b => b.id == a) != -1,
		authors: (a) => 
			validators.string(a) &&
        	a.length == 36 &&
        	db.data.authors.findIndex(b => b.id == a) != -1,
		categories: (a) => 
			validators.string(a) &&
			a.length == 36 &&
			db.data.categories.findIndex(b => b.id == a) != -1,
	},
	date: (a) => validators.string(a) && moment(a).isValid(), 
}

const model = {
	books: {
		title: validators.string,
		author: validators.uuid.authors,
		category: validators.uuid.categories,
	},
	authors: {
		name: validators.string,
		birthdate: validators.date
	},
	categories: {
		title: validators.string,
		description: validators.string,
	}
}


const db = await JSONFilePreset('db.json', defaultData)

//Books endpoints
app.get('/books', async (_req, res) => {
	console.log("GET Books");

	res.status(200).send(db.data.books);
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

app.post('/books/:id', async (req, res) => {
	console.log("POST Book " + req.params.id)
})


app.delete('/books/:id', async (req, res) => {
	console.log("DELETE Book " + req.params.id)

	const i = db.data.books.findIndex(b => b.id == req.params.id)

	if(i != -1){
		db.data.books.splice(i, 1)
		db.write()
		res.sendStatus(200)
	} else {
		res.sendStatus(404)
	}
})

//Autors endpoints
app.get('/authors', async (_req, res) => {
	console.log("GET Authors");

	res.status(200).send(db.data.authors);
})

app.post('/authors', (req, res) => {
	console.log("POST Authors");

	if(validate(req.body, model.authors)){

		req.body.id = uuid();
		req.body.birthdate = moment(req.body.birthdate).format("YYYY-MM-DD")

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

app.get('/authors/:id', async (req, res) => {
	console.log("GET Author " + req.params.id)
	
	const author = db.data.authors.find(b => b.id == req.params.id)

	if(author != undefined) {
		console.log(author);
		res.status(200).send(author)
	} else {
		console.log("Not found");
		res.sendStatus(404);
	}
})

app.post('/authors/:id', async (req, res) => {
	console.log("POST Author " + req.params.id)
})


app.delete('/authors/:id', async (req, res) => {
	console.log("DELETE Author " + req.params.id)

	const i = db.data.authors.findIndex(b => b.id == req.params.id)

	if(i != -1){
		db.data.authors.splice(i, 1)
		db.write()
		res.sendStatus(200)
	} else {
		res.sendStatus(404)
	}
})

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

app.get('/categories/:id', async (req, res) => {
	console.log("GET Category " + req.params.id)
	
	const category = db.data.categories.find(b => b.id == req.params.id)

	if(category != undefined) {
		console.log(category);
		res.status(200).send(category)
	} else {
		console.log("Not found");
		res.sendStatus(404);
	}
})

app.post('/categories/:id', async (req, res) => {
	console.log("POST Category " + req.params.id)
})


app.delete('/categories/:id', async (req, res) => {
	console.log("DELETE Category " + req.params.id)

	const i = db.data.authors.findIndex(b => b.id == req.params.id)

	if(i != -1){
		db.data.authors.splice(i, 1)
		db.write()
		res.sendStatus(200)
	} else {
		res.sendStatus(404)
	}
})

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
