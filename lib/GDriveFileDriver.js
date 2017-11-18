
const google = require('googleapis');
const os = require('os');
const fs = require('fs');

class GDriveFileDriver {

	constructor({ credentials, token, folderId }) {
		const clientId = credentials.installed.client_id;
		const clientSecret = credentials.installed.client_secret;
		const redirectUrl = credentials.installed.redirect_uris[0];
		const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUrl);
		oauth2Client.setCredentials(token);
		this.googleDrive = google.drive({
			version: 'v3',
			auth: oauth2Client
		});
		this.folderId = folderId;
	}

	async getFile(name) {
		const files = await this.listFiles();
		const file = files.find((file) => file.name === name);
		if (!file) {
			throw new Error(`File ${name} does not exists`);
		}
		const request = this.googleDrive.files.get({
			fileId: file.id,
			alt: 'media',
		});
		const tmpFilePath = os.tmpdir() + '/' + Math.random();
		const tmpWriteStream = fs.createWriteStream(tmpFilePath);
		await new Promise((resolve, reject) => request
			.on('end', () => resolve())
			.on('error', (error) => reject(error))
			.pipe(tmpWriteStream)
		);
		return new Promise((resolve, reject) => fs.readFile(
			tmpFilePath,
			(error, result) => error ? reject(error) : resolve(result.toString('binary')),
		));
	}

	async saveFile(name, data, mimeType = 'text/plain') {
		const files = await this.listFiles();
		const file = files.find((file) => file.name === name);
		if (file) {
			await new Promise((resolve, reject) => this.googleDrive.files.update(
				{
					fileId: file.id,
					media: {
						mimeType,
						body: data
					},
				},
				(error) => error ? reject(error) : resolve()
			));
		} else {
			await new Promise((resolve, reject) => this.googleDrive.files.create(
				{
					resource: {
						name,
						parents: [this.folderId],
					},
					media: {
						mimeType,
						body: data
					},
				},
				(error) => error ? reject(error) : resolve()
			));
		}
	}

	async listFiles() {
		const response = await new Promise((resolve, reject) => this.googleDrive.files.list(
			{
				q: `'${this.folderId}' in parents`,
			},
			(error, response) => error ? reject(error) : resolve(response)),
		);
		return response.files;
	}
}
module.exports = GDriveFileDriver;
