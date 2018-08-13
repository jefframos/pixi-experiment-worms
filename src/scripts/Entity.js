import * as PIXI from 'pixi.js';
import Trail from './effects/Trail'
import Signals from 'signals'
export default class Entity extends PIXI.Container {
    constructor(parentContainer) {
        super();

        this.onOvuloCollide = new Signals();
        this.onKill = new Signals();
        this.entity = new PIXI.Sprite.from('assets/game/head2.png');//new PIXI.Graphics().beginFill(0xFFFFFF * Math.random()).drawCircle(0,0,5);
        this.innerHead = new PIXI.Sprite.from('assets/game/inner-head.png');//new PIXI.Graphics().beginFill(0xFFFFFF * Math.random()).drawCircle(0,0,5);
        // this.entity = new PIXI.Sprite.from('assets/game/pickup.png');//new PIXI.Graphics().beginFill(0xFFFFFF * Math.random()).drawCircle(0,0,5);
        this.radius = 40;
        this.color = 0xFFFFFF// * Math.random();
        this.entity.tint = this.color;
        this.addChild(this.entity)
        this.addChild(this.innerHead)
        this.entity.anchor.set(0.5, 0.7);
        this.innerHead.anchor.set(0.5);
        this.stdEntityScale = this.radius / this.entity.height;
        this.stdInnerHeadScale = this.radius / this.entity.height * 0.4;
        this.entity.scale.set(this.stdEntityScale)
        this.innerHead.scale.set(this.stdInnerHeadScale)
        // this.entity.y 
        // this.entity.rotation = Math.PI / 4
        this.sin = Math.random();
        this.cos = Math.random();

        this.parentContainer = parentContainer;

        let angPlusAccum = 5//15;
        this.maxVelocity = 80;
        this.maxAngularVelocity = 50;

        this.sinSpeed = (0.5 + Math.random()) * angPlusAccum;
        this.cosSpeed = (0.5 + Math.random()) * angPlusAccum;

        this.headBlinkSin = Math.random();
        this.headScaleSin = this.headBlinkSin;
        this.innerHeadScaleSin = this.headBlinkSin;

        this.angularSpeed = 0.005 + Math.random() * 0.005;
        this.recalcAng();

        window.ENTITY_ID++;
        this.id = window.ENTITY_ID;
        this.collideTimer = Math.random() * 1000 + 500;
    }
    reset() {
        this.isBeenAbsorved = false;
        this.entity.scale.set(this.stdEntityScale)
        this.innerHead.scale.set(this.stdInnerHeadScale)
        if (this.trail) {
            this.trail.reset(this.position);
            // this.trail.update(0.5, this.position)
        }
    }
    collide(entityList) {
        this.collideTimer--;
        if (this.collideTimer > 0) {
            return;
        }
        // return
        this.collideTimer = Math.random() * 1000 + 500;
        for (let index = 0; index < entityList.length; index++) {
            const element = entityList[index];
            if (element.id != this.id) {
                if (utils.distance(this.x, this.y, element.x, element.y) < element.radius) {
                    let targetAngle = Math.atan2(this.y - element.y, this.x - element.x) + Math.PI;
                    this.recalcAng(targetAngle + Math.PI);

                    // this.recalcAng()//targetAngle + Math.PI);
                    break
                }
            }
        }
    }
    setTarget(target, canAbsorb) {
        this.target = target;
        this.targetAngle = Math.atan2(this.y - this.target.y, this.x - this.target.x) + Math.PI;

        if (utils.distance(this.x, this.y, this.target.x, this.target.y) < this.target.width / 2) {
            if (canAbsorb) {

                this.onOvuloCollide.dispatch(this);
                this.recalcAng(this.targetAngle)// + Math.PI);
            } else {
                this.recalcAng(this.targetAngle + Math.PI);
            }
            this.headBlinkSin = 0;
        }

    }
    update(delta) {

        // delta *= 4
        // this.x += this.vel.x * delta;
        // this.y += this.vel.y * delta;
        let newSpeed = {
            x: (this.vel.x + Math.cos(this.cos) * this.angVel.x) * delta,
            y: (this.vel.y + Math.sin(this.sin) * this.angVel.y) * delta
        }
        this.x += newSpeed.x;
        this.y += newSpeed.y;

        this.cos += delta * this.cosSpeed;
        this.sin += delta * this.sinSpeed;

        if (this.vel.x > 0 && this.x > config.width ||
            this.vel.x < 0 && this.x < 0) {
            this.vel.x *= -1;
            this.recalcAng();
        }
        if (this.vel.y > 0 && this.y > config.height ||
            this.vel.y < 0 && this.y < 0) {
            this.vel.y *= -1;
            this.recalcAng();
        }
        if (!this.trail) {
            this.createTrail();
        }
        let newPos = {
            x: this.x + Math.cos(this.properAngle) * this.radius * 0.1,
            y: this.y + Math.sin(this.properAngle) * this.radius * 0.1
        }
        this.realAngle = Math.atan2(newSpeed.y, newSpeed.x)
        this.entity.rotation = this.realAngle - Math.PI / 2;
        this.trail.update(delta, newPos)//this.position)


        if (this.isBeenAbsorved) {
            return
        }
        this.headBlinkSin += delta * 6;
        this.headScaleSin += delta * 12;
        this.innerHeadScaleSin += delta * 6;
        let alpha = (Math.sin(this.headBlinkSin) * 0.3) + 0.65;

        this.entity.scale.x = this.stdEntityScale + Math.cos(this.headScaleSin) * this.stdEntityScale * 0.2;
        this.entity.scale.y = this.stdEntityScale + Math.sin(this.headScaleSin) * this.stdEntityScale * 0.2;

        this.innerHead.scale.x = this.stdInnerHeadScale + Math.cos(this.innerHeadScaleSin) * this.stdInnerHeadScale * 0.1;
        this.innerHead.scale.y = this.stdInnerHeadScale + Math.cos(this.innerHeadScaleSin) * this.stdInnerHeadScale * 0.1;
        // (Math.cos(this.headBlinkSin) * 0.5, Math.sin(this.headBlinkSin) * 0.5)

        this.entity.alpha = alpha

        let newAng = this.properAngle;
        newAng = this.angleLerp(newAng, this.targetAngle, this.angularSpeed);
        this.vel = { x: Math.cos(newAng) * this.currentVel, y: Math.sin(newAng) * this.currentVel };
        this.properAngle = newAng
    }
    shortAngleDist(a0, a1) {
        var max = Math.PI * 2;
        var da = (a1 - a0) % max;
        return 2 * da % max - da;
    }

    angleLerp(a0, a1, t) {
        return a0 + this.shortAngleDist(a0, a1) * t;
    }
    recalcAng(forceAngle) {

        this.angularSpeed = 0.005 + Math.random() * 0.005;
        let maxVel = this.maxVelocity * Math.max(Math.random(), 0.5);
        this.currentVel = maxVel;
        let ang = forceAngle ? forceAngle : Math.random() * (Math.PI * 2);
        this.vel = { x: Math.cos(ang) * maxVel, y: Math.sin(ang) * maxVel };

        this.properAngle = Math.atan2(this.vel.y, this.vel.x);

        let maxAngVel = this.maxAngularVelocity;
        let angVel = Math.random() * maxAngVel * 0.5
        this.angVel = { x: angVel, y: angVel };
    }
    absorving(delta) {
        this.isBeenAbsorved = true;
        // return
        this.entity.scale.x -= delta * 0.1
        this.entity.scale.y -= delta * 0.1

        this.entity.scale.x = Math.max(this.entity.scale.x, 0)
        this.entity.scale.y = Math.max(this.entity.scale.x, 0)

        this.innerHead.scale.x -= delta * 0.1
        this.innerHead.scale.y -= delta * 0.1

        this.innerHead.scale.x = Math.max(this.innerHead.scale.x, 0)
        this.innerHead.scale.y = Math.max(this.innerHead.scale.x, 0)


        let newPos = {
            x: this.x + Math.cos(this.properAngle) * this.radius * 0.1,
            y: this.y + Math.sin(this.properAngle) * this.radius * 0.1
        }
        this.trail.update(delta * 2, newPos)

        if (this.entity.scale.x <= 0 && this.innerHead.scale.x <= 0) {
            //console.log('ON KILL');

            this.onKill.dispatch(this);

            // this.trail.pa
        }

    }
    createTrail() {
        this.trail = new Trail(this.parentContainer, 40, 'assets/game/full_power_effect.png');
        this.trail.trailTick = this.radius * 0.2;
        this.trail.speed = 0.02;
        this.trail.frequency = 0.001
        this.trail.update(0, this.position)
        this.trail.mesh.tint = this.color;
    }
}