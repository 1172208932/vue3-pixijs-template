import { Application, Texture } from 'pixi.js';
// import Matter from './Matter';
import * as Matter from 'matter-js';
import Glod from './Glod';
import Player from './Player'
import * as TWEEN from "@tweenjs/tween.js";
import EventBus from '@/utils/eventbus';

let trackTime = 6;
let timerOut
export default class World {
    private _engine: any;

    public app: Application;
    public nowPlayTrack: number = 2 // 1,2,3
    public trackList: number[] = [50, 375, 700]
    public glodOffset = [[354, -10], [374, 374], [394, 754]]

    // public glodList: Glod[] = [];
    public glodList = new Map()
    public glodId = 0
    public distance: number = 0;
    public player
    public gameOver = true
    public glodEatNum:number = 0;
    public maxGlodNum:number = 50

    constructor(
        engine: any,
        app: Application
    ) {
        this._engine = engine;

        this.app = app;


       
        Matter.Events.on(engine, 'collisionStart', (event) => {
            const pairs = event.pairs;

            // 遍历所有碰撞对
            for (let i = 0; i < pairs.length; i++) {
                const pair = pairs[i];

                // 如果碰撞对包含 boxA 和 boxB，则输出消息
                if ((pair.bodyA?.bodyType == 'glod' && pair.bodyB === this.player.body) || (pair.bodyA === this.player.body && pair.bodyB?.bodyType == 'glod')) {
                    if (pair.bodyA?.bodyType == 'glod') {
                        console.log(pair.bodyA, '1')
                        this.removeGlod(pair.bodyA?.num)
                    }
                    if (pair.bodyB?.bodyType == 'glod') {
                        console.log(pair.bodyB, '12')
                        this.removeGlod(pair.bodyB?.num)
                    }
                    EventBus.fire('GET_STARE')
                }

                if ((pair.bodyA?.bodyType == 'barrier' && pair.bodyB === this.player.body) || (pair.bodyA === this.player.body && pair.bodyB?.bodyType == 'barrier')) {
                    if (pair.bodyA?.bodyType == 'barrier') {
                        this.removeGlod(pair.bodyA?.num)
                        this.gameOverFn()
                    }
                    if (pair.bodyB?.bodyType == 'barrier') {
                        console.log(pair.bodyB, '12')
                        this.removeGlod(pair.bodyB?.num)
                        this.gameOverFn()
                    }
                }
            }
        });
    }

    gameOverFn() {
        clearTimeout(timerOut);
        trackTime = 6

        this.gameOver = true
        this.player.ani.pause()
        EventBus.fire('GAME_OVER')
        console.log(this.glodList,'this.glodListthis.glodList')
        this.glodList.forEach(glod => {
            glod.destroy()
            glod._sprite.destroy()
            this.glodList.delete(glod.num)
        })
        console.log(this.glodList,'this.glodListthis.glodList')
    }

    removeGlod(num) {
        this.glodList.get(num).destroy()
        this.glodList.get(num)._sprite.destroy()
        this.glodList.delete(num)
        console.log(this.glodList)
    }

    playerLeft() {
        if (this.gameOver) { return }
        if (this.nowPlayTrack == 1) { return }
        // this.nowPlayTrack -= 1

        const Player = new TWEEN.Tween(this.player.body.position);
        Player.to({ x: this.trackList[this.nowPlayTrack - 2] }, 500).start().onComplete(() => {
        this.nowPlayTrack -= 1

            // Matter.Body.setPosition( this.player._body, {x: this.trackList[this.nowPlayTrack - 2],y:this.player._body.position.y});
        });
    }
    playerRight() {
        if (this.gameOver) { return }
        if (this.nowPlayTrack == 3) { return }

        const Player = new TWEEN.Tween(this.player.body.position);
        console.log(this.trackList[this.nowPlayTrack],'this.trackList[this.nowPlayTrack]')
        Player.to({ x: this.trackList[this.nowPlayTrack] }, 500).start().onComplete(() => {
            this.nowPlayTrack += 1

        //  Matter.Body.setPosition( this.player._body, {x: this.trackList[this.nowPlayTrack],y:this.player._body.position.y});
        });
    }

    //  [50,375,700]
    addPlayer() {
        let playerTexture: Texture = Texture.from('ip2');
        this.player = new Player('player', this._engine, 0x001, 375, 930, 117, 182, playerTexture,this.app);
        // Matter.Body.setStatic(this.player.body, true);
        // Matter.Body.setInertia(this.player.body,0.5)

        Matter.World.addBody(this._engine.world, this.player.body);

        this.app.stage.addChild(this.player.sprite);
    }

    beginGame() { 
        this.app.ticker.add(this.update);
        this.gameOver = false
        this.player.ani.play()
    }

    resetGame(){
        this.glodEatNum = 0;
        this.maxGlodNum = 25
        this.app.ticker.remove(this.update)
    }

    addGoldTrack(track) {
            timerOut =  setTimeout(() => {
            trackTime--;
            if (trackTime == 0) {
                this.addBarrier(track)
            } else {
                this.addGold(track)
            }
            if (trackTime == 0) {
                trackTime = 6
                return
            }
            this.addGoldTrack(track);

        }, 500)
    }
    // [[354,130][-10, 1230]]  [374   374]    [ 754]
    addGold(track) {
        this.glodEatNum ++ 
        if(this.glodEatNum>= this.maxGlodNum + 1){ return }
        let goldTexture: Texture = Texture.from('gold');
        let player = new Glod('glod', this._engine, 0x001, 394, 130, 40, 40, goldTexture, this.glodId, track, 'glod');
        // Matter.Body.setStatic(player.body, true);

        Matter.World.addBody(this._engine.world, player.body);
        this.app.stage.addChild(player.sprite);
        this.glodList.set(this.glodId, player)
        this.glodId++
    }

    addBarrier(track) {
        let goldTexture: Texture = Texture.from('barrier');
        let player = new Glod('glod', this._engine, 0x001, 394, 130, 40, 40, goldTexture, this.glodId, track, 'barrier');
        // Matter.Body.setStatic(player.body, true);

        Matter.World.addBody(this._engine.world, player.body);
        this.app.stage.addChild(player.sprite);
        this.glodList.set(this.glodId, player)
        this.glodId++
    }

    private update = (): void => {
        if (this.gameOver) { return }

        if (this.player?.update && this.player) {
            this.player?.update();
            this.distance++;
            if (this.distance == 1) {
                this.addGoldTrack(Math.floor(Math.random()*3))
            }
            if(this.distance == 350){
                this.distance = 0
            }
        }
        if (this.glodList.size) {
            this.glodList.forEach(glod => {
                if (glod?.update && glod) {
                    if (glod._sprite.position.y >= 2000) {
                        glod.destroy()
                        glod._sprite.destroy()
                        this.glodList.delete(glod.num)
                    } else {
                        glod.update();
                    }

                }
            })
        }


    }
}