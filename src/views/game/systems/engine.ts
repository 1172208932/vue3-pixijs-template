import * as PIXI from 'pixi.js';
import * as TWEEN from "@tweenjs/tween.js";
import { playFlipAnimation, FLIP_TYPE, playFipAllAnimation } from "./animation";
import { shuffle } from "./utils"
import EventBus from '@/utils/eventbus';
import World from './World';
import Matter from './Matter';
import { throttle } from "@/utils/throttle"

let PixiApp: PIXI.Application;
let cardList;
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
        EventBus.on('GAME_OVER_WORLD', this.gameOver, this)


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
        const isTextUrl = import.meta.env.VITE_RESOURCE_URL;
        const loader = new PIXI.Loader();
        loader.add('barrier', `${isTextUrl}barrier.png`)
        loader.add('ip2', `${isTextUrl}Ip2.png`)
        loader.add('gold', `${isTextUrl}gold.png`)
        loader.load(() => {
                this.world.addPlayer();
        })
    }

    beginGame() {
        this.world.gameOver = false
        this.world.player.ani.play()
    }

    gameOver(){
        this.world.gameOverFn()
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