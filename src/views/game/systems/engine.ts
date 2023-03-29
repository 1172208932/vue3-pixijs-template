import * as PIXI from 'pixi.js';
import * as TWEEN from "@tweenjs/tween.js";
import { playFlipAnimation, FLIP_TYPE, playFipAllAnimation } from "./animation";
import { shuffle } from "./utils"
import EventBus from '@/utils/eventbus';

let PixiApp: PIXI.Application;
let back, front;
let cardList;
let isBegin = false;
let isAutoSelect = false;
export const PixiEngine = {
    init(width: number, height: number) {
        if (typeof PixiApp !== 'undefined') {
            PixiApp.destroy();
        }
        EventBus.on('BEGIN_GAME', this.beginGame, this)
        EventBus.on('AUTO_SELECT', this.autoSelect, this)
        EventBus.on('AUTO_SELECT_CLOSE', this.autoSelectClose, this)

        
        EventBus.on('AGAIN_GAME', this.againGame, this)
        EventBus.on('OVER_GAME', this.gameOver, this)
        EventBus.on('RANDOM', this.randomClick, this)

        
        PixiApp = new PIXI.Application({ width, height, backgroundColor: 0x136FCE });
        function animate(time) {
            requestAnimationFrame(animate)
            TWEEN.update(time)
        }
        requestAnimationFrame(animate)
        this.initgame()
    },

    initgame() {
        let arr = new Array(22).fill(1).concat(new Array(3).fill(3))
        cardList = shuffle(arr)
        const isTextUrl = import.meta.env.VITE_RESOURCE_URL;
        const loader = new PIXI.Loader();
        // `${isTextUrl}bird/mines@2x.json`
        loader.add(`${isTextUrl}bird/min.json`).load(() => {
            this.addCards()
        })
    },

    addCards() {
        cardList.forEach((item, index) => {
            let contor = this.createCard(item);
            let row = index % 5
            let col = Math.floor(index / 5)
            contor.x = col * 156 + 10 * (col + 1)
            contor.y = row * 118 + 10 * (row + 1)
            // Opt-in to interactivity
            contor.interactive = true;
            contor['type'] = item
            contor['front'] = false
            // Shows hand cursor
            contor.cursor = 'pointer';
            cardList[index] = contor

            contor.on('pointerdown', () => {
                if(contor['front']){return}
                this.onCardClick(contor)
            });
            PixiApp.stage.addChild(contor);
        })
    },
    onCardClick(card) {
        if (!isBegin) {
            return
        }
        isBegin = false
        const [front, back] = card.children;
        if(isAutoSelect){
            back.texture = PIXI.utils.TextureCache['mc_selected']
            isBegin = true
            EventBus.fire('CAN_AUTO_SET')
            return
        }
        back.texture = PIXI.utils.TextureCache['mc_loading']
        setTimeout(async () => {
            let backCard = await playFlipAnimation(FLIP_TYPE.FRONT, card)
            backCard['front'] = true
            if (backCard['type'] != 1) {
                front.texture = PIXI.utils.TextureCache['mc_bomb_triggered']
                EventBus.fire('PLAY_SOUND', 'bomb')
                this.gameOver()
                return
            } else {
                front.texture = PIXI.utils.TextureCache['mc_star_triggered']
                EventBus.fire('PLAY_SOUND', 'win')
                EventBus.fire('GET_STARE')
            }
            isBegin = true
        }, 500)
    },
    randomClick(){
        let filerList = cardList.filter((item)=>{
            return item['front'] == false
        })
        let randomCard = filerList[Math.floor(Math.random()* filerList.length)] 
        isBegin = false
        const [front, back] = randomCard.children;
        back.texture = PIXI.utils.TextureCache['mc_loading']
        setTimeout(async () => {
            let backCard = await playFlipAnimation(FLIP_TYPE.FRONT, randomCard)
            backCard['front'] = true
            if (backCard['type'] != 1) {
                front.texture = PIXI.utils.TextureCache['mc_bomb_triggered']
                EventBus.fire('PLAY_SOUND', 'bomb')
                this.gameOver()
                return
            } else {
                front.texture = PIXI.utils.TextureCache['mc_star_triggered']
                EventBus.fire('PLAY_SOUND', 'win')
            }
            isBegin = true
        }, 500)
       
    },
    beginGame() {
        cardList.forEach((item, index) => {
            const [front, back] = item.children;
            back.texture = PIXI.utils.TextureCache['mc_unrevealed']
        })
        isBegin = true
    },
    autoSelect(){
        cardList.forEach((item) => {
            item.destroy()
        });
        let arr = new Array(22).fill(1).concat(new Array(3).fill(3))
        cardList = shuffle(arr)
        this.addCards()
        this.beginGame()
        isAutoSelect = true
    },
    autoSelectClose(){
        cardList.forEach((item, index) => {
            const [front, back] = item.children;
            back.texture = PIXI.utils.TextureCache['mc_loading']
        })
        isAutoSelect = false
    },
    againGame() {
        cardList.forEach((item) => {
            item.destroy()
        });
        let arr = new Array(22).fill(1).concat(new Array(3).fill(3))
        cardList = shuffle(arr)
        this.addCards()
        setTimeout(() => {
            this.beginGame()
        }, 500)
    },

    gameOver() {
        isBegin = false
        playFipAllAnimation(FLIP_TYPE.FRONT, cardList)
    },
    createCard(type) {
        let contor = new PIXI.Container()
        let fornt;
        if (type == 1) {
            fornt = PIXI.utils.TextureCache['mc_star_revealed']
        } else {
            fornt = PIXI.utils.TextureCache['mc_bomb_revealed']
        }
        front = new PIXI.Sprite(fornt)
        front.x = 156 / 2
        front.y = 118 / 2
        front.anchor.x = 0.5
        front.anchor.y = 0.5
        contor.addChild(front)

        back = new PIXI.Sprite(PIXI.utils.TextureCache['mc_loading'])
        back.x = 156 / 2
        back.y = 118 / 2
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