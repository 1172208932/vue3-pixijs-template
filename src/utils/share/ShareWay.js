/**
 * 分享途径基类
 */
export class ShareWay {
    /**
     * 手动设置环境测试方法
     */
    static async testEnv() {
        return false;
    }
    /**
     * 初始化
     */
    async init(options) {
        return true;
    }
    /**
     * 更新分享参数
     * @param shareParams
     * @param options
     */
    updateShare(shareParams, options) {
    }
    /**
     * 主动调起分享
     * @param shareParams
     * @param options
     */
    callShare(shareParams, options) {
        return Promise.resolve();
    }
    sendShareResult(success, payload) {
        this._onShareResult && this._onShareResult(this.name, success, payload);
    }
}
/**
 * 是否启动
 */
ShareWay.isOn = false;
