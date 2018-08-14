import * as PIXI from 'pixi.js';
import Signals from 'signals'
export default class Entity extends PIXI.Container {
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
        this.addChild(this.sprite);
        this.velocity = { x: 0, y: 0 }
        this.maxVel = 200;// * GAME_SCALES;
    }
    zeroVel() {
        this.velocity = { x: 0, y: 0 }
    }
    applyVelocity(angle) {
        this.velocity.x = Math.cos(angle) * this.maxVel
        this.velocity.y = Math.sin(angle) * this.maxVel
    }
    update(delta) {
        this.x += this.velocity.x * delta;
        this.y += this.velocity.y * delta;
        this.scaleSin += delta * 5;
        this.sprite.scale.x = this.startScale + Math.cos(this.scaleSin) * this.startScale * 0.1
        this.sprite.scale.y = this.startScale + Math.sin(this.scaleSin) * this.startScale * 0.1
    }
    protected() {
        this.isProtected = true;
        utils.addColorTween(this.sprite, this.sprite.tint, 0xFFFFFF);

    }
    unprotected() {
        this.isProtected = false;
        utils.addColorTween(this.sprite, this.sprite.tint, 0xFF0000);
    }
}