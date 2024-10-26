/**
 * 将数字转换为中文表示形式
 * @param number 要转换的数字
 * @returns 转换后的中文数字字符串
 */ function chineseNumber(number) {
    // 将输入的数字转换为字符串，并根据小数点分割整数部分和小数部分
    const str = String(number).split(".");
    const int = str[0] || "0" // 整数部分
    ;
    const float = str[1] // 小数部分
    ;
    let intResult = "" // 整数部分的中文结果
    ;
    let floatResult = "" // 小数部分的中文结果
    ;
    // 处理小数部分
    if (float) {
        for(let i = 0; i < float.length; i++){
            floatResult += charMap[float[i]] // 将每个数字转换为对应的中文字符
            ;
        }
    }
    // 初始化变量，用于处理整数部分的中文转换
    let yi = 1, unit = 1 // 万级单位
    ;
    let wanIndex = int.length - 1 // 记录当前处理的数字是否在万位之后
    ;
    // 处理仅有一个数字的情况
    if (int.length === 1) {
        intResult = charMap[int[0]];
    } else {
        // 从整数部分的最高位开始，逐位处理
        for(let i = int.length - 1; i >= 0; i--){
            // 每当达到亿级别时，进行单位转换
            if (yi >= 100000000) {
                yi /= 100000000;
                unit = 1;
                wanIndex = i;
                if (intResult[0] === "万") intResult = intResult.slice(1);
                intResult = "亿" + intResult;
            }
            // 每当达到万级别时，进行单位转换
            if (unit >= 10000) {
                unit /= 10000;
                intResult = "万" + intResult;
                wanIndex = i;
            }
            const char = int[i] // 当前处理的数字字符
            ;
            // 处理数字为0的情况，添加适当的中文字符
            if (char === "0") {
                let enableZero = false;
                for(let j = i; j <= wanIndex; j++){
                    if (int[j] !== "0") enableZero = true;
                }
                if (intResult[0] !== "零" && enableZero) intResult = charMap[char] + intResult;
            }
            // 处理非0数字，添加适当的中文字符
            if (char !== "0" && unit >= 10) {
                intResult = charMap[unit] + intResult;
                if (unit !== 10 || char !== "1") intResult = charMap[char] + intResult;
            } else if (char !== "0") intResult = charMap[char] + intResult;
            yi *= 10;
            unit *= 10;
        }
    }
    // 如果有小数部分，将整数部分和小数部分合并返回
    if (floatResult) return `${intResult}点${floatResult}`;
    return intResult;
}
// 定义数字到中文字符的映射
const charMap = {
    0: "零",
    1: "一",
    2: "二",
    3: "三",
    4: "四",
    5: "五",
    6: "六",
    7: "七",
    8: "八",
    9: "九",
    10: "十",
    100: "百",
    1000: "千",
    10000: "万"
};

/**
 * 将给定的字符串片段组合成一个URL。
 * @param items 字符串数组，代表URL的各个部分。
 * @returns 组合后的URL字符串，确保每个部分都被正确地连接，且没有多余的斜杠。
 */ function composeUrl(...items) {
    // 移除每个部分两端的斜杠，过滤掉长度为0的字符串，然后将所有部分用斜杠连接起来
    return "/" + items.map((str)=>removeHeadTailChar(str, "/")).filter((str)=>str.length > 0).join("/");
}
/**
 * 移除给定字符串两端指定的字符。
 * @param str 待处理的字符串。
 * @param char 需要移除的字符。
 * @returns 处理后的字符串，确保两端没有指定的字符。
 */ function removeHeadTailChar(str, char) {
    // 循环移除字符串开头的指定字符
    while(str[0] === char)str = str.slice(1);
    // 循环移除字符串末尾的指定字符
    while(str[str.length - 1] === char)str = str.slice(0, str.length - 1);
    return str;
}

/**
 * 函数防抖动封装。
 * 函数防抖是一种优化策略，用于限制函数调用的频率。当一个函数连续调用时，防抖函数会推迟该函数的执行，直到调用停止超过指定的延迟时间。
 * @param fn 需要被防抖的函数。
 * @param delay 延迟时间（毫秒）。
 * @returns 返回一个经过防抖处理的函数。
 */ function debounce(fn, delay) {
    // 上一次调用函数时的参数存储
    let lastArgs = [];
    // 定时器句柄
    let handler;
    // 返回一个封装函数，以实现防抖逻辑
    return (...args)=>{
        // 更新上一次的参数为当前调用的参数
        lastArgs = args;
        // 如果存在定时器，则清除之前的定时器
        if (handler) clearTimeout(handler);
        // 设置新的定时器，延迟执行原函数
        handler = setTimeout(()=>{
            handler = null // 清空定时器句柄
            ;
            fn(...lastArgs) // 执行原函数，传入上一次调用的参数
            ;
        }, delay);
    };
}

function isTypedArray(arr) {
    return arr instanceof Uint8Array || arr instanceof Uint8ClampedArray || arr instanceof Uint16Array || arr instanceof Uint32Array || arr instanceof Int8Array || arr instanceof Int16Array || arr instanceof Int32Array || arr instanceof Float32Array || arr instanceof Float64Array;
}

/**
 * 深度合并源对象到目标对象。
 * @param dst 目标对象，任意类型。
 * @param src 源对象，类型为 T，将被合并到目标对象。
 * @returns 合并后的对象，其类型为 T。
 *
 * 函数会递归地合并 src 对象的属性到 dst 对象。如果遇到特殊类型如日期、数组、Map 或 Set，
 * 以及TypedArray，将进行特殊处理以确保合并的正确性。
 */ function deepAssign(dst, src) {
    // 如果源或目标不是对象，或任一为 null，则直接返回源对象
    if (typeof src !== "object" || typeof dst !== "object" || !dst || !src) return src;
    // 如果目标和源对象的构造函数不一致，则直接当作普通对象进行深度合并
    if (dst.constructor !== src.constructor) return assign();
    else if (dst instanceof Date) dst.setTime(src.getTime());
    else if (src instanceof Array) {
        for(let i = 0; i < src.length; i++){
            dst[i] = deepAssign(dst[i], src[i]);
        }
    } else if (src instanceof Map) {
        const dstMap = dst;
        src.forEach((value, key)=>{
            dstMap.set(key, deepAssign(dstMap.get(key), value));
        });
    } else if (src instanceof Set) {
        const oldValues = Array.from(dst);
        const dstSet = dst;
        dstSet.clear();
        Array.from(src).forEach((value, index)=>dstSet.add(deepAssign(oldValues[index], value)));
        if (src.size < oldValues.length) oldValues.slice(src.size).forEach((val)=>dstSet.add(val));
    } else if (isTypedArray(src)) {
        const dstTypedArray = dst;
        const len = Math.min(src.length, dstTypedArray.length);
        for(let i = 0; i < len; i++){
            dstTypedArray[i] = src[i];
        }
    } else return assign();
    return dst;
    // 辅助函数，用于处理普通对象的合并
    function assign() {
        if (src instanceof Date) return src // 如果源对象是日期，则直接返回，不做合并
        ;
        for(let key in src){
            const value = src[key];
            dst[key] = deepAssign(dst[key], value);
        }
        return dst;
    }
}

/**
 * 深度克隆对象。
 *
 * @param obj 要进行深度克隆的对象。
 * @param options 克隆选项，提供可选的配置项，例如是否克隆 Map 的键。
 * @returns 返回 obj 的深度克隆副本。如果 obj 不是对象类型、未定义或为 null，则直接返回 obj。
 */ function deepClone(obj, options = {}) {
    // 如果 obj 不是对象类型、未定义或为 null，则直接返回 obj
    if (typeof obj !== "object" || obj === undefined || obj === null) return obj;
    // 如果 obj 是 RegExp 实例，直接返回 obj，不需要克隆
    if (obj instanceof RegExp) return obj;
    // 处理 Set 对象的克隆
    if (obj instanceof Set) {
        const result = new Set();
        obj.forEach((value)=>result.add(deepClone(value)));
        return result;
    // 处理 Date 对象的克隆
    } else if (obj instanceof Date) {
        return new Date(obj);
    // 处理 Map 对象的克隆
    } else if (obj instanceof Map) {
        const result = new Map();
        obj.forEach((value, key)=>{
            if (options.cloneMapKey) key = deepClone(key, options);
            result.set(key, deepClone(value));
        });
        return result;
    // 处理 TypedArray 的克隆
    } else if (isTypedArray(obj)) {
        //@ts-ignore
        return new obj.constructor(obj);
    // 处理普通对象的克隆
    } else {
        //@ts-ignore
        const result = new (obj.constructor || Object)();
        Object.assign(result, obj);
        for(let objKey in obj){
            const value = obj[objKey];
            result[objKey] = deepClone(value, options);
        }
        return result;
    }
}

/**
 * 定义一个完全点击接口，包含鼠标按下和鼠标抬起两个事件的处理函数。
 */ /**
 * 创建一个完全点击事件的管理器。
 * @param time 定义一个时间阈值，用于判断是否为快速点击。
 * @param onMousedown 鼠标按下时的处理函数。
 * @param onMouseup 鼠标抬起时的处理函数。
 * @returns 返回一个包含onMousedown和onMouseup方法的对象，用于管理点击事件。
 */ function fullyClick(time, onMousedown, onMouseup) {
    // 定义状态变量和计时器
    let down = false, downTime = 0, handler = 0 // 记录定时器的ID
    ;
    // 返回一个包含鼠标按下和抬起事件处理的方法的对象
    return {
        onMousedown () {
            down = true;
            downTime = Date.now();
            if (handler) {
                clearTimeout(handler);
                handler = 0;
            }
            onMousedown() // 调用传入的鼠标按下事件处理函数
            ;
        },
        onMouseup () {
            if (down) {
                down = false;
                const bias = Date.now() - downTime // 计算鼠标按下到抬起的时间差
                ;
                if (bias < time) {
                    // 如果时间差小于定义的时间阈值，则认为是快速点击，使用setTimeout延迟执行onMouseup
                    handler = setTimeout(()=>{
                        handler = 0;
                        onMouseup();
                    }, bias);
                } else {
                    // 如果时间差大于等于时间阈值，直接执行onMouseup
                    onMouseup();
                }
            }
        }
    };
}

/**
 * 创建一个条件判断流程控制对象。
 * @param cond 条件，可以是布尔值或返回布尔值的函数。
 * @returns 返回一个包含 `then`, `else`, `elseIf`, 和 `done` 方法的对象，用于构建条件分支和获取最终结果。
 */ function If(cond) {
    // 初始化记录对象，用于存储条件判断和对应的结果。
    const record = {
        if: {
            then: undefined,
            checkResult: checkCondition(cond)
        },
        elseIf: []
    };
    // 定义对外接口对象，提供链式调用能力。
    const object = {
        /**
     * 设置当条件满足时的结果。
     * @param value 条件满足时的结果值，可以是直接的值或者返回值的函数。
     * @returns 返回当前 If 对象，支持链式调用。
     */ then (value) {
            // 仅当该条件分支未被设置结果时，才设置结果。
            if (record.if.then === undefined) record.if.then = value;
            else if (record.else) {
                // 如果存在 else 分支且未设置结果，设置该结果。
                if (!record.else.then) record.else.then = value;
            } else {
                // 如果存在 elseIf 分支且未设置结果，设置该结果。
                const lastElseIf = record.elseIf.at(-1);
                if (lastElseIf) lastElseIf.then = value;
            }
            return this;
        },
        /**
     * 设置其他情况下的结果。
     * @param value 其他情况下的结果值，可以是直接的值或者返回值的函数。
     * @param padStart 如果结果值是字符串的情况下，是否在结果值前面添加空格，默认为 true。
     * @returns 返回最终结果，调用 `done` 方法来结束条件判断流程并获取结果。
     */ else (value, padStart = true) {
            // 如果 else 分支未被设置，初始化并设置结果。
            if (!record.else) record.else = {};
            record.else.then = value;
            const result = object.done();
            if (typeof result === "string" && padStart) return " " + result;
            return result;
        },
        /**
     * 添加另一个条件分支。
     * @param cond 新的条件，可以是布尔值或返回布尔值的函数。
     * @returns 返回当前 If 对象，支持链式调用。
     */ elseIf (cond) {
            // 添加新的条件分支到记录中。
            record.elseIf.push({
                then: undefined,
                cond
            });
            return this;
        },
        /**
     * 结束条件判断流程并返回最终结果。
     * @returns 返回根据条件判断得到的结果。
     */ done () {
            // 根据条件判断顺序，获取最终结果。
            let result;
            if (record.if.checkResult) result = getValue(record.if.then);
            else {
                let gotIt = false;
                for (let item of record.elseIf){
                    if (checkCondition(item.cond)) {
                        result = getValue(item.then);
                        gotIt = true;
                        break;
                    }
                }
                if (!gotIt) result = getValue(record.else?.then);
            }
            return result;
        }
    };
    return object;
}
// 辅助函数，用于检查条件是否满足。
function checkCondition(cond) {
    if (typeof cond === "function") return cond();
    return cond;
}
// 辅助函数，用于获取值，支持函数类型的结果。
function getValue(val) {
    if (typeof val === "function") return val();
    return val;
}

// 使用Set来存储基本类型名称，以提高查找效率。
const basicTypes = new Set([
    "Object",
    "String",
    "Boolean",
    "Number",
    "Symbol",
    "Array",
    "Function",
    "Date",
    "Set",
    "Map",
    "WeakSet",
    "WeakMap",
    "RegExp",
    "Uint8Array",
    "Int8Array",
    "Uint16Array",
    "Int16Array",
    "Uint32Array",
    "Int32Array",
    "Float32Array",
    "Float64Array",
    "Uint8ClampedArray"
]);
/* 判断给定的类是否是js的内置类型 */ function isBasicType(type) {
    // 确保传入的是一个函数类型
    if (typeof type !== "function") {
        throw new TypeError("Expected a function type");
    }
    // 检查类型名称是否在基本类型集合中
    return basicTypes.has(type.name);
}

/**
 * 检查当前环境是否为浏览器环境。
 * 通过判断全局 `process` 对象是否存在以及 `process.nextTick` 方法是否为函数来判断。
 */ const process = globalThis.process;
const isBrowser = !(process && typeof process.nextTick === "function" // 在 Node.js 环境中，`process` 是全局对象且提供了 `nextTick` 方法，
 // 而在大多数浏览器环境中，`process` 未定义或不提供 `nextTick` 方法。
 // 因此，通过检查 `process` 的存在性和 `nextTick` 方法的类型，可以区分当前环境是浏览器还是 Node.js。
);

/**
 * 创建一个包含常见图片扩展名的Set集合。
 * 该集合用于后续函数中对图片扩展名的快速查证。
 */ const imageExtensions = new Set([
    "jpg",
    "jpeg",
    "png",
    "bmp",
    "webp"
]);
/**
 * 检查提供的扩展名是否为常见的图片格式。
 *
 * @param extName 要检查的文件扩展名，可以带点号（.），不区分大小写。
 * @returns 返回一个布尔值，如果提供的扩展名是图片格式，则为true，否则为false。
 */ function isImageExtName(extName) {
    // 如果扩展名以点号开头，移除点号
    if (extName[0] === ".") extName = extName.slice(1);
    // 利用Set集合的has方法，检查传入的扩展名是否存在于集合中，结果不区分大小写。
    return imageExtensions.has(extName.toLowerCase());
}

const videoExtensions = new Set([
    "mp4",
    "webm",
    "ogg"
]);
/**
 * 检查给定的扩展名是否为视频文件支持的格式。
 * @param extName 文件扩展名，可以以点号开头（例如“.mp4”），也可以不带点号（例如“mp4”）。
 * @returns 返回一个布尔值，如果扩展名是视频文件支持的格式，则为true；否则为false。
 */ function isVideoExtName(extName) {
    // 如果扩展名以点号开头，则移除点号
    if (extName[0] === ".") extName = extName.slice(1);
    // 将扩展名转换为小写，并检查集合中是否包含该扩展名
    return videoExtensions.has(extName.toLowerCase());
}

/**
 * 监听函数，接受任意数量的参数。主要作用是传入需要被vue监听到的内容或值，此函数实际没有任何逻辑
 * @param args 可以是任意类型的参数列表。
 * @returns 无返回值。
 */ function listen(...args) {}

const validChars = [];
// A-Z
for(let i = 65; i <= 90; i++)validChars.push(String.fromCharCode(i));
// a-z
for(let i = 97; i <= 122; i++)validChars.push(String.fromCharCode(i));
// 0-9
for(let i = 48; i <= 57; i++)validChars.push(String.fromCharCode(i));
/* 从允许的字符（0-9A-Za-z）中随机生成指定长度的字符串 */ function randomString(len) {
    let result = "";
    for(let i = 0; i < len; i++){
        result += randomArrayItem(validChars);
    }
    return result;
}
/* 随机数字 */ function randomNumber(min, max) {
    return (max - min) * Math.random() + min;
}
/* 随机整型数 */ function randomInt(min, max) {
    return Math.round(randomNumber(min, max));
}
/* 随机返回数组元素 */ function randomArrayItem(array) {
    return array[randomInt(0, array.length - 1)];
}

/**
 * 从集合中删除指定的内容
 * @param collection - 要操作的集合，可以是数组或Set
 * @param item - 要删除的项目，或者是一个函数，用于判断哪些项目应该被删除
 * @param isPredicate - 指示参数item是否为一个判断函数的布尔值，默认为undefined
 * @returns 修改后的集合
 */ function remove(collection, item, isPredicate) {
    let needRemove;
    // 判断是否以函数方式指定要删除的项
    if (isPredicate === undefined && typeof item === "function") isPredicate = true;
    // 根据是否是判断函数，筛选出需要删除的项
    if (isPredicate && item) needRemove = Array.from(collection).filter(item);
    else {
        if (item instanceof Array) needRemove = item;
        else needRemove = [
            item
        ];
    }
    // 对数组类型的集合进行删除操作
    if (collection instanceof Array) {
        for (let item of needRemove){
            const index = collection.indexOf(item);
            if (index >= 0) collection.splice(index, 1);
        }
    } else {
        // 对Set类型的集合进行删除操作
        for (let item of needRemove){
            collection.delete(item);
        }
    }
    return collection;
}

/**
 * 使用给定的函数对指定范围内的每个数字进行处理，并返回处理结果的数组。
 * @param start 起始数字，包含在处理范围内。
 * @param end 结束数字，包含在处理范围内。
 * @param fn 一个函数，接受一个数字参数（在指定范围内），并返回一个结果。
 * @returns 返回一个数组，包含从起始数字到结束数字（包括两者）范围内，每个数字经过fn函数处理后的结果。
 */ function spread(start, end, fn) {
    const result = [] // 初始化存储结果的数组
    ;
    // 遍历指定范围内的每个数字，使用fn函数处理，并将结果添加到结果数组中
    for(let i = start; i <= end; i++){
        result.push(fn(i));
    }
    return result // 返回处理后的结果数组
    ;
}

/**
 * 函数节流器
 * @param fn 要节流的函数
 * @param delay 延迟的毫秒数
 * @returns 返回一个新函数，新函数在调用时如果之前调用未超过指定的延时时间，则会阻止调用原函数，直到超过指定延时时间。
 */ function throttle(fn, delay) {
    let handler// 用于存储定时器的引用
    ;
    let lastArgs = [] //存储最近一次的入参
    ;
    // 返回一个封装函数来控制原函数的调用
    const func = function(...args) {
        lastArgs = args;
        if (handler) return func // 如果定时器存在，则不执行原函数，直接返回
        ;
        // 设置定时器，并在延时后清除定时器并执行原函数
        handler = setTimeout(()=>{
            handler = null // 清除定时器引用
            ;
            fn(...lastArgs) // 执行原函数，使用最新的入参
            ;
        }, delay);
        return func;
    };
    func.cancel = ()=>{
        clearTimeout(handler);
        handler = null;
    };
    func.immediate = ()=>{
        if (handler) {
            clearTimeout(handler);
            handler = null;
        }
        fn(...lastArgs);
    };
    return func;
}
function throttleFnImmediate(fn) {
    fn.immediate();
}

export { If, chineseNumber, composeUrl, debounce, deepAssign, deepClone, fullyClick, isBasicType, isBrowser, isImageExtName, isTypedArray, isVideoExtName, listen, randomArrayItem, randomInt, randomNumber, randomString, remove, removeHeadTailChar, spread, throttle, throttleFnImmediate };
