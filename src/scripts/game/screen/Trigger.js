import * as PIXI from 'pixi.js';
import Signals from 'signals';
export default class Trigger extends PIXI.Container
{
    constructor(radius)
    {
        super()
        this.radius = radius;
        this.circleCollision = new PIXI.Graphics().lineStyle(3 + Math.random() * 5,0xF25a0e).drawCircle(0,0,radius);
        this.circleCollision.alpha = 0;
        // this.circleCollision.anchor.set(0.5);
        // this.circleCollision.scale.set(radius / this.circleCollision.width);
        this.addChild(this.circleCollision);
    }
    reset(message = 'MESSAGE', block = false){
        this.message = message;
        this.block = block;
    }
    update(delta)
    {

    }
    
}