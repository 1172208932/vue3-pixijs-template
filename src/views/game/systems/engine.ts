import * as PIXI from 'pixi.js';
import * as TWEEN from "@tweenjs/tween.js";
import { playFlipAnimation, FLIP_TYPE, playFipAllAnimation } from "./animation";
import { shuffle } from "./utils"
import EventBus from '@/utils/eventbus';
import World from './World';
import Matter from './Matter';
import { throttle } from "@/utils/throttle"

let PixiApp: PIXI.Application;
let back, front;
let cardList;
let isBegin = false;
let isAutoSelect = false;
// 定义变量以存储触摸和鼠标事件的初始位置
let touchStartX = 0;
let mouseStartX = 0;
let isMouseDown = false;
export default class PixiEngine {
    public world: World;
    public engine: any;

    constructor(width: number, height: number) {
        this.init(width, height)
    }
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


        PixiApp = new PIXI.Application({ width, height, transparent: true });
        function animate(time) {
            requestAnimationFrame(animate)
            TWEEN.update(time)
        }
        requestAnimationFrame(animate)
        this.engine = Matter.Engine.create();
        this.engine.gravity.y = 0
        this.world = new World(this.engine, PixiApp);

        Matter.Engine.run(this.engine);

        // const debugRender = Matter.Render.create({
        //     element: document.querySelector(".game-box"),
        //     engine: this.engine,
        //     options: {
        //         width: 750,
        //         height: 1400,
        //         showCollisions: true,
        //         showVelocity: true
        //     }
        // });
        // Matter.Render.run(debugRender);
        // console.log(document.querySelector(".game-box"))
        // setTimeout(() => {
        //     document.querySelector(".game-box").querySelector(":nth-child(1)").style.opacity = 0.3

        // }, 1000)

        this.initgame()
        this.addEvent()
    }

    addEvent() {
        PixiApp.view.addEventListener('touchstart', (event) => {
            // 获取触摸事件的初始位置
            touchStartX = event.touches[0].clientX;
        });
        PixiApp.view.addEventListener('touchend', (event) => {
            // 获取触摸事件的结束位置
            const touchEndX = event.changedTouches[0].clientX;

            // 计算触摸事件的水平位移
            const deltaX = touchEndX - touchStartX;

            // 判断滑动方向
            if (Math.abs(deltaX) > 50) { // 设置一个阈值，以避免误判
                if (deltaX > 0) {
                    console.log('向右滑动');
                    this.rightSwitch()
                } else {
                    this.leftSwitch()
                    console.log('向左滑动');
                }
            }
        });
        PixiApp.view.addEventListener('mousedown', (event) => {
            // 获取鼠标事件的初始位置
            mouseStartX = event.clientX;
            isMouseDown = true;
        });
        PixiApp.view.addEventListener('mouseup', (event) => {
            if (!isMouseDown) return;

            // 获取鼠标事件的结束位置
            const mouseEndX = event.clientX;

            // 计算鼠标事件的水平位移
            const deltaX = mouseEndX - mouseStartX;

            // 判断滑动方向
            if (Math.abs(deltaX) > 50) { // 设置一个阈值，以避免误判
                if (deltaX > 0) {
                    console.log('向右滑动');
                    this.rightSwitch()
                } else {
                    this.leftSwitch()
                    console.log('向左滑动');
                }
            }
            isMouseDown = false;
        });
    }

    leftSwitch = throttle(() => {
        this.world.playerLeft()
    }, 500)
    rightSwitch = throttle(() => {
        this.world.playerRight()
    }, 500)



    initgame() {
        // let arr = new Array(22).fill(1).concat(new Array(3).fill(3))
        // cardList = shuffle(arr)
        const isTextUrl = import.meta.env.VITE_RESOURCE_URL;
        const loader = new PIXI.Loader();
        `${isTextUrl}bird/mines@2x.json`
        loader.add('barrier', `${isTextUrl}barrier.png`)
        loader.add('ip2', `${isTextUrl}Ip2.png`)
        loader.add('gold', `https://ysupup.oss-cn-hangzhou.aliyuncs.com/gold.png`)
        // loader.add(`${isTextUrl}bird/min.json`)
        loader.load(() => {
            setTimeout(() => {
                this.world.addPlayer();
            }, 2000)
            // this.addCards()
        })
    }

    beginGame() {
        this.world.gameOver = false
        this.world.player.ani.play()
    }


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
                if (contor['front']) { return }
                this.onCardClick(contor)
            });
            PixiApp.stage.addChild(contor);
        })
    }
    onCardClick(card) {
        if (!isBegin) {
            return
        }
        isBegin = false
        const [front, back] = card.children;
        if (isAutoSelect) {
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
    }
    randomClick() {
        let filerList = cardList.filter((item) => {
            return item['front'] == false
        })
        let randomCard = filerList[Math.floor(Math.random() * filerList.length)]
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

    }

    autoSelect() {
        cardList.forEach((item) => {
            item.destroy()
        });
        let arr = new Array(22).fill(1).concat(new Array(3).fill(3))
        cardList = shuffle(arr)
        this.addCards()
        this.beginGame()
        isAutoSelect = true
    }
    autoSelectClose() {
        cardList.forEach((item, index) => {
            const [front, back] = item.children;
            back.texture = PIXI.utils.TextureCache['mc_loading']
        })
        isAutoSelect = false
    }
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
    }

    gameOver() {
        isBegin = false
        playFipAllAnimation(FLIP_TYPE.FRONT, cardList)
    }
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
    }

    get() {
        if (typeof PixiApp === 'undefined') {
            throw new Error('Run PixiEngine.init first');
        }

        return PixiApp;
    }
    getCanvas() {
        return PixiApp.view;
    }
};