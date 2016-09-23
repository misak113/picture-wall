
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

const port = process.env.PORT || 8083;
app.listen(port, () => {
	console.log('Server listen on port ' + port);
});
