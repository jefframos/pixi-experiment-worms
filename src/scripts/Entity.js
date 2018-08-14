import * as PIXI from 'pixi.js';
import Trail from './effects/Trail'
import Signals from 'signals'
export default class Entity extends PIXI.Container {
    constructor(parentContainer, radius) {
        super();
        this.radius = radius;
        this.onOvuloCollide = new Signals();
        this.onKill = new Signals();
        this.onEnemyCollide = new Signals();
        this.entity = new PIXI.Sprite.from('assets/game/head2.png');//new PIXI.Graphics().beginFill(0xFFFFFF * Math.random()).drawCircle(0,0,5);
        this.innerHead = new PIXI.Sprite.from('assets/game/inner-head.png');//new PIXI.Graphics().beginFill(0xFFFFFF * Math.random()).drawCircle(0,0,5);
        // this.entity = new PIXI.Sprite.from('assets/game/pickup.png');//new PIXI.Graphics().beginFill(0xFFFFFF * Math.random()).drawCircle(0,0,5);
        // this.radius = 25;
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

        this.angPlusAccum = 10// * GAME_SCALES//15;
        this.maxVelocity = 65// * GAME_SCALES;
        this.maxAngularVelocity = 60// * GAME_SCALES;
        this.minAngularVelocity = 20// * GAME_SCALES;
        this.angularSpeedLimit = 0.2// * GAME_SCALES;

        this.collideFrameSkip = 20// * GAME_SCALES;

        // this.sinSpeed = (0.5 + Math.random()) * angPlusAccum;
        // this.cosSpeed = (0.5 + Math.random()) * angPlusAccum;

        this.headBlinkSin = Math.random();
        this.headScaleSin = this.headBlinkSin;
        this.innerHeadScaleSin = this.headBlinkSin;

        // this.angularSpeed = (this.angularSpeedLimit + Math.random() * this.angularSpeedLimit);
        this.recalcAng();
        window.ENTITY_ID++;
        this.id = window.ENTITY_ID;
        this.collideTimer = Math.random() * (this.collideFrameSkip * 0.5) + (this.collideFrameSkip * 0.5);

        this.angleSpeedChangeLimit = 15
        this.recalcAngleSpeedTimer = Math.random() * (this.angleSpeedChangeLimit * 0.5) + (this.angleSpeedChangeLimit * 0.5);
        this.changeForces();
    }
    changeForces() {

        this.sinSpeed = (0.5 + Math.random()) * this.angPlusAccum;
        this.cosSpeed = (0.5 + Math.random()) * this.angPlusAccum;
        this.angularSpeed = (this.angularSpeedLimit + Math.random() * this.angularSpeedLimit);
        this.increaseAng();
    }
    reset() {
        this.killed = false;
        this.isBeenAbsorved = false;
        this.entity.scale.set(this.stdEntityScale)
        this.innerHead.scale.set(this.stdInnerHeadScale)
        this.dying = false;
        this.changeColor(0xFFFFFF, true);
        if (this.trail) {
            this.trail.reset(this.position);
            // this.trail.update(0.5, this.position)
        }
    }
    collide(entityList) {
        // this.collideTimer--;
        if (this.collideTimer > 0) {
            return;
        }
        // return
        for (let index = 0; index < entityList.length; index++) {
            const element = entityList[index];
            if (element.id != this.id) {
                if (utils.distance(this.x, this.y, element.x, element.y) < element.radius) {
                    let targetAngle = Math.atan2(this.y - element.y, this.x - element.x) + Math.PI;
                    this.recalcAng(targetAngle + Math.PI);

                    this.collideTimer = Math.random() * this.collideFrameSkip + (this.collideFrameSkip * 0.5);
                    // this.recalcAng()//targetAngle + Math.PI);
                    break
                }
            }
        }
    }
    testEnemiesCollision(enemiesList) {
        if (this.killed || this.dying) {
            return;
        }
        for (let index = 0; index < enemiesList.length; index++) {
            const enemy = enemiesList[index];
            if (utils.distance(this.x, this.y, enemy.x, enemy.y) < enemy.radius/2) {
                this.onEnemyCollide.dispatch(this, enemy);
                this.kill();
            }

        }
    }
    setTarget(target, canAbsorb) {
        if (this.dying) {
            return;
        }
        this.target = target;
        this.targetAngle = Math.atan2(this.y - this.target.y, this.x - this.target.x) + Math.PI;
        if (utils.distance(this.x, this.y, this.target.x, this.target.y) < this.target.radius / 2) {
            if (canAbsorb) {
                this.onOvuloCollide.dispatch(this);
                this.recalcAng(this.targetAngle)// + Math.PI);
            } else {
                this.recalcAng(this.targetAngle + Math.PI);
            }
            this.headBlinkSin = 0;
        }

    }
    changeColor(color = 0xFFFFFF, force = false) {
        if (this.currentColor == color) {
            return;
        }
        this.currentColor = color;
        if (force) {
            this.innerHead.tint = this.currentColor;
            this.entity.tint = this.currentColor;
        } else {
            utils.addColorTween(this.innerHead, this.innerHead.tint, this.currentColor,0.5);
            utils.addColorTween(this.entity, this.entity.tint, this.currentColor,0.5);
        }
    }
    kill() {
        this.dying = true;
    }
    update(delta) {
        if (this.killed) {
            return;
        }
        if (this.dying) {
            this.absorving(delta * 2);
            return;
        }
        this.collideTimer -= delta;
        this.recalcAngleSpeedTimer -= delta;
        if (this.recalcAngleSpeedTimer <= 0) {
            this.recalcAngleSpeedTimer = Math.random() * (this.angleSpeedChangeLimit * 0.5) + (this.angleSpeedChangeLimit * 0.5);
            this.changeForces();
        }
        let newSpeed = {
            x: (this.vel.x + Math.cos(this.cos) * this.angVel.x) * delta,
            y: (this.vel.y + Math.sin(this.sin) * this.angVel.y) * delta
        }
        this.x += newSpeed.x;
        this.y += newSpeed.y;

        this.cos += delta * this.cosSpeed;
        this.sin += delta * this.sinSpeed;

        // if (this.vel.x > 0 && this.x > config.width ||
        //     this.vel.x < 0 && this.x < 0) {
        //     this.vel.x *= -1;
        //     this.recalcAng();
        // }
        // if (this.vel.y > 0 && this.y > config.height ||
        //     this.vel.y < 0 && this.y < 0) {
        //     this.vel.y *= -1;
        //     this.recalcAng();
        // }
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
        newAng = this.angleLerp(newAng, this.targetAngle, this.angularSpeed * delta);
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
    increaseAng() {
        this.properAngle += Math.random() - 0.5

        // this.currentVel = maxVel;
        let ang = this.properAngle
        this.vel = { x: Math.cos(ang) * this.currentVel, y: Math.sin(ang) * this.currentVel };

    }
    recalcAng(forceAngle) {

        this.angularSpeed = (this.angularSpeedLimit + Math.random() * this.angularSpeedLimit);
        let maxVel = this.maxVelocity * Math.max(Math.random(), 0.5);
        this.currentVel = maxVel;
        let ang = forceAngle ? forceAngle : Math.random() * (Math.PI * 2);
        this.vel = { x: Math.cos(ang) * maxVel, y: Math.sin(ang) * maxVel };

        this.properAngle = Math.atan2(this.vel.y, this.vel.x);

        let maxAngVel = this.maxAngularVelocity - this.minAngularVelocity;
        let angVel = this.minAngularVelocity + Math.random() * maxAngVel * 0.5
        this.angVel = { x: angVel, y: angVel };

        if (this.entity.scale.x <= 0 && this.innerHead.scale.x <= 0) {
            let newPos = {
                x: this.x + Math.cos(this.properAngle) * this.radius * 0.1,
                y: this.y + Math.sin(this.properAngle) * this.radius * 0.1
            }
            this.trail.update(3, newPos, true)
            this.killed = true;
            this.onKill.dispatch(this);

            // this.trail.pa
        }
    }
    absorving(delta) {
        if (this.killed) {
            return;
        }
        this.isBeenAbsorved = true;
        // return
        this.entity.scale.x -= delta * 0.05
        this.entity.scale.y -= delta * 0.05

        this.entity.scale.x = Math.max(this.entity.scale.x, 0)
        this.entity.scale.y = Math.max(this.entity.scale.x, 0)

        this.innerHead.scale.x -= delta * 0.05
        this.innerHead.scale.y -= delta * 0.05

        this.innerHead.scale.x = Math.max(this.innerHead.scale.x, 0)
        this.innerHead.scale.y = Math.max(this.innerHead.scale.x, 0)


        let newPos = {
            x: this.x + Math.cos(this.properAngle) * this.radius * 0.1,
            y: this.y + Math.sin(this.properAngle) * this.radius * 0.1
        }
        if (this.trail) {
            this.trail.update(delta * 4, newPos)
        }

        if (this.entity.scale.x <= 0 && this.innerHead.scale.x <= 0) {
            if (this.trail) {
                this.trail.update(delta * 50, newPos, true)
            }
            this.killed = true;
            this.onKill.dispatch(this);

            // this.trail.pa
        }

    }
    createTrail() {
        this.trail = new Trail(this.parentContainer, 30, 'assets/game/full_power_effect.png');
        this.trail.trailTick = this.radius * 0.25;
        this.trail.speed = 0.75;
        this.trail.frequency = 0.001
        this.trail.update(0, this.position)
        this.trail.mesh.tint = this.color;
    }
}