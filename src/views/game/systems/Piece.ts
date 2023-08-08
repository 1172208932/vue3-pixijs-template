import { Texture, Sprite } from 'pixi.js';
import * as Matter from 'matter-js';
import { GameConfig } from "./config"
import * as TWEEN from "@tweenjs/tween.js";

export default class Piece extends Sprite{
    protected _engine: any;
    public category: 1;
    public track: number
    public num: number
    public type!: string;
    public _sprite!: Sprite;
    constructor(texture ) {
        super(texture);
        this.width = 20
        this.height = 20
        // this.createSprite();
    }

    private createSprite = (): void => {
        this._sprite = new Sprite(this.texture);
        this._sprite.anchor.x = 0.5;
        this._sprite.anchor.y = 0.5;
        // this._sprite.width = 109
        // this._sprite.height = 111
        this._sprite.scale.x = 0
        this._sprite.scale.y = 0
    }

    destroy() {
    }

    get sprite(): Sprite {
        return this._sprite;
    }
    set sprite(newSprite: Sprite) {
        this._sprite = newSprite;
    }
}