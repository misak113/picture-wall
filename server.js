
const express = require('express');
const bodyParser = require('body-parser');
const basicAuth = require('basic-auth');
const fs = require('fs');

const dataPath = __dirname + '/data';

const app = express();

const auth = function (req, res, next) {
	function unauthorized(res) {
		res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
		return res.send(401);
	};

	const user = basicAuth(req);

	if (!user || !user.name || !user.pass) {
		return unauthorized(res);
	};

	if (user.name === 'bonami' && user.pass === 'bonamijenejlepsi') {
		res.cookie(
			'Authorization',
			req.headers['authorization'].substring('Basic '.length),
			{ maxAge: 60 * 60 * 1E3, httpOnly: false, domain: '' }
		);
		return next();
	} else {
		return unauthorized(res);
	};
};

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(express.static('dist'));
app.use('/admin', auth);
app.use('/admin', auth, express.static('public'));
app.use('/admin', auth, express.static('dist'));

app.get('/positions', (req, res) => {
	res.send(JSON.parse(fs.readFileSync(dataPath + '/positions.json')));
});
app.post('/admin/positions', auth, (req, res) => {
	const positions = req.body;
	fs.writeFileSync(dataPath + '/positions.json', JSON.stringify(positions, null, 2));
	res.send({
		status: "ok"
	});
});
app.get('/persons', (req, res) => {
	res.send(JSON.parse(fs.readFileSync(dataPath + '/persons.json')));
});
app.post('/admin/person/:personId', auth, (req, res) => {
	const newPerson = req.body;
	const currentPersons = JSON.parse(fs.readFileSync(dataPath + '/persons.json'));
	const persons = currentPersons.filter((person) => person.id !== newPerson.id);
	persons.push(newPerson);
	fs.writeFileSync(dataPath + '/persons.json', JSON.stringify(persons, null, 2));
	res.send({
		status: "ok"
	});
});
app.delete('/admin/person/:personId', auth, (req, res) => {
	const personId = parseInt(req.params.personId);
	const currentPersons = JSON.parse(fs.readFileSync(dataPath + '/persons.json'));
	const persons = currentPersons.filter((person) => person.id !== personId);
	fs.writeFileSync(dataPath + '/persons.json', JSON.stringify(persons, null, 2));
	res.send({
		status: "ok"
	});
});

const port = process.env.PORT || 8083;
app.listen(port, () => {
	console.log('Server listen on port ' + port);
});
