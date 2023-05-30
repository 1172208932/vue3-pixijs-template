/**
 * on 2020/9/19.
 */
import './style.css';
let guideLayer;
let label;
let autoHideTimer;
let _didHidden;
function ensureElements() {
    if (!guideLayer) {
        let tplText = `
<div id="share_guide_layer">
	<div class="bubbleshare">
		<img class="sharebg" src="https://cdn.ysupup.com/font-common-assets/sharemask.png">
		<div class="wrappershare">
			<span class="labelshare">
			</span>
		</div>
	</div>
</div>`;
        const temp = document.createElement("div");
        temp.innerHTML = tplText;
        guideLayer = temp.children[0];
        let bubble = guideLayer.children[0];
        let wrapper = bubble.children[1];
        label = wrapper.children[0];
        guideLayer.addEventListener('click', onClick);
    }
    document.body.appendChild(guideLayer);
}
function onClick() {
    hideShareGuide();
}
/**
 * 显示分享引导层
 * @ctype PROCESS
 * @description 显示分享引导层
 * @param {string|HTMLElement} [content='点击…分享'] - 引导文本
 * @param {number} [bgOpacity=0.7] - 蒙层不透明度
 * @param {number} [autoHideDelay=0] - 自动隐藏延时，等于0不自动隐藏(单位ms)
 * @param {function} [didHidden] - 隐藏后触发回调
 * @example 一般调用
 * showShareGuide('哈哈，点分享', 0.2);  //展示分享引导层
 * @example 延时3s关闭
 * showShareGuide('哈哈，点分享', 0.2, 3000);  //展示分享引导层
 */
export function showShareGuide(content = '点击…分享', bgOpacity = 0.7, autoHideDelay = 0, didHidden) {
    ensureElements();
    _didHidden = didHidden;
    guideLayer.style.backgroundColor = `rgba(0,0,0,${bgOpacity})`;
    if (typeof content === 'string') {
        if (content.indexOf('<') >= 0 && content.indexOf('>') >= 0) {
            label.innerHTML = content;
        }
        else {
            label.innerText = content;
        }
    }
    else {
        label.innerHTML = '';
        label.appendChild(content);
    }
    if (autoHideDelay > 0) {
        clearTimeout(autoHideTimer);
        autoHideTimer = setTimeout(hideShareGuide, autoHideDelay);
    }
}
/**
 * 隐藏分享引导层
 * @ctype PROCESS
 * @description 隐藏分享引导层
 * @example 一般调用
 * hideShareGuide();  //隐藏分享引导层
 */
export function hideShareGuide() {
    if (guideLayer && guideLayer.parentNode) {
        clearTimeout(autoHideTimer);
        document.body.removeChild(guideLayer);
        _didHidden && _didHidden();
    }
}
