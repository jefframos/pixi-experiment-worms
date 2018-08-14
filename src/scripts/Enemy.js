import * as PIXI from 'pixi.js';
import Signals from 'signals'
export default class Enemy extends PIXI.Container {
    constructor(radius = 80) {
        super();
        this.ovulo = new PIXI.Sprite.from('assets/game/head.png');
        this.ovulo.anchor.set(0.5);
        // this.ovulo.x = config.width / 2;
        // this.ovulo.y = config.height / 2;
        this.radius = radius;
        this.startScale = this.radius / this.ovulo.height;
        this.scaleSin = Math.random();
        this.ovulo.scale.set(this.startScale);
        this.ovulo.interactive = true;
        this.ovulo.buttonMode = true;
        this.addChild(this.ovulo)
    }
    update(delta) {
        this.scaleSin += delta * 5;
        this.ovulo.scale.x = this.startScale + Math.cos(this.scaleSin) * this.startScale * 0.1
        this.ovulo.scale.y = this.startScale + Math.sin(this.scaleSin) * this.startScale * 0.1
    }
}