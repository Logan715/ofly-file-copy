const { copy } = require("./utils/fileUtil");
const path = require("path");
const { deepObjectCopy } = require("./utils/deepObjectCopy");
const config = require("./cp.config.json");
const chalk = require("chalk");
const argv = require("minimist")(process.argv.slice(2));
const ora = require("ora");

const Console = require("./utils/Console").default;

const verbose = argv.verbose;
var configPath = argv.config
	? path.resolve(argv.config)
	: path.resolve(".cp.config.json");

let selfConfig;
try {
	selfConfig = require(configPath);
	Console(verbose, `${chalk.green("配置文件: ")}${chalk.gray(configPath)}`);
} catch (e) {
	// throw new Error("未找到配置文件");
	Console(verbose, `${chalk.green("使用系统默认配置")}`);
	// process.exit(1);
}
let mergeConfig = config;
if (selfConfig) {
	mergeConfig = deepObjectCopy(config, selfConfig || {});
}

const from = path.resolve(argv["src"] ? argv["src"] : mergeConfig.source);
// verbose && console.log(`${chalk.green("from")}: ${chalk.gray(from)}`);
Console(
	verbose,
	`${chalk.green("ignore file type: ")}${chalk.gray(mergeConfig.exclude)}`
);
Console(verbose, `${chalk.green("from")}: ${chalk.gray(from)}`);
const to = path.resolve(argv["out-dir"] ? argv["out-dir"] : mergeConfig.target);
Console(verbose, `${chalk.green("to")}: ${chalk.gray(to)}`);

console.time(chalk.green("duration"));
const spinner = ora(chalk.greenBright("正在拷贝文件..."));
spinner.start();
copy(from, to, { verbose, exclude: mergeConfig.exclude });
spinner.text = chalk.green("拷贝文件完成.");
spinner.succeed();
console.timeEnd(chalk.green("duration"));
