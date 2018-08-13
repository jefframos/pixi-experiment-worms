import * as PIXI from 'pixi.js';
import Signals from 'signals';
export default class Player extends PIXI.Container {
    constructor(radius) {
        super()
        this.radius = radius;
        this.circleCollision = new PIXI.Graphics().lineStyle(1, 0xFF0000).drawCircle(0, 0, this.radius / 2)
        // this.addChild(this.circleCollision);
        this.circleCollision.y = -this.radius

        this.rectCollision = new PIXI.Graphics().lineStyle(1, 0x0000FF).drawRect(0, 0, this.radius * 2, this.radius * 2)
        // this.addChild(this.rectCollision);
        this.rectCollision.x = -this.radius;
        this.rectCollision.y = -this.radius;

        this.textureID = 'rosie'
        this.animationData = {
            run:
            {
                textures: [this.textureID + '0001.png', this.textureID + '0002.png', this.textureID + '0003.png', this.textureID + '0004.png', this.textureID + '0005.png'],
                animationSpeed: 0.1,
                currentFrame: 0,
                currentTime: 0,
                loop: true,
            },
            falling:
            {
                textures: [this.textureID + '0005.png'],
                animationSpeed: 0.075,
                currentFrame: 0,
                currentTime: 0,
                loop: false,
            },
            jumping:
            {
                textures: [this.textureID + '0003.png'],
                animationSpeed: 0.1,
                currentFrame: 0,
                currentTime: 0,
                loop: false,
            },
            dash:
            {
                textures: [this.textureID + '0006.png', this.textureID + '0007.png', this.textureID + '0008.png'],
                animationSpeed: 0.075,
                currentFrame: 0,
                currentTime: 0,
                loop: false,
            },
            dashOut:
            {
                textures: [this.textureID + '0008.png', this.textureID + '0009.png', this.textureID + '0010.png'],
                animationSpeed: 0.01,
                currentFrame: 0,
                currentTime: 0,
                loop: false,
            }
        }

        this.currentAnimation = 'run';

        let animData = this.animationData[this.currentAnimation];
        this.entitySprite = new PIXI.Sprite.fromFrame(animData.textures[animData.currentFrame])
        this.entitySprite.anchor.set(0.5, 1);
        this.entitySprite.scale.set(this.radius / this.entitySprite.width * 2)

        this.effectSprite = new PIXI.Sprite.from('effect_slide.png')
        this.addChild(this.effectSprite)
        this.effectSprite.anchor.set(1, 0.85)
        this.effectSprite.scale.set(0);
        this.effectSprite.blendMode = PIXI.BLEND_MODES.ADD

        this.addChild(this.entitySprite)


        this.dashSprite = new PIXI.Sprite.from('dash_effect.png')
        this.addChild(this.dashSprite)
        this.dashSprite.anchor.set(0, 0.5)
        this.dashSprite.scale.set(0);
        this.dashSprite.blendMode = PIXI.BLEND_MODES.ADD
        this.dashSprite.x = -this.radius
        this.dashSprite.y = -this.radius
        this.addChild(this.entitySprite)

        this.resetVelocity();
        this.dir = 1;
        this._scale = 1;
        this.gravity = config.height * 7;
        this.dashing = false;
        this.dashTimeDefault = 0.6;
        this.dashTime = this.dashTimeDefault;

        this.standardSpeed = this.radius * 7//config.width * 0.65;
        this.dashSpeed = this.standardSpeed * 4;

        this.footstepTimer = 0;

        this.fullEnergyContainer = new PIXI.Container();
        this.addChild(this.fullEnergyContainer);

        this.fullEffect = new PIXI.Sprite.from('full_power_effect.png')
        this.fullEnergyContainer.addChild(this.fullEffect)
        this.fullEffect.anchor.set(0.5);
        this.fullEffect.scale.set(this.radius / this.fullEffect.width * 2.5)
        this.fullEffect.y = -this.radius
        this.fullEffect.x = this.radius * 0.25
        this.fullEffect.sin = 0;
        this.fullEffect.visible = false;
    }
    updateAnimations(id = 'rosie') {
        this.textureID = id
        this.animationData = {
            run:
            {
                textures: [this.textureID + '0001.png', this.textureID + '0002.png', this.textureID + '0003.png', this.textureID + '0004.png', this.textureID + '0005.png'],
                animationSpeed: 0.055,
                currentFrame: 0,
                currentTime: 0,
                loop: true,
            },
            falling:
            {
                textures: [this.textureID + '0005.png'],
                animationSpeed: 0.055,
                currentFrame: 0,
                currentTime: 0,
                loop: false,
            },
            jumping:
            {
                textures: [this.textureID + '0003.png'],
                animationSpeed: 0.1,
                currentFrame: 0,
                currentTime: 0,
                loop: false,
            },
            dash:
            {
                textures: [this.textureID + '0006.png', this.textureID + '0007.png', this.textureID + '0008.png'],
                animationSpeed: 0.05,
                currentFrame: 0,
                currentTime: 0,
                loop: false,
            },
            dashOut:
            {
                textures: [this.textureID + '0010.png'],//, this.textureID + '0009.png', this.textureID + '0010.png'],
                animationSpeed: 0.01,
                currentFrame: 0,
                currentTime: 0,
                loop: false,
            }
        }

        if(this.textureID == 'rosie'){
            this.animationData.dash = 
            {
                textures: [this.textureID + '0005.png', this.textureID + '0005.png', this.textureID + '0005.png'],
                animationSpeed: 0.05,
                currentFrame: 0,
                currentTime: 0,
                loop: false,
            }
            this.animationData.dashOut=
            {
                textures: [this.textureID + '0001.png'],//, this.textureID + '0009.png', this.textureID + '0010.png'],
                animationSpeed: 0.01,
                currentFrame: 0,
                currentTime: 0,
                loop: false,
            }
        }
    }
    update(delta) {
        if (this.dashing) {
            this.dashTime -= delta;
            if (this.dashTime <= 0) {
                this.endDash();
            }
        }
        this.updateGravity(delta)
        this.updateForces(delta)
        this.udpateVelocity(delta)
        this.updateAnimation(delta)

        if (this.fullEffect.visible) {
            // this.fullEffect.alpha = 1;
            this.fullEffect.rotation += delta * 5;
            this.fullEffect.sin += delta * 3;
            this.fullEffect.sin %= Math.PI;
            this.fullEffect.alpha = Math.sin(this.fullEffect.sin) * 0.85 + 0.15
        }
        if (this.isRunning) {
            if (this.footstepTimer > 0.25) {
                SOUND_MANAGER.play('footstep', 0.2)
                this.footstepTimer = 0;
            } else {
                this.footstepTimer += delta;
            }
        }

        if (this.isRunning && this.currentAnimation != 'run') {
            // this.changeAnimation('run')
        }
    }

    updateAnimation(delta) {
        let animData = this.animationData[this.currentAnimation];
        animData.currentTime += delta;
        if (animData.currentTime >= animData.animationSpeed) {
            if (!animData.loop && animData.currentFrame >= animData.textures.length) {
                animData.currentFrame = animData.textures.length - 1;
                this.finishAnimation();
            }
            else {
                animData.currentFrame %= animData.textures.length;
            }
            animData.currentTime = 0;
            this.entitySprite.texture = PIXI.Texture.from(animData.textures[animData.currentFrame])
            animData.currentFrame++;
        }
    }
    getHurt() {
        this.velocity.x = -this.standardSpeed * 3;
        this.jumpForce = config.height * 0.5
        this.inFloor = false;
    }
    finishAnimation() {
        if (this.currentAnimation == 'dashOut') {
            this.run();
        }
    }
    floorCollide(pos) {
        this.y = pos;
        this.jumpForce = 0;
        this.run();
        this.inFloor = true;

    }
    updateGravity(delta) {
        if (this.inFloor) {
            // console.log('ignoring gravity');
            return
        }
        if (this.jumpForce > 0) {
            this.changeAnimation('jumping');
        }
        else if (this.jumpForce < 0) {
            this.changeAnimation('falling');
        }

        this.y -= this.jumpForce * delta;
        this.jumpForce -= this.gravity * delta;
    }

    endDash() {
        // console.log('END DASH-----------------');
        if (!this.dashing || this.dashEnding)
        // if (!this.dashing || this.dashEnding)
        {
            return
        }
        this.dashEnding = true;
        setTimeout(() => {
            this.dashing = false;
            // this.run();
            // this.dashing = false
            // this.virtualVelocity.x = this.standardSpeed
        }, 500);
        //normal velocity
        // console.log('END DASH');
        if (this.currentAnimation != 'dashOut') {
            this.changeAnimation('dashOut');
        }
    }
    dash(isSlide = false) {
        if (this.dashing) {
            return false;
        }
        if (!this.inFloor) {
            return false;
        }

        this.dashEnding = false;
        this.isRunning = false;
        this.dashing = true;
        this.dashTime = this.dashTimeDefault;

        this.changeAnimation('dash');
        this.velocity.x = this.dashSpeed;

        if (isSlide) {
            TweenLite.killTweensOf(this.effectSprite.scale);
            TweenLite.killTweensOf(this.effectSprite);
            this.effectSprite.scale.x = 1;
            this.effectSprite.scale.y = 1.5;
            this.effectSprite.alpha = 0.5;
            TweenLite.to(this.effectSprite, 0.25,
                {
                    delay: 0.45,
                    alpha: 0
                })
            TweenLite.to(this.effectSprite.scale, 0.25,
                {
                    delay: 0.35,
                    x: 0,
                    y: 1
                })
        } else {
            TweenLite.killTweensOf(this.dashSprite.scale);
            TweenLite.killTweensOf(this.dashSprite);
            this.dashSprite.scale.x = 0;
            this.dashSprite.scale.y = 1;
            this.dashSprite.alpha = 0.5;
            TweenLite.to(this.dashSprite.scale, 0.45,
                {

                    x: 1.5,
                    ease: Back.easeOut
                })
            TweenLite.to(this.dashSprite, 0.25,
                {
                    delay: 0.45,
                    alpha: 0
                })
            TweenLite.to(this.dashSprite.scale, 0.45,
                {
                    delay: 0.45,
                    x: 1,
                    y: 0
                })
        }


        return true;
    }
    run() {
        this.isRunning = true;
        this.changeAnimation('run');
        this.virtualVelocity.x = this.standardSpeed


    }
    jump() {
        if (this.dashing) {
            return
        }
        if (!this.inFloor) {
            return
        }
        this.jumpForce = config.height * 2.1
        this.isRunning = false;
        this.inFloor = false;
        this.virtualVelocity.x = this.standardSpeed * 1.2 //0.75
        return true;
    }
    changeAnimation(id) {
        // if (this.currentAnimation == id)
        // {
        //     return
        // }
        console.log(id);
        this.currentAnimation = id;

        let animData = this.animationData[this.currentAnimation];
        animData.currentFrame = 0;
        animData.currentTime = 0;

        this.entitySprite.texture = PIXI.Texture.from(animData.textures[animData.currentFrame])
    }
    updateForces(delta) {
        return
        if (this.velocity.x < 0) {
            // this.dir = -1
            this.entitySprite.scale.x = -Math.abs(this.entitySprite.scale.x)
        }
        else if (this.velocity.x > 0) {
            // this.dir = 1
            this.entitySprite.scale.x = Math.abs(this.entitySprite.scale.x)
        }

        // this.x += this.velocity.x * this._scale * delta;
        // this.y += this.velocity.y * this._scale * delta;

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
            x: this.radius * 50,//config.width * 0.05,
            y: this.radius * 50//config.height * 0.02
        }
    }

}