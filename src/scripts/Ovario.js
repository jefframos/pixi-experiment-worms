import * as PIXI from 'pixi.js';
import Signals from 'signals'
export default class Ovario extends PIXI.Container {
    constructor(radius = 80) {
        super();
        this.sprite = new PIXI.Sprite.from('assets/game/head.png');
        this.sprite.anchor.set(0.5);
        // this.ovulo.x = config.width / 2;
        // this.ovulo.y = config.height / 2;
        this.radius = radius;
        this.startScale = this.radius / this.sprite.height;
        this.scaleSin = Math.random();
        this.sprite.scale.set(this.startScale);
        this.sprite.interactive = true;
        this.sprite.buttonMode = true;
        this.addChild(this.sprite)
    }
    hit(){
        // console.log('HIT');
        
    }
    update(delta) {
        this.scaleSin += delta * 5;
        this.sprite.scale.x = this.startScale + Math.cos(this.scaleSin) * this.startScale * 0.005
        this.sprite.scale.y = this.startScale + Math.sin(this.scaleSin) * this.startScale * 0.005
        this.sprite.rotation = this.scaleSin / 60
        this.sprite.x =  Math.cos(this.scaleSin) * this.radius * 0.0075
        this.sprite.y =  Math.sin(this.scaleSin) * this.radius * 0.005
    }
}