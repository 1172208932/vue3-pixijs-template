/**
 * on 2019-06-27.
 *
 * 微信小程序
 * <script src="//res.wx.qq.com/open/js/jweixin-1.3.2.js"></script>
 */
import { ShareWay } from "../ShareWay";
export class WeixinMini extends ShareWay {
    constructor() {
        super();
        this.name = '微信小程序';
        this.params = {};
    }
    static async testEnv() {
        return new Promise((resolve) => {
            const ua = navigator.userAgent.toLowerCase();
            if (ua.match(/micromessenger/i)) {
                wx.miniProgram.getEnv((res) => {
                    resolve(res.miniprogram);
                });
            }
            else {
                resolve(false);
            }
        });
    }
    updateShare(shareParams, options) {
        super.updateShare(shareParams);
        const { url, title, content, thumbnail } = shareParams;
        const { params } = this;
        let mapping;
        if (WeixinMini.shareId) {
            mapping = sfms[WeixinMini.shareId];
        }
        if (!mapping) {
            mapping = WeixinMini.shareFieldsMapping;
        }
        params[mapping['title']] = title;
        params[mapping['link']] = url;
        params[mapping['desc']] = content;
        params[mapping['imgUrl']] = thumbnail;
        wx.miniProgram.postMessage({
            data: this.params
        });
    }
}
WeixinMini.shareFieldsMapping = {
    title: 'title',
    link: 'link',
    desc: 'desc',
    imgUrl: 'imgUrl',
};
const sfms = {
    TaoboSports: {
        title: 'shareTitle',
        link: 'url',
        desc: 'shareDesc',
        imgUrl: 'shareImage',
    },
};
