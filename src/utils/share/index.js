
import { __assign } from "tslib";
import { Weixin } from "./share-ways";
export * from './ShareParams';
export * from './ShareWay';
export * from './share-ways';
export * from './show-share-guide';
let shareParams = {};
let currentShareWay;
/**
 * 启动分享服务
 * @description 启动分享服务
 * @ctype PROCESS
 * @param {array} shareWayDefs - 分享途径数组
 * @param {function} [onShareResult] - 分享结果回调
 * @param {Object} [options] - 配置参数
 * @returns
 * success boolean 启动成功
 * @example 调用
 * import {start, Weixin, ZhongguoBank} from '@spark/share'
 * start([Weixin, ZngguoBank], (way, success, payload)=>{
 *   console.log('分享' + success ? '成功' : '失败')
 * })
 */
export async function start(shareWayDefs, onShareResult, options = {}) {
    try {
        for (let def of shareWayDefs) {
            if (shareWayDefs.length === 1 || def.testEnv && await def.testEnv()) {
                let shareWay = new def();
                if (await shareWay.init(options)) {
                    def.isOn = true;
                    shareWay._onShareResult = onShareResult;
                    currentShareWay = shareWay;
                    break;
                }
                else {
                    console.info(`[分享] 分享途径 "${shareWay.name}" 初始化失败`);
                }
            }
        }
    }
    catch (e) {
        console.warn(e);
    }
    console.info('[分享]', currentShareWay ? '命中的途径: ' + currentShareWay.name : '未命中途径');
    return !!currentShareWay;
}
/**
 * 更新分享参数
 * @description 主要用被动式分享
 * @ctype PROCESS
 * @param {ShareParams} data - 分享参数
 * @param {object} [options] - 分享配置
 */
export function updateShare(data, options = {}) {
    if (!currentShareWay) {
        return;
    }
    try {
        __assign(shareParams, data);
        currentShareWay.updateShare(shareParams, options);
    }
    catch (e) {
        console.info('更新分享参数失败:', e.message);
    }
}
/**
 * 调起分享
 * @description 主要用于主动式分享
 * @ctype PROCESS
 * @param {ShareParams} data - 分享参数
 * @param {object} [options] - 分享配置
 * @returns
 * success boolean 是否分享成功
 */
export async function callShare(data, options = {}) {
    if (!currentShareWay) {
        return;
    }
    try {
        __assign(shareParams, data);
        return currentShareWay.callShare(shareParams, options);
    }
    catch (e) {
        console.info('调起分享失败:', e.message);
    }
}
export async function notWeixin() {
    return !await Weixin.testEnv();
}
