
const GDriveDataDriver = require('./GDriveDataDriver');
const FSDataDriver = require('./FSDataDriver');
const os = require('os');
const fs = require('fs');

class GDriveCachedDataDriver {

	constructor({ credentials, token, folderId }, cacheDataPath = os.tmpdir() + '/data') {
		this.gdriveDataDriver = new GDriveDataDriver({ credentials, token, folderId });
		this.fsDataDriver = new FSDataDriver(cacheDataPath);
	}

	async getData(type, defaultValue = []) {
		const fsData = await this.fsDataDriver.getData(type, null);
		if (fsData === null) {
			const gdriveData = await this.gdriveDataDriver.getData(type, defaultValue);
			await this.fsDataDriver.saveData(type, gdriveData);
			return gdriveData;
		} else {
			return fsData;
		}
	}

	async saveData(type, data) {
		await this.fsDataDriver.saveData(type, data);
		this.gdriveDataDriver.saveData(type, data); // do not wait for response
	}
}
module.exports = GDriveCachedDataDriver;
