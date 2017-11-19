
const GDriveFileDriver = require('./GDriveFileDriver');
const crypto = require('crypto');

class GDriveDataDriver {

	constructor({ credentials, token, folderId }) {
		this.fileDriver = new GDriveFileDriver({ credentials, token, folderId });
	}

	async getData(type, defaultValue = []) {
		const dataFileName = type + '.json';
		try {
			const data = await this.fileDriver.getFile(dataFileName);
			return JSON.parse(data);
		} catch (e) {
			return defaultValue;
		}
	}

	async saveData(type, data) {
		const dataFileName = type + '.json';
		const encodedData = JSON.stringify(data, null, 2);
		await this.fileDriver.saveFile(dataFileName, encodedData, 'application/json', 'utf8');
		await this.fileDriver.saveFile('backup/' + type + '.' + this.computeFileHash(encodedData) + '.json', encodedData, 'application/json', 'utf8');
	}

	computeFileHash(fileData) {
		const md5sum = crypto.createHash('md5');
		md5sum.update(fileData);
		return md5sum.digest('hex');
	}
}
module.exports = GDriveDataDriver;
