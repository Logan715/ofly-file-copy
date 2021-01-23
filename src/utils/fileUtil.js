const fs = require("fs-extra");
const path = require("path");
const chalk = require("chalk");
const Console = require("./Console").default;
const copy = (templatePath, targetPath, { exclude, verbose }) => {
	fs.ensureDirSync(targetPath);
	copyDirection(path.join(templatePath), path.join(targetPath), {
		exclude,
		verbose,
	});
};

const copyFile = (fromPath, toPath) => {
	const content = fs.readFileSync(fromPath);
	fs.writeFileSync(toPath, content);
};
const copyDirection = (fromPath, toPath, { exclude, verbose }) => {
	const arr = fs.readdirSync(fromPath, { withFileTypes: true });

	arr.forEach((file) => {
		if (file.isDirectory()) {
			fs.ensureDirSync(path.join(toPath, file.name));
			copyDirection(
				path.join(fromPath, file.name),
				path.join(toPath, file.name),
				{ exclude, verbose }
			);
		} else {
			const extname = path.extname(file.name);
			if (!exclude.some((reg) => extname === reg)) {
				copyFile(path.join(fromPath, file.name), path.join(toPath, file.name));
			} else {
				Console(
					verbose,
					`ignore file : ${chalk.gray(fromPath + "/" + file.name)}`
				);
			}
		}
	});
};

const toUpperLine = (str) => {
	let temp = str.replace(/[A-Z]/g, (match) => {
		return `_${match.toLowerCase()}`;
	});
	if (temp.slice(0, 1) === "_") {
		//如果首字母是大写，执行replace时会多一个_，这里需要去掉
		temp = temp.slice(1);
	}
	return temp.toUpperCase();
};

const getTemplateDir = () => {
	// if (fs.existsSync(path.resolve(".template"))) {
	// 	// 自定义模板地址
	// 	return path.resolve(".template");
	// } else {
	if (process.env.NODE_ENV == "development") {
		return path.resolve(".template");
	}
	return path.resolve("node_modules/live-web-cli/.template");
	// }
};

module.exports = {
	copy,
	toUpperLine,
	getTemplateDir,
};
