import { Texture } from 'pixi.js';
import PhysicsStaticSprite from "./physics/PhysicsStaticSprite";

export default class Player extends PhysicsStaticSprite {
    constructor(
        id: number | string,
        engine: any,
        category: 1,
        x: number,
        y: number,
        width: number,
        height: number,
        texture: Texture,
    ) {
        super(id, engine, category, x, y, width, height, texture);
    }
}