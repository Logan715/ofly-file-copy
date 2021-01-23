const Console = function (...arg) {
	arg[0] && console.log.apply(null, arg.slice(1));
};
module.exports.default = Console;
