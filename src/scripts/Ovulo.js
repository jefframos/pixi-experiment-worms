import * as PIXI from 'pixi.js';
import Signals from 'signals'
export default class Entity extends PIXI.Container {
    constructor(radius = 80) {
        super();
        this.sprite = new PIXI.Sprite.from('assets/game/ovulo.png');
        this.sprite.anchor.set(0.5);
        // this.ovulo.x = config.width / 2;
        // this.ovulo.y = config.height / 2;
        this.mainRadius = radius;
        this.radius = radius;
        this.startScale = this.radius / this.sprite.height;
        this.scaleSin = Math.random();
        this.mainScale = this.startScale;
        this.sprite.scale.set(this.startScale);
        this.sprite.interactive = true;
        this.sprite.buttonMode = true;
        this.addChild(this.sprite);
        this.velocity = { x: 0, y: 0 }
        this.maxVel = 150 * GAME_SCALES;// * GAME_SCALES;
        this.resetVelocity();
        // this.isProtected = true;
    }
    zeroVel() {
        this.virtualVelocity = { x: 0, y: 0 }
    }
    applyVelocity(angle, mult = 1) {
        this.virtualVelocity.x = Math.cos(angle) * this.maxVel * mult
        this.virtualVelocity.y = Math.sin(angle) * this.maxVel * mult
    }
    update(delta) {
        this.udpateVelocity(delta);
        this.x += this.velocity.x * delta;
        this.y += this.velocity.y * delta;
        this.scaleSin += delta * 5;
        this.sprite.scale.x = this.startScale + Math.cos(this.scaleSin) * this.startScale * 0.075
        this.sprite.scale.y = this.startScale + Math.sin(this.scaleSin) * this.startScale * 0.075
    }
    hitted(){
        this.startScale += 0.02
        this.startScale = Math.min(this.startScale, this.mainScale * 5)
        this.radius = this.mainRadius * (this.startScale - this.mainScale  + 1)         
    }
    protected() {
        return
        if(this.isProtected){
            return;
        }
        this.isProtected = true;
        // utils.addColorTween(this.sprite, this.sprite.tint, 0xFFFFFF);

    }
    unprotected() {
        return
        if(!this.isProtected){
            return;
        }
        this.isProtected = false;
        // utils.addColorTween(this.sprite, this.sprite.tint, 0xFF0000);
    }
    udpateVelocity(delta) {
        let axis = ['x', 'y']
        for (var i = 0; i < axis.length; i++) {
            if (this.velocity[axis[i]] < this.virtualVelocity[axis[i]]) {
                this.velocity[axis[i]] += this.acceleration[axis[i]] * delta;
                if (this.velocity[axis[i]] > this.virtualVelocity[axis[i]]) {
                    this.velocity[axis[i]] = this.virtualVelocity[axis[i]];
                }
            }
            else if (this.velocity[axis[i]] > this.virtualVelocity[axis[i]]) {
                this.velocity[axis[i]] -= this.acceleration[axis[i]] * delta;
                if (this.velocity[axis[i]] < this.virtualVelocity[axis[i]]) {
                    this.velocity[axis[i]] = this.virtualVelocity[axis[i]];
                }
            }
        }

    }
    resetVelocity() {
        this.velocity = {
            x: 0,
            y: 0
        }
        this.virtualVelocity = {
            x: 0,
            y: 0
        }
        this.acceleration = {
            x: this.maxVel * GAME_SCALES * 2,//config.width * 0.05,
            y: this.maxVel * GAME_SCALES * 2//config.height * 0.02
        }
    }
}