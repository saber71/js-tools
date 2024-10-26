/**
 * 将数字转换为中文表示形式
 * @param number 要转换的数字
 * @returns 转换后的中文数字字符串
 */
export declare function chineseNumber(number: number): string;

/**
 * 表示一个构造函数，该构造函数接受一组参数并返回一个实例。
 *
 * @typeParam T 构造函数返回的实例类型。
 * @typeParam P 构造函数接受的参数类型数组。
 */
export declare type Class<T = any, P extends any[] = any[]> = {
    new (...args: P): T;
};

/**
 * 将给定的字符串片段组合成一个URL。
 * @param items 字符串数组，代表URL的各个部分。
 * @returns 组合后的URL字符串，确保每个部分都被正确地连接，且没有多余的斜杠。
 */
export declare function composeUrl(...items: string[]): string;

declare type Condition = boolean | (() => boolean);

/**
 * 函数防抖动封装。
 * 函数防抖是一种优化策略，用于限制函数调用的频率。当一个函数连续调用时，防抖函数会推迟该函数的执行，直到调用停止超过指定的延迟时间。
 * @param fn 需要被防抖的函数。
 * @param delay 延迟时间（毫秒）。
 * @returns 返回一个经过防抖处理的函数。
 */
export declare function debounce<Fn extends Function>(fn: Fn, delay: number): Fn;

/**
 * 深度合并源对象到目标对象。
 * @param dst 目标对象，任意类型。
 * @param src 源对象，类型为 T，将被合并到目标对象。
 * @returns 合并后的对象，其类型为 T。
 *
 * 函数会递归地合并 src 对象的属性到 dst 对象。如果遇到特殊类型如日期、数组、Map 或 Set，
 * 以及TypedArray，将进行特殊处理以确保合并的正确性。
 */
export declare function deepAssign<T extends object>(dst: any, src: T): T;

/**
 * 深度克隆对象。
 *
 * @param obj 要进行深度克隆的对象。
 * @param options 克隆选项，提供可选的配置项，例如是否克隆 Map 的键。
 * @returns 返回 obj 的深度克隆副本。如果 obj 不是对象类型、未定义或为 null，则直接返回 obj。
 */
export declare function deepClone<T>(obj: T, options?: DeepCloneOption): T;

/**
 * 深克隆选项
 *
 * `cloneMapKey`属性用于指示是否需要克隆Map对象的键。
 * 默认情况下，`cloneMapKey`是false，表示不克隆Map的键。
 */
declare type DeepCloneOption = Partial<{
    cloneMapKey: boolean;
}>;

/**
 * 提取数组泛型的元素类型。
 *
 * 该类型别名用于判断一个泛型T是否为数组类型，并从中提取出数组元素的类型。
 * 如果泛型T不是数组类型，则直接返回T。
 * 这种类型操作在处理泛型数组或需要获取数组元素类型的情境中非常有用。
 *
 * @param T - 被检查的泛型类型，它可以是任何类型，包括数组类型。
 * @returns 如果T是数组类型，则返回数组的元素类型；否则返回T本身。
 */
export declare type ExtractArrayGenericType<T> = T extends Array<infer U> ? U : T;

/**
 * 类型推断：如果T是Promise类型，则提取并返回Promise内部的泛型类型U；否则，直接返回T。
 * 主要用于获取Promise的泛型参数类型。
 */
export declare type ExtractPromiseGenericType<T> = T extends Promise<infer U> ? U : T;

/**
 * 定义一个完全点击接口，包含鼠标按下和鼠标抬起两个事件的处理函数。
 */
export declare interface FullyClick {
    onMousedown: () => void;
    onMouseup: () => void;
}

/**
 * 创建一个完全点击事件的管理器。
 * @param time 定义一个时间阈值，用于判断是否为快速点击。
 * @param onMousedown 鼠标按下时的处理函数。
 * @param onMouseup 鼠标抬起时的处理函数。
 * @returns 返回一个包含onMousedown和onMouseup方法的对象，用于管理点击事件。
 */
export declare function fullyClick(time: number, onMousedown: () => void, onMouseup: () => void): FullyClick;

/**
 * 创建一个条件判断流程控制对象。
 * @param cond 条件，可以是布尔值或返回布尔值的函数。
 * @returns 返回一个包含 `then`, `else`, `elseIf`, 和 `done` 方法的对象，用于构建条件分支和获取最终结果。
 */
export declare function If<Result>(cond: Condition): If_2<Result>;

/**
 * 创建一个条件判断流程控制对象。
 * @param cond 条件，可以是布尔值或返回布尔值的函数。
 * @returns 返回一个包含 `then`, `else`, `elseIf`, 和 `done` 方法的对象，用于构建条件分支和获取最终结果。
 */
declare function If<Result>(cond: Condition): If_2<Result>;

declare interface If_2<Result = any> {
    then(value: Value<Result>): this;
    else(value: Value<Result>, padStart?: boolean): Result;
    elseIf(cond: Condition): this;
    done(): Result;
}

export declare function isBasicType(type: Class): boolean;

/**
 * 检查当前环境是否为浏览器环境。
 * 通过判断全局 `process` 对象是否存在以及 `process.nextTick` 方法是否为函数来判断。
 */
export declare const isBrowser: boolean;

/**
 * 检查提供的扩展名是否为常见的图片格式。
 *
 * @param extName 要检查的文件扩展名，可以带点号（.），不区分大小写。
 * @returns 返回一个布尔值，如果提供的扩展名是图片格式，则为true，否则为false。
 */
export declare function isImageExtName(extName: string): boolean;

export declare function isTypedArray(arr: any): arr is TypedArray;

/**
 * 检查给定的扩展名是否为视频文件支持的格式。
 * @param extName 文件扩展名，可以以点号开头（例如“.mp4”），也可以不带点号（例如“mp4”）。
 * @returns 返回一个布尔值，如果扩展名是视频文件支持的格式，则为true；否则为false。
 */
export declare function isVideoExtName(extName: string): boolean;

/**
 * 监听函数，接受任意数量的参数。主要作用是传入需要被vue监听到的内容或值，此函数实际没有任何逻辑
 * @param args 可以是任意类型的参数列表。
 * @returns 无返回值。
 */
export declare function listen(...args: any[]): void;

export declare function randomArrayItem<T>(array: T[]): T;

export declare function randomInt(min: number, max: number): number;

export declare function randomNumber(min: number, max: number): number;

export declare function randomString(len: number): string;

/**
 * 从集合中删除指定的内容
 * @param collection - 要操作的集合，可以是数组或Set
 * @param item - 要删除的项目，或者是一个函数，用于判断哪些项目应该被删除
 * @param isPredicate - 指示参数item是否为一个判断函数的布尔值，默认为undefined
 * @returns 修改后的集合
 */
export declare function remove<T>(collection: Array<T> | Set<T>, item?: T | T[] | ((item: T) => boolean), isPredicate?: boolean): T[] | Set<T>;

/**
 * 移除给定字符串两端指定的字符。
 * @param str 待处理的字符串。
 * @param char 需要移除的字符。
 * @returns 处理后的字符串，确保两端没有指定的字符。
 */
export declare function removeHeadTailChar(str: string, char: string): string;

/**
 * 使用给定的函数对指定范围内的每个数字进行处理，并返回处理结果的数组。
 * @param start 起始数字，包含在处理范围内。
 * @param end 结束数字，包含在处理范围内。
 * @param fn 一个函数，接受一个数字参数（在指定范围内），并返回一个结果。
 * @returns 返回一个数组，包含从起始数字到结束数字（包括两者）范围内，每个数字经过fn函数处理后的结果。
 */
export declare function spread<Result>(start: number, end: number, fn: (index: number) => Result): Result[];

/**
 * 函数节流器
 * @param fn 要节流的函数
 * @param delay 延迟的毫秒数
 * @returns 返回一个新函数，新函数在调用时如果之前调用未超过指定的延时时间，则会阻止调用原函数，直到超过指定延时时间。
 */
export declare function throttle<F extends Function>(fn: F, delay: number): {
    (...args: any[]): any;
    cancel(): void;
    immediate(): void;
};

export declare function throttleFnImmediate(fn: Function): void;

/**
 * TypedArray 是一组TypedArray类型的联合类型。
 * TypedArray 是一种特殊的Array，用于存储固定大小的数值类型元素，提供了更高的性能和类型安全。
 */
export declare type TypedArray = Uint8Array | Uint8ClampedArray | Uint16Array | Uint32Array | Int8Array | Int16Array | Int32Array | Float32Array | Float64Array;

declare type Value<Result = any> = Result | (() => Result);

export { }
