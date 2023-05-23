import { Application, Texture } from 'pixi.js';
// import Matter from './Matter';
import * as Matter from 'matter-js';
import Glod from './Glod';
import Player from './Player'
import * as TWEEN from "@tweenjs/tween.js";
let trackTime = 5;

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

    constructor(
        engine: any,
        app: Application
    ) {
        this._engine = engine;

        this.app = app;


        this.app.ticker.add(this.update);
        Matter.Events.on(engine, 'collisionStart', (event) => {
            const pairs = event.pairs;

            // 遍历所有碰撞对
            for (let i = 0; i < pairs.length; i++) {
                const pair = pairs[i];

                // 如果碰撞对包含 boxA 和 boxB，则输出消息
                if ((pair.bodyA?.bodyType == 'glod' && pair.bodyB === this.player.body) || (pair.bodyA === this.player.body && pair.bodyB?.bodyType == 'glod')) {
                    if (pair.bodyA?.bodyType == 'glod') {
                        console.log(pair.bodyA, '1')
                        this.removeGlod(pair.bodyB?.num)
                    }
                    if (pair.bodyB?.bodyType == 'glod') {
                        console.log(pair.bodyB, '12')
                        this.removeGlod(pair.bodyB?.num)
                    }
                }

                if ((pair.bodyA?.bodyType == 'barrier' && pair.bodyB === this.player.body) || (pair.bodyA === this.player.body && pair.bodyB?.bodyType == 'barrier')) {
                    if (pair.bodyA?.bodyType == 'barrier') {
                        this.removeGlod(pair.bodyB?.num)
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
        this.gameOver = true
        this.glodList.forEach(glod => {
            glod.destroy()
            glod._sprite.destroy()
            this.glodList.delete(glod.num)
        })
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
        const Player = new TWEEN.Tween(this.player._body.position);
        console.log(this.trackList[this.nowPlayTrack - 2])
        Player.to({ x: this.trackList[this.nowPlayTrack - 2] }, 500).start().onComplete(() => {
            this.nowPlayTrack -= 1
        });
    }
    playerRight() {
        if (this.gameOver) { return }
        if (this.nowPlayTrack == 3) { return }
        const Player = new TWEEN.Tween(this.player._body.position);
        Player.to({ x: this.trackList[this.nowPlayTrack] }, 500).start().onComplete(() => {
            this.nowPlayTrack += 1
        });
    }

    //  [50,375,700]
    addPlayer() {
        let playerTexture: Texture = Texture.from('ip2');
        this.player = new Player('player', this._engine, 0x001, 375, 1020, 117, 182, playerTexture);
        // Matter.Body.setStatic(this.player.body, true);

        Matter.World.addBody(this._engine.world, this.player.body);
        this.app.stage.addChild(this.player.sprite);
    }

    beginGame() {

    }

    addGoldTrack(track) {
        setTimeout(() => {
            trackTime--;
            if (trackTime == 0) {
                this.addBarrier(track)
            } else {
                this.addGold(track)
            }
            if (trackTime == 0) {
                trackTime = 5
                return
            }
            this.addGoldTrack(track);

        }, 500)
    }
    // [[354,130][-10, 1230]]  [374   374]    [ 754]
    addGold(track) {
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
            if (this.distance == 400) {
                this.distance = 0
                this.addGoldTrack(Math.floor(Math.random()*3))
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