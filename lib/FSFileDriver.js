
const fs = require('fs');
const path = require('path');

class FSFileDriver {

	constructor(fileDirPath) {
		this.fileDirPath = fileDirPath;
		if (!fs.existsSync(fileDirPath)) {
			fs.mkdirSync(fileDirPath);
		}
	}

	async getFile(name) {
		const filePath = this.fileDirPath + name;
		return await new Promise((resolve, reject) => fs.readFile(
			filePath,
			(error, data) => error ? reject(error) : resolve(data)
		));
	}

	async saveFile(name, data) {
		const filePath = this.fileDirPath + name;
		await this.ensureDirectory(path.dirname(filePath));
		await new Promise((resolve, reject) => fs.writeFile(
			filePath,
			data,
			(error) => error ? reject(error) : resolve()
		));
	}

	async ensureDirectory(path) {
		const exists = await new Promise((resolve) => fs.exists(path, (exists) => resolve(exists)));
		if (!exists) {
			await new Promise((resolve, reject) => fs.mkdir(path, (error) => error ? reject(error) : resolve()));
		}
	}
}
module.exports = FSFileDriver;
