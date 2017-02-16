
const sharp = require('sharp');

class SharpDriver {

	resize(sourcePath, targetPath, { width, height }) {
		return new Promise((resolve, reject) => {
			sharp(sourcePath)
			.resize(width, height)
			.toFile(targetPath, (error) => {
				if (error) {
					reject(error);
				} else {
					resolve();
				}
			});
		});
	}
}
module.exports = SharpDriver;
