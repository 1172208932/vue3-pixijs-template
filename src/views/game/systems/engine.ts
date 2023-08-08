import * as PIXI from 'pixi.js';
import * as TWEEN from "@tweenjs/tween.js";
import EventBus from '@/utils/eventbus';
import World from './World';
import { throttle } from "@/utils/throttle"
import { GameConfig, manifest } from "./config"
import Piece from "./Piece"
import { shuffle } from "./utils"
let PixiApp: PIXI.Application;

export default class PixiEngine {
    public world: World;
    public engine: any;
    boardContainer;
    Board: any[];
    pieceList: any[]
    constructor(width: number, height: number) {
        this.init(width, height)
    }
    init(width: number, height: number) {
        if (typeof PixiApp !== 'undefined') {
            PixiApp.destroy();
        }
        EventBus.on('BEGIN_GAME', this.beginGame, this)
        EventBus.on('GAME_OVER_WORLD', this.gameOver, this)
        EventBus.on('RESET_GAME', this.resetGame, this)


        PixiApp = new PIXI.Application({ width, height, backgroundAlpha: 0, resizeTo: window });
        function animate(time) {
            requestAnimationFrame(animate)
            TWEEN.update(time)
        }
        requestAnimationFrame(animate)

        this.initgame()
    }



    resetGame() {
        this.world.resetGame()
    }


    initgame = async () => {

        await PIXI.Assets.init({ manifest });

        // Load a bundle...
        // let    loadScreenAssets =
        await PIXI.Assets.loadBundle('load-screen');
        // console.log(loadScreenAssets)
        this.boardContainer = new PIXI.Container();
        this.boardContainer.x = 50
        this.boardContainer.y = 100

        PixiApp.stage.addChild(this.boardContainer)

        this.initBoard()
        this.initPieces()
        this.fillBoard()
    }
    // 初始化棋盘
    initBoard() {
        this.Board = new Array(GameConfig.row).fill(new Array(GameConfig.col))
        console.log(this.Board)
    }
    // 初始化棋子
    initPieces() {
        let random

        this.pieceList = []
        for (let i = 0; i < GameConfig.row * GameConfig.col; i++) {
            if (i % 2 == 0) {
                random = Math.floor(Math.random() * 3) + 1
            }
            this.pieceList.push(new Piece(PIXI.Texture.from('icon' + random)))
        }


        this.pieceList = shuffle(this.pieceList)
    }
    // 填充棋盘
    fillBoard() {
        for (let row = 0; row < GameConfig.row; row++) {
            for (let col = 0; col < GameConfig.col; col++) {
                let item = this.pieceList[row * GameConfig.row + col]
                item.x = row * 25
                item.y = col * 25
                item.eventMode = 'static';
                item.cursor = 'pointer';
                item.on('pointerdown', this.onItemClick);
                this.boardContainer.addChild(item);
            }
        }
    }

    onItemClick(e){
        let {target} = e;
        
        console.log(e)
    }

    beginGame() {
        this.world.beginGame()
    }

    gameOver() {
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