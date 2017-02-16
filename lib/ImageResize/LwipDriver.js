
const lwip = require('lwip');
const fs = require('fs');

class LwipDriver {

	resize(sourcePath, targetPath, { width, height }) {
		return new Promise((resolve, reject) => {
			lwip.open(sourcePath, (error, image) => {
				if (error) {
					reject(error);
				} else {
					const sourceWidth = image.width();
					const sourceHeight = image.height();
					image.batch()
					.scale(width < height ? height / sourceHeight : width / sourceWidth)
					.crop(width, height)
					.writeFile(targetPath, (error) => {
						if (error) {
							reject(error);
						} else {
							resolve(fs.readFileSync(targetPath));
						}
					});
				}
			});
		});
	}
}
module.exports = LwipDriver;
