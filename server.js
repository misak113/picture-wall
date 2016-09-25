
const express = require('express');
const bodyParser = require('body-parser');
const basicAuth = require('basic-auth');
const fs = require('fs');
const crypto = require('crypto');
const multer = require('multer');

const dataPath = __dirname + '/data';
const uploadPath = __dirname + '/upload';

const app = express();

const auth = function (req, res, next) {
	function unauthorized(res) {
		res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
		return res.send(401);
	};

	const credentials = basicAuth(req);

	if (!credentials || !credentials.name || !credentials.pass) {
		return unauthorized(res);
	};

	const authenticated = getData('users').filter((user) => {
		return credentials.name === user.username && credentials.pass === user.password
	}).length > 0;

	if (authenticated) {
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

function getData(type) {
	const dataFilePath = dataPath + '/' + type + '.json';
	try {
		return JSON.parse(fs.readFileSync(dataFilePath))
	} catch (e) {
		return [];
	}
}

function saveData(type, data) {
	const encodedData = JSON.stringify(data, null, 2);
	fs.writeFileSync(dataPath + '/' + type + '.json', encodedData);
	fs.writeFileSync(
		dataPath + '/backup/' + type + '.' + computeFileHash(encodedData) + '.json',
		encodedData
	);
}

function computeFileHash(fileData) {
	const md5sum = crypto.createHash('md5');
	md5sum.update(fileData);
	return md5sum.digest('hex');
}

const upload = multer({ dest: __dirname + '/tmp' });

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(express.static('dist'));
app.use(express.static('upload'));
app.use('/admin', auth);
app.use('/admin', auth, express.static('public'));
app.use('/admin', auth, express.static('dist'));
app.use('/admin', auth, express.static('upload'));

app.get('/positions', (req, res) => {
	res.send(getData('positions'));
});
app.post('/admin/positions', auth, (req, res) => {
	const positions = req.body;
	saveData('positions', positions);
	res.send({
		status: "ok"
	});
});
app.get('/persons', (req, res) => {
	res.send(getData('persons'));
});
app.post('/admin/person/:personId', auth, (req, res) => {
	const newPerson = req.body;
	const currentPersons = getData('persons');
	const persons = currentPersons.filter((person) => person.id !== newPerson.id);
	persons.push(newPerson);
	saveData('persons', persons);
	res.send({
		status: "ok"
	});
});
app.delete('/admin/person/:personId', auth, (req, res) => {
	const personId = parseInt(req.params.personId);
	const currentPersons = getData('persons');
	const persons = currentPersons.filter((person) => person.id !== personId);
	saveData('persons', persons);
	res.send({
		status: "ok"
	});
});
app.post('/admin/picture', auth, upload.single('file'), (req, res) => {
	const file = req.file;
	fs.readFile(file.path, function (error, data) {
		if (error) {
			throw error;
		}
		const lastIndexOfDot = file.originalname.lastIndexOf('.');
		const extension = lastIndexOfDot !== -1 ? file.originalname.substring(lastIndexOfDot) : '';
		const fileHash = computeFileHash(data);
		const uploadFileName = fileHash + extension;
		const uploadFilePath = uploadPath + '/picture/' + uploadFileName;
		fs.writeFile(uploadFilePath, data, function (error) {
			if (error) {
				throw error;
			}
			res.send({
				fileName: uploadFileName
			});
		});
	});
});

const port = process.env.PORT || 8083;
app.listen(port, () => {
	console.log('Server listen on port ' + port);
});
