function deepObjectCopy() {
	var extended = {};

	// 将对象属性合并到已存在的对象中
	var merge = function (obj) {
		for (var prop in obj) {
			if (obj.hasOwnProperty(prop)) {
				// 如果属性为对象并且需要深拷贝时则使用函数递归、反之则将当前的属性替换现有的属性
				if (Object.prototype.toString.call(obj[prop]) === "[object Object]") {
					extended[prop] = deepObjectCopy(extended[prop], obj[prop]);
				} else {
					extended[prop] = obj[prop];
				}
			}
		}
	};

	// 遍历所有对象属性
	for (let i = 0; i < arguments.length; i++) {
		merge(arguments[i]);
	}

	return extended;
}

module.exports = {
	deepObjectCopy,
};
