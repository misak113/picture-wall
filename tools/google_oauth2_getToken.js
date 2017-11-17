
const fs = require('fs');
const readline = require('readline');
const google = require('googleapis');

const SCOPES = ['https://www.googleapis.com/auth/drive'];

(async function () {
	const configPath = process.argv[2];
	if (!configPath) {
		console.error('First argument must be path to config file: https://developers.google.com/drive/v2/web/quickstart/nodejs');
		process.exit(1);
	}
	const content = fs.readFileSync(configPath);
	const oauth2Client = await authorize(JSON.parse(content));
})();

async function authorize(credentials, callback) {
	const clientId = credentials.installed.client_id;
	const clientSecret = credentials.installed.client_secret;
	const redirectUrl = credentials.installed.redirect_uris[0];
	const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUrl);

	const token = await getToken(oauth2Client);
	console.log(JSON.stringify(token));
	oauth2Client.setCredentials(token);
	return oauth2Client;
}

async function getToken(oauth2Client) {
	const authUrl = oauth2Client.generateAuthUrl({
		access_type: 'offline',
		scope: SCOPES
	});
	console.log('Authorize this app by visiting this url:', authUrl);
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});
	const code = await new Promise((resolve) => rl.question('Enter the code from that page here: ', resolve));
	rl.close();
	const token = await new Promise((resolve, reject) => oauth2Client.getToken(
		code,
		(error, token) => error ? reject(error) : resolve(token),
	));
	return token;
}
