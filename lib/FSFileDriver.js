
const fs = require('fs');

class FSFileDriver {

	constructor(fileDirPath) {
		this.fileDirPath = fileDirPath;
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
		await new Promise((resolve, reject) => fs.writeFile(
			filePath,
			data,
			(error) => error ? reject(error) : resolve()
		));
	}
}
module.exports = FSFileDriver;
