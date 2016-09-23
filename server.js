
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const dataPath = __dirname + '/data';

const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(express.static('dist'));

app.get('/positions', (req, res) => {
	res.send(JSON.parse(fs.readFileSync(dataPath + '/positions.json')));
});
app.post('/positions', (req, res) => {
	const positions = req.body;
	fs.writeFileSync(dataPath + '/positions.json', JSON.stringify(positions, null, 2));
	res.send({
		status: "ok"
	});
});
app.get('/persons', (req, res) => {
	res.send(JSON.parse(fs.readFileSync(dataPath + '/persons.json')));
});
app.post('/person/:personId', (req, res) => {
	const newPerson = req.body;
	const currentPersons = JSON.parse(fs.readFileSync(dataPath + '/persons.json'));
	const persons = currentPersons.filter((person) => person.id !== newPerson.id);
	persons.push(newPerson);
	fs.writeFileSync(dataPath + '/persons.json', JSON.stringify(persons, null, 2));
	res.send({
		status: "ok"
	});
});

const port = process.env.PORT || 8083;
app.listen(port, () => {
	console.log('Server listen on port ' + port);
});
