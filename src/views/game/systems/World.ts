import { Application, Texture } from 'pixi.js';
// import Matter from './Matter';
import * as Matter from 'matter-js';
import Glod from './Glod';
import Player from './Player'

export default class World {
    private _engine: any;

    public app: Application;

    public glodList: Glod[] = [];
    public player

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
                    console.log('Box A and Box B have collided!');
                }
            }
        });

    }

    addPlayer() {
        let playerTexture: Texture = Texture.from('gold');
        this.player = new Player('Line', this._engine, 0x001, 375, 1320, 1500, 40, playerTexture);
        Matter.Body.setStatic(this.player.body, true);

        Matter.World.addBody(this._engine.world, this.player.body);
        this.app.stage.addChild(this.player.sprite);
    }

    addGold() {
        let goldTexture: Texture = Texture.from('gold');
        let player = new Glod('glod', this._engine, 0x001, 354, 130, 40, 40, goldTexture, this.glodList.length);
        // Matter.Body.setStatic(player.body, true);

        Matter.World.addBody(this._engine.world, player.body);
        this.app.stage.addChild(player.sprite);
        this.glodList.push(player)
    }

    private update = (): void => {
        if (this.glodList.length) {
            this.glodList.forEach(glod => {
                if (glod?.update && glod) {
                    if (glod._sprite.position.y >= 2000) {
                        glod.destroy()
                        glod._sprite.destroy()
                        this.glodList.splice(glod.num, 1)
                    } else {
                        glod.update();
                    }

                }
            })
        }


    }
}