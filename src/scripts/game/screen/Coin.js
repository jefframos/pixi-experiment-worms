import * as PIXI from 'pixi.js';
import Signals from 'signals';
export default class Coin extends PIXI.Container
{
    constructor(radius)
    {
        super()
        this.radius = radius;
        this.circleCollision = new PIXI.Sprite.from('pickup.png');
        this.circleCollision.anchor.set(0.5);
        this.circleCollision.scale.set(radius / this.circleCollision.width * 0.65);
        this.addChild(this.circleCollision);
        this.sin = Math.random();
    }
    update(delta)
    {
        this.sin += delta * 5;
        this.circleCollision.y = Math.sin(this.sin) * this.radius * 0.1;
    }
}