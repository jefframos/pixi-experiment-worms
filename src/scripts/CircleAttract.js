import * as PIXI from 'pixi.js';
import Ray from './Ray'
import Trail from './effects/Trail'
export default class CircleAttract extends PIXI.Container {
    constructor(radius = 80) {
        super();
        this.sprite = new PIXI.Sprite.from('assets/game/ovulo.png');
        this.sprite.anchor.set(0.5);
        this.sprite.alpha = 0

        radius *= 3
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

        this.rays = [];
        for (let index = 0; index < 10; index++) {
            let trail = new Trail(this, 30, 'assets/game/spark.png');
            trail.trailTick = 2;
            trail.speed = 0.75;
            trail.frequency = 0.0001

            trail.sin = Math.random() * 5;
            trail.pos = {x:0,y:0}
            trail.pos.x = Math.cos( trail.sin) * this.sprite.width /2//+ this.x
            trail.pos.y = Math.sin( trail.sin) * this.sprite.height /2//+ this.y

            trail.update(0, trail.pos)
            trail.mesh.tint = 0x5cb8ff;
            trail.mesh.alpha = 0.75;

            trail.adj = Math.random() * 20 -10
            //thunder
            // trail.mesh.tint = 0x5cb8ff//this.color;
            trail.mesh.blendMode = PIXI.BLEND_MODES.ADD;
    
            trail.speed = Math.random() > 0.5 ? 1 : -1
            this.rays.push(trail)
        }
        



        
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
        this.scaleSin += delta;
        this.sprite.scale.x = this.startScale + Math.cos(this.scaleSin) * this.startScale * 0.05
        this.sprite.scale.y = this.startScale + Math.sin(this.scaleSin) * this.startScale * 0.05

        delta *= 3
        for (let index = 0; index < this.rays.length; index++) {
            const element = this.rays[index];
            element.sin += delta * element.speed
            element.pos.x = Math.cos( element.sin) * (this.sprite.width + element.adj) /2//+ this.x
            element.pos.y = Math.sin( element.sin) * (this.sprite.height + element.adj) /2//+ this.y
            element.update(delta, element.pos)
        }
            
        //     element.sin += delta
        //    element.collideFrameSkip = 20
        //    element.collideTimer = 20
        //    element.recalcAngleSpeedTimer = 20
        //    element.vel.x = Math.cos( element.sin) * 50 //+ element.x
        //    element.vel.y = Math.sin( element.sin) * 50 //+ element.y
        //    element.update(delta)
        // }
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