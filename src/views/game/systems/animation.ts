import * as PIXI from 'pixi.js';
import * as TWEEN from "@tweenjs/tween.js";

export enum FLIP_TYPE {
    FRONT = 'FRONT',
    BACK = 'BACK',
}   


/** 翻转所有的卡片到正面或背面 */
export const playFipAllAnimation = (type: FLIP_TYPE, gridView: Array<PIXI.Container>) => {
    return Promise.all(
        gridView.map(
            (child: PIXI.Container) => {
                if(!child['front']){
                    playFlipAnimation(type, child)
                }
            })
    )
}

/** 翻转单个卡片到正面或背面 */
export const playFlipAnimation = (type: FLIP_TYPE, cardView: PIXI.Container) => {
    return new Promise<PIXI.Container>((resolve) => {
        const toFront = type == FLIP_TYPE.FRONT;
        const [front,back ] = cardView.children;

        const DURATION = 300;

        back.visible = front.visible = true;
        back.scale.x = front.scale.x = 0;

        const callback = () => {
            back.visible = !toFront;
            front.visible = toFront;
            resolve(cardView);
        }

        const tweenBack = new TWEEN.Tween(back.scale);
        const tweenFront = new TWEEN.Tween(front.scale);

        if (toFront) {
            back.scale.x = 1;
            tweenBack.to({ x: 0 }, DURATION).start().onComplete(() => {
                tweenFront.to({ x: 1 }, DURATION).start().onComplete(callback);
            });
        } else {
            front.scale.x = 1;
            tweenFront.to({ x: 0 }, DURATION).start().onComplete(() => {
                tweenBack.to({ x: 1 }, DURATION).start().onComplete(callback);
            });
        }
    })
}