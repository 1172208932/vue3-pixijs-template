import { Texture, Sprite } from 'pixi.js';
import Matter from '../Matter';

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

    constructor(
        id: number | string,
        engine: any,
        category: 1,
        x: number,
        y: number,
        width: number,
        height: number,
        texture: Texture,
        type: string = 'rectangle'
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

        this.createPhysics()
        this.createSprite();
    }

    private createPhysics = ():  void => {
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
            this._body = Matter.Bodies.rectangle(this.x, this.y, this.width, this.height, options);
        }
        this._body.bodyType = 'glod'
    }

    private createSprite = ():  void => {
        this._sprite = new Sprite(this.texture);
        this._sprite.anchor.x = 0.5;
        this._sprite.anchor.y = 0.5;
        this._sprite.width = 109
        this._sprite.height = 111
        this._sprite.scale.x = 0.1
        this._sprite.scale.y = 0.1
        }


    public update = (): void => {
        if (this._body) {
            this._sprite.position = this._body.position;
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