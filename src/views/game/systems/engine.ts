import * as PIXI from 'pixi.js';
import * as TWEEN from "@tweenjs/tween.js";
import { playFlipAnimation, FLIP_TYPE,playFipAllAnimation  } from "./animation";
import {shuffle} from "./utils"
import EventBus from '@/utils/eventbus';

// declare module 'pixi.js' {
//     export interface Container {
//         // 道具类型 0 炸弹 1 左 2 右
//         pakerType?: number
//     }
// }

let PixiApp: PIXI.Application;
let back,front;
let cards,cardList;
let isBegin= false
export const PixiEngine = {
    init(width: number, height: number) {
        if (typeof PixiApp !== 'undefined') {
            PixiApp.destroy();
        }
        EventBus.on('BEGIN_GAME',this.beginGame,this)

        PixiApp = new PIXI.Application({ width, height, backgroundColor: 0x2980b9 });
        function animate(time) {
            requestAnimationFrame(animate)
            TWEEN.update(time)
        }
        requestAnimationFrame(animate)
        this.initgame()
    },

    initgame(){
        let arr = new Array(22).fill(1).concat(new Array(10).fill(3))
        console.log(arr)
        cardList = shuffle(arr)
        const isTextUrl = import.meta.env.VITE_RESOURCE_URL;
        const loader = new PIXI.Loader();
        // `${isTextUrl}bird/mines@2x.json`
        loader.add(`${isTextUrl}bird/min.json`).load(()=>{
            this.addCards() 
        })
    },

    addCards(){
        cardList.forEach((item,index)=>{
            let contor = this.createCard(item);
            let row = index % 5
            let col = Math.floor(index/5)
            contor.x =  col*156 + 10*(col+1)
            contor.y =  row*118+ 10*(row+1)
            // Opt-in to interactivity
            contor.interactive = true;
            contor['type'] = item
            contor['front'] = false
            // Shows hand cursor
            contor.cursor = 'pointer';
            cardList[index]= contor

            contor.on('pointerdown', ()=>{
                this.onCardClick(contor)
            });
            PixiApp.stage.addChild(contor);
        })
    },
    onCardClick(card){
        if(!isBegin){
            return
        }
        isBegin = false
        const [front,back ] = card.children;
        back.texture =  PIXI.utils.TextureCache['mc_loading']
        setTimeout(async ()=>{
            let backCard = await playFlipAnimation(FLIP_TYPE.FRONT ,card)
            backCard['front'] = true
            if(backCard['type'] != 1){
                front.texture =  PIXI.utils.TextureCache['mc_bomb_triggered']
                this.gameOver()
                return
            }
            isBegin = true
        },500) 
    },
    beginGame(){
        cardList.forEach((item,index)=>{
            const [front,back ] = item.children;
            back.texture =  PIXI.utils.TextureCache['mc_unrevealed']
        })
        isBegin = true
    },
    gameOver(){
        isBegin = false
        playFipAllAnimation(FLIP_TYPE.FRONT,cardList)
    },
    createCard(type){
        let contor = new PIXI.Container()
        let fornt;
        if(type == 1){
            fornt = PIXI.utils.TextureCache['mc_star_triggered']
        }else{
            fornt = PIXI.utils.TextureCache['mc_bomb_revealed']
        }
        front = new PIXI.Sprite(fornt)
        front.x = 156/2
        front.y =  118/2
        front.anchor.x = 0.5
        front.anchor.y = 0.5
        contor.addChild(front)

        back = new PIXI.Sprite(PIXI.utils.TextureCache['mc_loading'])
        back.x = 156/2
        back.y =  118/2
        back.anchor.x = 0.5
        back.anchor.y = 0.5
        contor.addChild(back)
        return contor
    },

    get() {
        if (typeof PixiApp === 'undefined') {
            throw new Error('Run PixiEngine.init first');
        }

        return PixiApp;
    },
    getCanvas() {
        return PixiApp.view;
    },
};