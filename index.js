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
app.get('/api/v1/books', async (req, res) => {
	console.log("GET Books");

	if(req.query.q != undefined) {
		const q = req.query.q.toLowerCase();
		const books = db.data.books.filter(b => b.title.toLowerCase().includes(q));
		res.status(200).json({success: true, data: books});
	}
	else {
		res.status(200).json({success: true, data: db.data.books});
	}

})

app.post('/api/v1/books', (req, res) => {
	console.log("POST Books");

	if(validate(req.body, model.books)){

		req.body.id = uuid();

		console.log("Inserting into db")
		console.log(req.body)

		db.data.books.push(req.body);
		db.write()
		res.status(201).json({success: true, id: req.body.id});
	} else {
		console.log("Bad request")

		res.status(400).json({success: false});
	}
});

app.get('/api/v1/books/:id', async (req, res) => {
	console.log("GET Book " + req.params.id)
	
	const book = db.data.books.find(b => b.id == req.params.id)

	if(book != undefined) {
		console.log(book);
		res.status(200).json({success: true, data: book});
	} else {
		console.log("Not found");
		res.status(404).json({success: false});
	}
})

app.post('/api/v1/books/:id', async (req, res) => {
	console.log("POST Book " + req.params.id)

	//find book
	const i = db.data.books.findIndex(b => b.id == req.params.id)
	if(i != -1) {

		//validate data
		if(validate(req.body, model.books)) {
			
			//update entry
			const book = db.data.books[i];
			req.body.id = book.id;

			db.data.books[i] = req.body;
			db.write();
			res.status(200).json({success: true, data: req.body});

		} else {
			console.log("Bad request")
			res.status(400).json({success: false});
		}

	} else {
		console.log("Not found");
		res.status(404).json({success: false});
	}
})


app.delete('/api/v1/books/:id', async (req, res) => {
	console.log("DELETE Book " + req.params.id)

	const i = db.data.books.findIndex(b => b.id == req.params.id)

	if(i != -1){
		db.data.books.splice(i, 1)
		db.write()
		res.status(200).json({success: true});
	} else {
		res.status(404).json({success: false});
	}
})

//Autors endpoints
app.get('/api/v1/authors', async (_req, res) => {
	console.log("GET Authors");

	if(_req.query.q != undefined) {
		const q = _req.query.q.toLowerCase();
		const authors = db.data.authors.filter(b => b.name.toLowerCase().includes(q));
		res.status(200).json({success: true, data: authors});
	}
	else {
		res.status(200).json({success: true, data: db.data.authors});
	}
})

app.post('/api/v1/authors', (req, res) => {
	console.log("POST Authors");

	if(validate(req.body, model.authors)){

		req.body.id = uuid();
		req.body.birthdate = moment(req.body.birthdate).format("YYYY-MM-DD")

		console.log("Inserting into db")
		console.log(req.body)

		db.data.authors.push(req.body);
		db.write()
		res.status(201).json({success: true, id: req.body.id});
	} else {
		console.log("Bad request")

		res.status(400).json({success: false});
	}
});

app.get('/api/v1/authors/:id', async (req, res) => {
	console.log("GET Author " + req.params.id)
	
	const author = db.data.authors.find(b => b.id == req.params.id)

	if(author != undefined) {
		console.log(author);
		res.status(200).json({success: true, data: author});
	} else {
		console.log("Not found");
		res.status(404).json({success: false});
	}
})

app.post('/api/v1/authors/:id', async (req, res) => {
	console.log("POST Author " + req.params.id)

	//find author
	const i = db.data.authors.findIndex(b => b.id == req.params.id)
	if(i != -1) {

		//validate data
		if(validate(req.body, model.authors)) {
			
			//update entry
			const author = db.data.authors[i];
			req.body.id = author.id;
			req.body.birthdate = moment(req.body.birthdate).format("YYYY-MM-DD")

			db.data.authors[i] = req.body;
			db.write();
			res.status(200).json({success: true, data: req.body});

		} else {
			console.log("Bad request")
			res.status(400).json({success: false});
		}

	} else {
		console.log("Not found");
		res.status(404).json({success: false});
	}
})


app.delete('/api/v1/authors/:id', async (req, res) => {
	console.log("DELETE Author " + req.params.id)

	const i = db.data.authors.findIndex(b => b.id == req.params.id)

	if(i != -1){
		db.data.authors.splice(i, 1)
		db.write()
		res.status(200).json({success: true});
	} else {
		res.status(404).json({success: false});
	}
})

//Categories endpoints
app.get('/api/v1/categories', async (_req, res) => {
	console.log("GET Categories");

	if(_req.query.q != undefined) {
		const q = _req.query.q.toLowerCase();
		const categories = db.data.categories.filter(b => b.title.toLowerCase().includes(q));
		res.status(200).json({success: true, data: categories});
	}
	else {
		res.status(200).json({success: true, data: db.data.categories});
	}
})

app.post('/api/v1/categories', (req, res) => {
	console.log("POST Categories");

	if(validate(req.body, model.categories)){

		req.body.id = uuid();

		console.log("Inserting into db")
		console.log(req.body)

		db.data.categories.push(req.body);
		db.write()
		res.status(201).json({success: true, id: req.body.id});
	} else {
		console.log("Bad request")

		res.status(400).json({success: false});
	}
});

app.get('/api/v1/categories/:id', async (req, res) => {
	console.log("GET Category " + req.params.id)
	
	const category = db.data.categories.find(b => b.id == req.params.id)

	if(category != undefined) {
		console.log(category);
		res.status(200).json({success: true, data: category});
	} else {
		console.log("Not found");
		res.status(404).json({success: false});
	}
})

app.post('/api/v1/categories/:id', async (req, res) => {
	console.log("POST Category " + req.params.id)

	//find author
	const i = db.data.categories.findIndex(b => b.id == req.params.id)
	if(i != -1) {

		//validate data
		if(validate(req.body, model.categories)) {
			
			//update entry
			const category = db.data.categories[i];
			req.body.id = category.id;

			db.data.categories[i] = req.body;
			db.write();
			res.status(200).json({success: true, data: req.body});

		} else {
			console.log("Bad request")
			res.status(400).json({success: false});
		}

	} else {
		console.log("Not found");
		res.status(404).json({success: false});
	}
})


app.delete('/api/v1/categories/:id', async (req, res) => {
	console.log("DELETE Category " + req.params.id)

	const i = db.data.categories.findIndex(b => b.id == req.params.id)

	if(i != -1){
		db.data.categories.splice(i, 1)
		db.write()
		res.status(200).json({success: true});
	} else {
		res.status(404).json({success: false});
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
