/**
 * on 2019-06-27.
 *
 * 微信
 * <script src="//res.wx.qq.com/open/js/jweixin-1.2.0.js"></script>
 * <script src="//res.wx.qq.com/open/js/jweixin-1.4.0.js"></script>
 * 微信文档：https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html
 * 企业微信文档：https://work.weixin.qq.com/api/doc/90000/90136/90490
 *
 * 注意：1.4.0开始，分享成功的回调已经被去除，所以只能做假分享
 */

import { ShareWay } from "../ShareWay";
import { callApi } from "@/api/resource";
const ua = navigator.userAgent;
const isWeixinWork = !!ua.match(/wxwork/i);
const jsApiList12 = ['onMenuShareTimeline', 'onMenuShareAppMessage',]; //1.2
if (isWeixinWork) { //如果是企微环境就增加特有的api
    jsApiList12.push('onMenuShareWechat');
}
const jsApiList14 = ['updateAppMessageShareData', 'updateTimelineShareData']; //1.4
//自动判断版本
const jsApiList = window['wx'] ? wx['updateAppMessageShareData'] ? jsApiList14 : jsApiList12 : [];

export class Weixin extends ShareWay {
    constructor() {
        super();
        this.name = '微信';
        this.params = {
        };
    }
    static async testEnv() {
        return new Promise((resolve) => {
            const ua = navigator.userAgent.toLowerCase();
            if (ua.match(/micromessenger/i)) {
                if (Weixin.distinguishedFromMini) {
                    wx.miniProgram.getEnv((res) => {
                        resolve(!res.miniprogram);
                    });
                }
                else {
                    resolve(true);
                }
            }
            else {
                resolve(false);
            }
        });
    }
    async init(options) {
        const isOn = await Weixin.testEnv();
        if (!isOn) {
            return true;
        }
        try {
            console.log('options',options);
            const { signUrl = encodeURIComponent(location.href), jsApiList: additionJsApiList, openTagList, isMiniApp = false, apk, customSignData } = options;
            const signData = customSignData || await callApi('/act-gateway/act-user-biz/wechat/getSignInfo',{
                url: signUrl,
                appId: 2
            });
            let configureJsApiList = jsApiList.concat();
            if (additionJsApiList) {
                for (let item of additionJsApiList) {
                    if (configureJsApiList.indexOf(item) < 0) {
                        configureJsApiList.push(item);
                    }
                }
            }
            return new Promise((resolve) => {
                console.log('signData', signData);
                // console.log('signData',encodeURIComponent(updateUrlgParameter(location.href,'forceAuth', true)));
                // if(signData==null) return location.href = 'https://www.ysupup.com/act-gateway/act-user-biz/wechat/autoLogin?appId=2&appSecret=ea8b2408d8af4c36867752f84dd52ef6&scope=0&redirect=' + encodeURIComponent(updateUrlgParameter(location.href,'forceAuth', true))
                // https%3A%2F%2Fwww.ysupup.com%2Fchina_life_hi_fun_playground&forceAuth=true
                const { timestamp, noncestr, signature } = signData || {};
                wx.config({
                    debug: Weixin.debugMode,
                    appId: 'wxebaa746f7f68407a',
                    timestamp: timestamp,
                    nonceStr: noncestr,
                    signature: signature,
                    jsApiList: configureJsApiList,
                    openTagList,
                });
                wx.ready(function () {
                    resolve(true);
                });
                wx.error(function (res) {
                    console.info(res);
                    resolve(false);
                });
            });
        }
        catch (e) {
            return false;
        }
    }
    updateShare(shareParams, options) {
        const { url, title, content, thumbnail } = shareParams;
        this.params.title = title;
        this.params.desc = content;
        this.params.imgUrl = thumbnail;
        this.params.link = url;
        wx.ready(() => {
            jsApiList.forEach(method => {
                wx[method](this.params);
                console.info('wx.'+method+':', this.params);
            });
        });
    }
    callShare(shareParams, options) {
        const { url, title, content, thumbnail } = shareParams;
        this.params.title = title;
        this.params.link = url;
        this.params.desc = content;
        this.params.imgUrl = thumbnail;
        const { scene = 0 } = options;
        let action;
        switch (scene) {
            case 0:
                action = 'shareAppMessage';
                break;
            case 1:
                action = 'shareWechatMessage';
                break;
        }
        return new Promise(resolve => {
            wx.invoke(action, this.params, (res) => {
                const result = res.err_msg == "shareAppMessage:ok";
                this.sendShareResult(result);
                resolve(result);
            });
        });
    }
}
Weixin.debugMode = false; //调试模式
Weixin.distinguishedFromMini = false; //区分于小程序
