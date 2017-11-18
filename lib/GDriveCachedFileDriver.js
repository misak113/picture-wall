
const GDriveFileDriver = require('./GDriveFileDriver');
const FSFileDriver = require('./FSFileDriver');
const os = require('os');
const fs = require('fs');

class GDriveCachedFileDriver {

	constructor({ credentials, token, folderId }, cacheFilePath = os.tmpdir() + '/upload') {
		this.gdriveFileDriver = new GDriveFileDriver({ credentials, token, folderId });
		this.fsFileDriver = new FSFileDriver(cacheFilePath);
	}

	async getFile(name) {
		try {
			return await this.fsFileDriver.getFile(name);
		} catch (error) {
			const gdriveContent = await this.gdriveFileDriver.getFile(name);
			await this.fsFileDriver.saveFile(name, gdriveContent);
			return gdriveContent;
		}
	}

	async saveFile(name, content) {
		await this.fsFileDriver.saveFile(name, content);
		this.gdriveFileDriver.saveFile(name, content); // do not wait for response
	}
}
module.exports = GDriveCachedFileDriver;
