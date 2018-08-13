import * as PIXI from 'pixi.js';
import Signals from 'signals';
import { TweenLite } from 'gsap';
export default class Enemy extends PIXI.Container
{
    constructor(radius)
    {
        super()
        this.radius = radius;
        this.isEnemy = true;
        this.circleCollision = new PIXI.Sprite.from('obstacle_01.png');
        this.circleCollision.anchor.set(0.5, 1);
        this.stdScale = radius / this.circleCollision.width;
        this.circleCollision.scale.set(this.stdScale);
        this.addChild(this.circleCollision);
        this.effectsContainer = new PIXI.Container();
        this.addChild(this.effectsContainer);
        this.effectsContainer.visible = false;
    }
    avoid(){
        if(this.exclamation){
            this.exclamation.visible = true;
        }
    }
    kill()
    {
        if (this.updateable || this.effectsContainer.visible)
        {
            return
        }
        this.resetVelocity();
        this.updateable = true;
        this.jumpForce = 350
        this.virtualVelocity.x = 25
        SOUND_MANAGER.play('impact', 0.25)
    }
    update(delta)
    {
        // console.log('UPDATATETAE');
        if(this.effectsContainer.visible){
            for (let index = 0; index < this.flashes.length; index++) {
                const element = this.flashes[index];
                element.time -= delta;
                if(element.time <= 0){
                    //console.log('blink');
                    
                    element.time = 2;
                    element.alpha = 1;
                    TweenLite.to(element, 0.5, {alpha:0})
                }
            }
        }
        if (!this.updateable)
        {
            if (!this.isStatic)
            {
                this.sin += delta * 5
                this.circleCollision.rotation = Math.cos(this.sin) * 0.1
            }
            // this.circleCollision.scale.set((this.stdScale - 0.05) + Math.sin(this.sin) * 0.05)


            return;
        }
        
        this.udpateVelocity();
        this.updateGravity(delta);
        this.x += this.velocity.x;

        this.circleCollision.rotation += 0.01
            // this.y += this.velocity.y;
    }
    reset(tex = 'obstacle_01.png', customRadius = 1)
    {
        ENEMY_COUNTER ++;
        this.id = ENEMY_COUNTER;
        this.avoided = false;
        this.gravity = config.height * 4;
        this.sin = 0;
        this.isStatic = true;
        this.resetVelocity();
        this.isFinalLine = false;
        this.updateable = false;
        this.hitted = false;
        this.circleCollision.texture = PIXI.Texture.fromFrame(tex);
        this.circleCollision.anchor.set(0.5, 1);
        this.circleCollision.rotation = 0;
        // if(customRadius){
        //     this.circleCollision.scale.set((this.radius * customRadius) / this.circleCollision.width / this.circleCollision.scale.x);
        // }else{
        // }
        this.stdScale = this.radius / this.circleCollision.width * this.circleCollision.scale.x * customRadius;
        this.circleCollision.scale.set(this.stdScale);

        if(this.exclamation){
            this.exclamation.visible = false;
        }

        if(tex == 'obstacle_01.png'){
            this.effectsContainer.visible = true;
            if(!this.exclamation){
                this.flashes = [];                
                
                this.exclamation = new PIXI.Sprite.from('selfies_exclamation.png');
                this.exclamation.anchor.set(0.5,1);
                this.effectsContainer.addChild(this.exclamation);
                this.exclamation.y = - this.circleCollision.height
                this.exclamation.scale.set(this.circleCollision.width / this.exclamation.width * 0.4)
                this.exclamation.visible = false;
                let flash1 =  new PIXI.Sprite.from('particle_flash.png');
                this.effectsContainer.addChild(flash1);
                flash1.anchor.set(0.5)
                flash1.scale.set(this.exclamation.scale.x)
                flash1.x = - 5
                flash1.y = - this.circleCollision.height * 0.63
                flash1.alpha = 0.5

                let flash2 =  new PIXI.Sprite.from('particle_flash.png');
                this.effectsContainer.addChild(flash2);
                flash2.anchor.set(0.5)
                flash2.scale.set(this.exclamation.scale.x)
                flash2.x = 38
                flash2.y = - this.circleCollision.height * 0.75
                flash2.alpha = 0.5

                let flash3 =  new PIXI.Sprite.from('particle_flash.png');
                this.effectsContainer.addChild(flash3);
                flash3.anchor.set(0.5)
                flash3.scale.set(this.exclamation.scale.x)
                flash3.x = - 42
                flash3.y = - this.circleCollision.height * 0.8
                flash3.alpha = 0.5
                flash1.time = 1
                flash2.time = 1.5
                flash3.time = 1.75

                flash1.alpha = 0
                flash2.alpha = 0
                flash3.alpha = 0

                this.flashes.push(flash1);
                this.flashes.push(flash2);
                this.flashes.push(flash3);
            }
        }else{
            this.effectsContainer.visible = false;
        }
    }
    setFinalLine(customRadius = -1, tex = '')
    {
        this.isFinalLine = true;
        this.circleCollision.texture = PIXI.Texture.fromFrame(tex);
        this.circleCollision.anchor.set(0.5);
        //this.circleCollision.scale.set((customRadius > 0 ? customRadius : this.radius) / this.circleCollision.width * this.circleCollision.scale.x);
    }
    updateGravity(delta)
    {

        this.y -= this.jumpForce * delta;
        this.jumpForce -= this.gravity * delta;
    }
    udpateVelocity()
    {
        let axis = ['x', 'y']
        for (var i = 0; i < axis.length; i++)
        {
            if (this.velocity[axis[i]] < this.virtualVelocity[axis[i]])
            {
                this.velocity[axis[i]] += this.acceleration[axis[i]];
                if (this.velocity[axis[i]] > this.virtualVelocity[axis[i]])
                {
                    this.velocity[axis[i]] = this.virtualVelocity[axis[i]];
                }
            }
            else if (this.velocity[axis[i]] > this.virtualVelocity[axis[i]])
            {
                this.velocity[axis[i]] -= this.acceleration[axis[i]];
                if (this.velocity[axis[i]] < this.virtualVelocity[axis[i]])
                {
                    this.velocity[axis[i]] = this.virtualVelocity[axis[i]];
                }
            }
        }

    }
    resetVelocity()
    {
        this.jumpForce = 0;
        this.velocity = {
            x: 0,
            y: 0
        }
        this.virtualVelocity = {
            x: 0,
            y: 0
        }
        this.acceleration = {
            x: config.width * 0.05,
            y: config.height * 0.02
        }
    }
}