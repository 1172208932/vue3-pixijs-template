import { Texture, Sprite } from 'pixi.js';
import * as PIXI from 'pixi.js';
import * as Matter from 'matter-js';
import { GameConfig } from "./config"
import * as TWEEN from "@tweenjs/tween.js";

export default class Piece extends Sprite {
    protected _engine: any;
    public category: 1;
    public track: number
    public num: number
    public type!: string;
    public _sprite!: Sprite;
    itemType: number; //棋子类型 
    boardX:number;// x坐标
    boardY:number; // y坐标
    isEmpty:boolean = false; //是否消除
    constructor(texture) {
        super(texture);
        this.init()
        // this.createSprite();
    }

    onSelect() {
        this.width = 45
        this.height = 45
        const filter = new PIXI.filters.ColorMatrixFilter();
        const { matrix } = filter;
        let  count  = 0.1
        matrix[1] = Math.sin(count) * 3;
        matrix[2] = Math.cos(count);
        matrix[3] = Math.cos(count) * 1.5;
        matrix[4] = Math.sin(count / 3) * 2;
        matrix[5] = Math.sin(count / 2);
        matrix[6] = Math.sin(count / 4);
        this.filters = [filter];
        // this.scale.set(1.1);
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

    init() {
        this.width = 40
        this.height = 40
        this.filters = null
    }

    destroy() {
    }

    remove(){
        this.isEmpty = true
        this.visible = false
    }

    get sprite(): Sprite {
        return this._sprite;
    }
    set sprite(newSprite: Sprite) {
        this._sprite = newSprite;
    }
}