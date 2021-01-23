const path = require("path");
const fs = require("fs-extra");
const { copy } = require("./utils/fileUtil");
const { deepObjectCopy } = require("./utils/deepObjectCopy");
const config = require("./cp.config.json");
const chalk = require("chalk");
const ora = require("ora");
const Console = require("./utils/Console").default;

const { program } = require("commander");
const version = require("../package.json").version;
program.version(version);
program
	.option("-s, --src <src>", "拷贝文件的目录, 默认 src")
	.option("-o, --out-dir <out-dir>", "拷贝文件的目标目录, 默认 dist")
	.option(
		"--config <config>",
		"配置文件的地址, 默认读取根目录下的.cp.config.json"
	)
	.option("--verbose", "打印比较详细的提示信息")
	.parse(process.argv);
const options = program.opts();

const verbose = options.verbose;
var configPath = options.config
	? path.resolve(options.config)
	: path.resolve(".cp.config.json");

let selfConfig;
try {
	Console(verbose, `${chalk.green("配置文件: ")}${chalk.gray(configPath)}`);
	selfConfig = fs.readJsonSync(configPath);
	// Console(verbose, `${chalk.green("配置文件: ")}${chalk.gray(configPath)}`);
} catch (e) {
	console.error(e);
	// throw new Error("未找到配置文件");
	Console(verbose, `${chalk.green("使用系统默认配置")}`);
	// process.exit(1);
}
let mergeConfig = config;
if (selfConfig) {
	mergeConfig = deepObjectCopy(config, selfConfig || {});
}

const from = path.resolve(options.src ? options.src : mergeConfig.source);
// verbose && console.log(`${chalk.green("from")}: ${chalk.gray(from)}`);
Console(
	verbose,
	`${chalk.green("ignore file type: ")}${chalk.gray(mergeConfig.exclude)}`
);
Console(verbose, `${chalk.green("from")}: ${chalk.gray(from)}`);
const to = path.resolve(options.outDir ? options.outDir : mergeConfig.target);
Console(verbose, `${chalk.green("to")}: ${chalk.gray(to)}`);

console.time(chalk.green("duration"));
const spinner = ora(chalk.greenBright("正在拷贝文件..."));
spinner.start();
copy(from, to, { verbose, exclude: mergeConfig.exclude });
spinner.text = chalk.green("拷贝文件完成.");
spinner.succeed();
console.timeEnd(chalk.green("duration"));
