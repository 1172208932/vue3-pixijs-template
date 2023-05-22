import { Texture } from 'pixi.js';
import PhysicsSprite from "./PhysicsSprite";

export default class Glod extends PhysicsSprite {
    num:number
    constructor(
        id: number | string,
        engine: any,
        category: 1,
        x: number,
        y: number,
        width: number,
        height: number,
        texture: Texture,
        num:number
    ) {
        super(id, engine, category, x, y, width, height, texture);
        this.num = num
    }
}