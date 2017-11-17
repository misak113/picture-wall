
const google = require('googleapis');

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
		const response = await new Promise((resolve, reject) => this.googleDrive.files.get(
			{
				fileId: file.id,
				mimeType: 'text/plain',
				alt: 'media',
			},
			(error, response) => error ? reject(error) : resolve(response)
		));
		return typeof response === 'object' ? JSON.stringify(response) : response;
	}

	async saveFile(name, data) {
		const files = await this.listFiles();
		const file = files.find((file) => file.name === name);
		if (file) {
			await new Promise((resolve, reject) => this.googleDrive.files.update(
				{
					fileId: file.id,
					media: {
						mimeType: 'text/plain',
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
						mimeType: 'text/plain',
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
