
const images = require('images');

class ImagesDriver {

	async resize(sourcePath, targetPath, { width, height }) {
		const sourceImage = images(sourcePath)
		const sourceWidth = sourceImage.width();
		const sourceHeight = sourceImage.height();
		let targetWidth, targetHeight;
		if (sourceWidth / sourceHeight < width / height) {
			targetWidth = width;
			targetHeight = parseInt(width * sourceHeight / sourceWidth);
		} else {
			targetWidth = parseInt(height * sourceWidth / sourceHeight);
			targetHeight = height;
		}
		sourceImage.resize(targetWidth, targetHeight);
		const destImage = images(
			sourceImage,
			targetWidth > width ? parseInt((targetWidth - width) / 2) : 0,
			targetHeight > height ? parseInt((targetHeight - height) / 2) : 0,
			width,
			height
		);
		await new Promise((resolve, reject) => destImage.saveAsync(
			targetPath,
			(error) => error ? reject(error) : resolve()
		));
	}
}
module.exports = ImagesDriver;
