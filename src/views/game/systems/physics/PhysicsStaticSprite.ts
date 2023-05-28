import { Texture, Sprite } from 'pixi.js';
import Matter from '../Matter';
import { AnimationManager   } from 'lottie-pixi';
import Ip from '../ip.json'

export default class PhysicsStaticSprite {
    public _id: number | string;
    protected _engine: any;
    public category: 1;

    public x!: number;
    public y!: number;

    public width!: number;
    public height!: number;

    public texture!: Texture;
    public type!: string;

    public _sprite!: Sprite;

    public _body: any;
    anim1;
    app;

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
        app
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
        this.app = app
        this.createPhysics()
        this.createSprite();
    }

    private createPhysics = ():  void => {
        let options: any = {
            friction: 0.3,
            frictionAir: 0.3,
            isSensor: true,
            mass:0.2 
        };
        // let options: any = {mass: 0, friction: 0, restitution: 0}

        if (this.type === 'circle') {
            this._body = Matter.Bodies.circle(this.x, this.y, this.width, options);
        } else {
            this._body = Matter.Bodies.rectangle(this.x, this.y, this.width, this.height,options);
        }
        this._body.bodyType = 'player'
    }

    private createSprite = ():  void => {
        const animationManager = new AnimationManager(this.app);
        this.anim1 = animationManager.parseAnimation({
            infinite: true,
            keyframes: Ip,
            autoStart:false
          });
        this._sprite = this.anim1.group //new Sprite();
        // this._sprite.addChild(anim1.group) ;
        // this._sprite.anchor.x = 0.3;
        // this._sprite.anchor.y = 0.65;
        // this._sprite.width = 317
        // this._sprite.height = 382
        this._sprite.position.x = this._body.position.x -100;
        this._sprite.position.y = this._body.position.y -150;


        }


    public update = (): void => {
        if (this._body) {
            this._sprite.position.x = this._body.position.x -100;
            this._sprite.position.y = this._body.position.y -150;
            this._sprite.rotation = this._body.angle;
        }
    }

    destroy () {
        Matter.World.remove(this._engine.world, this._body);
    }

    get body(): any {
        return this._body;
    }
    set body(newBody: any) {
        this._body = newBody;
    }

    get ani():any {
        return this.anim1
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