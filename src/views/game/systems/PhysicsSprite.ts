import { Texture, Sprite } from 'pixi.js';
import * as Matter from 'matter-js';
import { GameConfig } from "./config"

export default class PhysicsSprite {
    public _id: number | string;
    protected _engine: any;
    public category: 1;

    public x!: number;
    public y!: number;
    public track: number
    public num: number


    public width!: number;
    public height!: number;

    public texture!: Texture;
    public type!: string;

    public _sprite!: Sprite;

    public _body: any;
    bodytype;
    isDestory: false;
    speed: number;
    addSpeed: number

    public glodOffset = [[354,-40],[374,374],[394,784]]


    constructor(
        id: number | string,
        engine: any,
        category: 1,
        x: number,
        y: number,
        width: number,
        height: number,
        texture: Texture,
        type: string = 'rectangle',
        track:number,
        num:number,
        bodytype
    ) {
        this._id = id;
        this._engine = engine;
        this.category = category;

        this.x = x;
        this.y = y;

        this.width = width;
        this.height = height;

        this.texture = texture;
        this.type = type;

        this.track = track
        this.num = num
        this.bodytype = bodytype
        this.addSpeed = GameConfig.addSpeed
        this.speed = GameConfig.speed
        this.createPhysics()
        this.createSprite();
    }

    private createPhysics = (): void => {
        let options: any = {
            frictionAir: 0.2,
            friction: 1,
            inertia: Infinity,
            isSensor: true,
            label: this._id,
            mass: 1,
            restitution: 0,
            collisionFilter: {
                mask: this.category
            }
        };

        if (this.type === 'circle') {
            this._body = Matter.Bodies.circle(this.x, this.y, this.width, options);
        } else {
            this._body = Matter.Bodies.rectangle(this.x, this.y, 109, 111,{isSensor:true});
        }
        this._body.bodyType =  this.bodytype 
        this._body.num = this.num
    }

    private createSprite = (): void => {
        this._sprite = new Sprite(this.texture);
        this._sprite.anchor.x = 0.5;
        this._sprite.anchor.y = 0.5;
        // this._sprite.width = 109
        // this._sprite.height = 111
        this._sprite.scale.x = 0
        this._sprite.scale.y = 0
        this._sprite.position = this._body.position
    }

    setSpeed(speed){
        this.speed = speed
    }

    setScale = (y) => {
        //  glodOffset = [[354,-10],[374,374],[394,754]]
        let process = (y - 130) / (1230 - 130);
        this._body.position.x = this.glodOffset[this.track][0]  - ((this.glodOffset[this.track][0] - this.glodOffset[this.track][1] ) * process)

        this._sprite.scale.x = this._sprite.scale.y = 2.5 * process

        this._sprite.position = this._body.position
        this._sprite.rotation = this._body.angle;
    }

    public update = (): void => {
        if (this._body) {


            // this._body.position.y = 130
            // this._body.position.x = 354

            // this._sprite.position = this._body.position
            this._body.position.y += this.speed;
            this.speed = this.speed + this.addSpeed;


            this.setScale(this._body.position.y)

            // if(this._sprite.position.y >= 1000){
            //     this.destroy()
            //     this._sprite.destroy()
            //     console.log(this)
            // }

        }
    }

    destroy() {
        Matter.World.remove(this._engine.world, this._body);
    }

    get body(): any {
        return this._body;
    }
    set body(newBody: any) {
        this._body = newBody;
    }

    get sprite(): Sprite {
        return this._sprite;
    }
    set sprite(newSprite: Sprite) {
        this._sprite = newSprite;
    }

    get id(): number | string {
        return this._id;
    }
    set id(id: number | string) {
        this._id = id;
    }
}