
const fs = require('fs');
const crypto = require('crypto');

class FSDataDriver {

	constructor(dataPath) {
		this.dataPath = dataPath;
		if (!fs.existsSync(dataPath)) {
			fs.mkdirSync(dataPath);
		}
		if (!fs.existsSync(dataPath + '/backup')) {
			fs.mkdirSync(dataPath + '/backup');
		}
	}

	async getData(type, defaultValue = []) {
		const dataFilePath = this.dataPath + '/' + type + '.json';
		try {
			const data = await new Promise((resolve, reject) => fs.readFile(
				dataFilePath,
				(error, data) => error ? reject(error) : resolve(data)
			));
			return JSON.parse(data);
		} catch (e) {
			return defaultValue;
		}
	}

	async saveData(type, data) {
		const encodedData = JSON.stringify(data, null, 2);
		await new Promise((resolve, reject) => fs.writeFile(
			this.dataPath + '/' + type + '.json',
			encodedData,
			{ encoding: 'utf8' },
			(error) => error ? reject(error) : resolve()
		));
		await new Promise((resolve, reject) => fs.writeFile(
			this.dataPath + '/backup/' + type + '.' + this.computeFileHash(encodedData) + '.json',
			encodedData,
			{ encoding: 'utf8' },
			(error) => error ? reject(error) : resolve()
		));
	}

	computeFileHash(fileData) {
		const md5sum = crypto.createHash('md5');
		md5sum.update(fileData);
		return md5sum.digest('hex');
	}
}
module.exports = FSDataDriver;
