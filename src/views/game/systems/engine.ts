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
    pieceList: any[];
    firstClickPiecr: Piece | null = null;   // 先点中的棋子
    points: any[] = [];
    constructor(width: number, height: number) {
        this.init(width, height)
    }
    init(width: number, height: number) {
        if (typeof PixiApp !== 'undefined') {
            PixiApp.destroy();
        }
        // EventBus.on('BEGIN_GAME', this.beginGame, this)
        // EventBus.on('GAME_OVER_WORLD', this.gameOver, this)
        EventBus.on('RESET_GAME', this.resetGame, this)
        EventBus.on('RANDOM_GAME', this.randomGame, this)
        EventBus.on('AGAIN_GAME', this.againGame, this)

        


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
        this.Board = Array.from(new Array(GameConfig.row + 2).fill(0), () =>
            new Array(GameConfig.col + 2).fill({
                isEmpty: true
            })
        )
    }
    // 初始化棋子
    initPieces() {
        let random
        this.pieceList = []
        for (let i = 0; i < GameConfig.row * GameConfig.col; i++) {
            if (i % 2 == 0) {
                random = Math.floor(Math.random() * 3) + 1
            }
            let piece = new Piece(PIXI.Texture.from('icon' + random))
            piece.anchor.x = 0.5
            piece.anchor.y = 0.5

            piece.itemType = random
            this.pieceList.push(piece)
        }
        this.pieceList = shuffle(this.pieceList)
    }
    // 填充棋盘
    fillBoard() {
        for (let row = 0; row < (GameConfig.row + 2); row++) {
            for (let col = 0; col < (GameConfig.col + 2); col++) {
                if (col == 0 || row == 0 || row == (GameConfig.row + 1) || col == (GameConfig.col + 1)) {
                    this.Board[col][row] = {
                        x: row * 50,
                        y: col * 50,
                        isEmpty: true
                    }
                } else {
                    let item = this.pieceList[(row - 1) * GameConfig.row + (col - 1)]
                    item.x = row * 50
                    item.y = col * 50
                    item.boardX = row
                    item.boardY = col
                    item.eventMode = 'static';
                    item.cursor = 'pointer';
                    item.on('pointerdown', (e) => {
                        this.onItemClick(item)
                    });
                    this.boardContainer.addChild(item);
                    this.Board[col][row] = item
                }
            }
        }
        console.log(this.Board)
    }

    randomGame() {
        this.points = [];
        if (this.firstClickPiecr != null) {
            this.firstClickPiecr.init()
            this.firstClickPiecr = null
        }
        this.pieceList = shuffle(this.pieceList);
        for (let row = 0; row < (GameConfig.row + 2); row++) {
            for (let col = 0; col < (GameConfig.col + 2); col++) {
                if (col == 0 || row == 0 || row == (GameConfig.row + 1) || col == (GameConfig.col + 1)) {
                    this.Board[col][row] = {
                        x: row * 50,
                        y: col * 50,
                        isEmpty: true
                    }
                } else {
                    let item = this.pieceList[(row - 1) * GameConfig.row + (col - 1)]
                    item.x = row * 50
                    item.y = col * 50
                    item.boardX = row
                    item.boardY = col
                    item.eventMode = 'static';
                    item.cursor = 'pointer';
                    // item.removeEventListener('pointerdown')
                    // item.on('pointerdown', (e) => {
                    //     this.onItemClick(item)
                    // });
                    this.Board[col][row] = item
                }
            }
        }
    }

    againGame(){
        this.points = [];
        if (this.firstClickPiecr != null) {
            this.firstClickPiecr.init()
            this.firstClickPiecr = null
        }
        this.pieceList.forEach(item=>{
            item.init()
        })
        this.pieceList = shuffle(this.pieceList);
        for (let row = 0; row < (GameConfig.row + 2); row++) {
            for (let col = 0; col < (GameConfig.col + 2); col++) {
                if (col == 0 || row == 0 || row == (GameConfig.row + 1) || col == (GameConfig.col + 1)) {
                    this.Board[col][row] = {
                        x: row * 50,
                        y: col * 50,
                        isEmpty: true
                    }
                } else {
                    let item = this.pieceList[(row - 1) * GameConfig.row + (col - 1)]
                    item.x = row * 50
                    item.y = col * 50
                    item.boardX = row
                    item.boardY = col
                    item.eventMode = 'static';
                    item.cursor = 'pointer';
                    // item.removeEventListener('pointerdown')
                    // item.on('pointerdown', (e) => {
                    //     this.onItemClick(item)
                    // });
                    this.Board[col][row] = item
                }
            }
        }
    }

    onItemClick(target) {
        console.log(11111)
        if (target == this.firstClickPiecr) { return }
        if (this.firstClickPiecr == null) {
            this.firstClickPiecr = target
        } else {
            if (target.itemType == this.firstClickPiecr.itemType) {
                // 点中相同元素
                let res = this.canCleanup(this.firstClickPiecr.boardX, this.firstClickPiecr.boardY, target.boardX, target.boardY)
                console.log(res, 'canCleanup')
                if (res) {
                    this.firstClickPiecr.init()
                    this.firstClickPiecr.remove()
                    target.remove()
                    this.firstClickPiecr = null
                    console.log(this.Board)
                    this.drawLine();

                } else {
                    this.firstClickPiecr.init()
                    this.firstClickPiecr = target
                }
            } else {
                this.firstClickPiecr.init()
                this.firstClickPiecr = target
            }
        }

        target.onSelect()
    }

    drawLine() {
        console.log(this.points)

        const realPath = new PIXI.Graphics();

        realPath.lineStyle(2, 0xFFFFFF, 1);
        this.points.forEach((item, index) => {
            let peer = this.Board[item[1]][item[0]]
            if (index == 0) {
                realPath.moveTo(peer.x, peer.y);
            } else {
                realPath.lineTo(peer.x, peer.y);
            }
        })

        realPath.position.x = 0;
        realPath.position.y = 0;

        this.boardContainer.addChild(realPath);
        setTimeout(() => {
            realPath.destroy()
        }, 300)
    }

    addPoints(...args: any[]): void {
        for (let i = 0; i < args.length; i++) {
            this.points.push(args[i]);
        }
    }

    isColEmpty(x1, y1, x2, y2) {
        if (x1 != x2) {
            return false;
        }
        y1 > y2 && (y1 = y1 + y2, y2 = y1 - y2, y1 = y1 - y2); //强制y1比y2小

        for (var i = y1 + 1; i < y2; ++i) { //from (x2+1,y2) to (x1-1,y2);
            if (!this.Board[i][x1].isEmpty) {
                return false;
            }
        }
        return true;
    }

    isRowEmpty(x1, y1, x2, y2) {
        if (y1 != y2) {
            return false;
        }
        x1 > x2 && (x1 = x1 + x2, x2 = x1 - x2, x1 = x1 - x2); //强制x1比x2小
        for (var j = x1 + 1; j < x2; ++j) { //from (x2,y2+1) to (x2,y1-1);
            if (!this.Board[y1][j].isEmpty) {
                return false;
            }
        }
        return true;
    }

    canCleanup(x1, y1, x2, y2) {
        this.points = [];
        let cols = GameConfig.col + 2
        let rows = GameConfig.row + 2

        if (x1 === x2) {
            if (1 === y1 - y2 || 1 === y2 - y1) { //相邻
                this.addPoints([x1, y1], [x2, y2]);
                return true;
            } else if (this.isColEmpty(x1, y1, x2, y2)) { //直线
                this.addPoints([x1, y1], [x2, y2]);
                return true;
            } else { //两个拐点	(优化)
                var i = 1;
                while ((x1 + i < cols) && this.Board[y1][x1 + i].isEmpty) {
                    if (!this.Board[y2][x2 + i].isEmpty) {
                        break;
                    } else {
                        if (this.isColEmpty(x1 + i, y1, x1 + i, y2)) {
                            this.addPoints([x1, y1], [x1 + i, y1], [x1 + i, y2], [x2, y2]);
                            return true;
                        }
                        i++;
                    }
                }
                i = 1;
                while ((x1 - i >= 0) && this.Board[y1][x1 - i].isEmpty) {
                    if (!this.Board[y2][x2 - i].isEmpty) {
                        break;
                    } else {
                        if (this.isColEmpty(x1 - i, y1, x1 - i, y2)) {
                            this.addPoints([x1, y1], [x1 - i, y1], [x1 - i, y2], [x2, y2]);
                            return true;
                        }
                        i++;
                    }
                }

            }
        }

        if (y1 === y2) { //同行
            if (1 === x1 - x2 || 1 === x2 - x1) {
                this.addPoints([x1, y1], [x2, y2]);
                return true;
            } else if (this.isRowEmpty(x1, y1, x2, y2)) {
                this.addPoints([x1, y1], [x2, y2]);
                return true;
            } else {
                var i = 1;
                while ((y1 + i < rows) && this.Board[y1 + i][x1].isEmpty) {
                    if (!this.Board[y2 + i][x2].isEmpty) {
                        break;
                    } else {
                        if (this.isRowEmpty(x1, y1 + i, x2, y1 + i)) {
                            this.addPoints([x1, y1], [x1, y1 + i], [x2, y1 + i], [x2, y2]);
                            return true;
                        }
                        i++;
                    }
                }
                i = 1;
                while ((y1 - i >= 0) && this.Board[y1 - i][x1].isEmpty) {
                    if (!this.Board[y2 - i][x2].isEmpty) {
                        break;
                    } else {
                        if (this.isRowEmpty(x1, y1 - i, x2, y1 - i)) {
                            this.addPoints([x1, y1], [x1, y1 - i], [x2, y1 - i], [x2, y2]);
                            return true;
                        }
                        i++;
                    }
                }
            }
        }

        //一个拐点
        if (this.isRowEmpty(x1, y1, x2, y1) && this.Board[y1][x2].isEmpty) { // (x1,y1) -> (x2,y1)
            if (this.isColEmpty(x2, y1, x2, y2)) { // (x1,y2) -> (x2,y2)
                this.addPoints([x1, y1], [x2, y1], [x2, y2]);
                return true;
            }
        }
        if (this.isColEmpty(x1, y1, x1, y2) && this.Board[y2][x1].isEmpty) {
            if (this.isRowEmpty(x1, y2, x2, y2)) {
                this.addPoints([x1, y1], [x1, y2], [x2, y2]);
                return true;
            }
        }

        //不在一行的两个拐点
        if (x1 != x2 && y1 != y2) {
            i = x1;
            while (++i < cols) {
                if (!this.Board[y1][i].isEmpty) {
                    break;
                } else {
                    if (this.isColEmpty(i, y1, i, y2) && this.isRowEmpty(i, y2, x2, y2) && this.Board[y2][i].isEmpty) {
                        this.addPoints([x1, y1], [i, y1], [i, y2], [x2, y2]);
                        return true;
                    }
                }
            }

            i = x1;
            while (--i >= 0) {
                if (!this.Board[y1][i].isEmpty) {
                    break;
                } else {
                    if (this.isColEmpty(i, y1, i, y2) && this.isRowEmpty(i, y2, x2, y2) && this.Board[y2][i].isEmpty) {
                        this.addPoints([x1, y1], [i, y1], [i, y2], [x2, y2]);
                        return true;
                    }
                }
            }

            i = y1;
            while (++i < rows) {
                if (!this.Board[i][x1].isEmpty) {
                    break;
                } else {
                    if (this.isRowEmpty(x1, i, x2, i) && this.isColEmpty(x2, i, x2, y2) && this.Board[i][x2].isEmpty) {
                        this.addPoints([x1, y1], [x1, i], [x2, i], [x2, y2]);
                        return true;
                    }
                }
            }

            i = y1;
            while (--i >= 0) {
                if (!this.Board[i][x1].isEmpty) {
                    break;
                } else {
                    if (this.isRowEmpty(x1, i, x2, i) && this.isColEmpty(x2, i, x2, y2) && this.Board[i][x2].isEmpty) {
                        this.addPoints([x1, y1], [x1, i], [x2, i], [x2, y2]);
                        return true;
                    }
                }
            }
        }

        return false;
    }

    beginGame() {
    }

    gameOver() {
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