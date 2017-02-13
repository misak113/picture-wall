
const express = require('express');
const bodyParser = require('body-parser');
const basicAuth = require('basic-auth');
const fs = require('fs');
const crypto = require('crypto');
const multer = require('multer');
const images = require('images');

const configPath = process.argv[2] === '--config' ? process.argv[3] : __dirname + '/config.json';
const config = require(configPath);

const DataDriver = require(config.dataDriver.module);
const FileDriver = require(config.fileDriver.module);

const dataDriver = new DataDriver(...config.dataDriver.args);
const fileDriver = new FileDriver(...config.fileDriver.args);

const app = express();

const auth = async function (req, res, next) {
	function unauthorized(res) {
		res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
		return res.send(401);
	};

	const credentials = basicAuth(req);

	if (!credentials || !credentials.name || !credentials.pass) {
		return unauthorized(res);
	};

	const users = await dataDriver.getData('users');
	const authenticated = users.filter((user) => {
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

function computeFileHash(fileData) {
	const md5sum = crypto.createHash('md5');
	md5sum.update(fileData);
	return md5sum.digest('hex');
}

function getExtension(fileName) {
	const lastIndexOfDot = fileName.lastIndexOf('.');
	return lastIndexOfDot !== -1 ? fileName.substring(lastIndexOfDot) : '';
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

app.get('/positions', async function (req, res) {
	res.send(await dataDriver.getData('positions'));
});
app.post('/admin/positions', auth, async function (req, res) {
	const positions = req.body;
	await dataDriver.saveData('positions', positions);
	res.send({
		status: "ok"
	});
});
app.get('/persons', async function (req, res) {
	res.send(await dataDriver.getData('persons'));
});
app.post('/admin/person/:personId', auth, async function (req, res) {
	const newPerson = req.body;
	const currentPersons = await dataDriver.getData('persons');
	const persons = currentPersons.filter((person) => person.id !== newPerson.id);
	persons.push(newPerson);
	await dataDriver.saveData('persons', persons);
	res.send({
		status: "ok"
	});
});
app.delete('/admin/person/:personId', auth, async function (req, res) {
	const personId = parseInt(req.params.personId);
	const currentPositions = await dataDriver.getData('positions');
	const positions = currentPositions.filter((position) => position.personId !== personId);
	await dataDriver.saveData('positions', positions);
	const currentPersons = await dataDriver.getData('persons');
	const persons = currentPersons.filter((person) => person.id !== personId);
	await dataDriver.saveData('persons', persons);
	res.send({
		status: "ok"
	});
});
app.post('/admin/picture', auth, upload.single('file'), (req, res) => {
	const file = req.file;
	fs.readFile(file.path, async function (error, data) {
		if (error) {
			throw error;
		}
		const extension = getExtension(file.originalname);
		const fileHash = computeFileHash(data);
		const uploadFileName = fileHash + extension;
		const uploadFilePath = '/picture/' + uploadFileName;
		await fileDriver.saveFile(uploadFilePath, data)
		res.send({
			fileName: uploadFileName
		});
	});
});
app.get(/\/picture\/resized\/(\d+)x(\d+)_(.+)/, (req, res) => {
	const width = parseInt(req.params[0]);
	const height = parseInt(req.params[1]);
	const fileName = req.params[2];
	const extension = getExtension(fileName);
	const sourceFilePath = '/picture/' + fileName;
	const filePath = '/picture/resized/' + width + 'x' + height + '_' + fileName;
	res.header('Content-Type', 'image/' + extension.substring(1));
	const sourceImage = images(sourceFilePath)
	const sourceWidth = sourceImage.width();
	const sourceHeight = sourceImage.height();
	let targetWidth, targetHeight;
	if (sourceWidth / sourceHeight < width / height) {
		targetWidth = width;
		targetHeight = parseInt(width * sourceHeight / sourceWidth);
	} else {
		targetWidth = parseInt(height * sourceWidth / sourceHeight);
		targetHeight = height;
	}
	sourceImage.resize(targetWidth, targetHeight);
	const destImage = images(
		sourceImage,
		targetWidth > width ? parseInt((targetWidth - width) / 2) : 0,
		targetHeight > height ? parseInt((targetHeight - height) / 2) : 0,
		width,
		height
	);
	destImage
	.saveAsync(filePath, (error) => {
		if (error) {
			console.error(error);
			fileDriver.getFile(sourceFilePath).then((data) => res.status(500).send(data));
		} else {
			fileDriver.getFile(filePath).then((data) => res.send(data));
		}
	});
});
app.get('/settings', async function (req, res) {
	res.send(await dataDriver.getData('settings', {}));
});
app.post('/admin/settings', auth, async function (req, res) {
	const settings = req.body;
	await dataDriver.saveData('settings', settings);
	res.send({
		status: "ok"
	});
});

const port = process.env.PORT || 8083;
app.listen(port, () => {
	console.log('Server listen on port ' + port);
});
