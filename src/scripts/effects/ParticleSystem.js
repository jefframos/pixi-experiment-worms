import * as PIXI from 'pixi.js';
import Signals from 'signals';
export default class ParticleSystem extends PIXI.Container
{
    constructor()
    {
        super();

        this.particles = [];
        window.PARTICLE_POOL = [];
        this.maxParticles = 150;

    }

    lerp(start, end, amt)
    {
        return (1 - amt) * start + amt * end
    }
    killAll()
    {
        for (var i = this.particles.length - 1; i >= 0; i--)
        {
            let coin = this.particles[i];
            if (coin.parent)
            {
                coin.parent.removeChild(coin);
            }
            window.PARTICLE_POOL.push(coin);
            this.particles.splice(i, 1)
        }
    }
    update(delta)
    {
        if (this.particles && this.particles.length)
        {
            for (var i = this.particles.length - 1; i >= 0; i--)
            {
                let coin = this.particles[i];
                if (coin.delay <= 0)
                {
                    coin.x += coin.velocity.x * delta;
                    coin.y += coin.velocity.y * delta;

                    coin.rotation += coin.angSpeed * delta;
                    // coin.scaleSpeed += coin.angSpeed * delta;
                    if (coin.scaleSpeed.x != 0)
                    {
                        coin.currentScale.x += coin.scaleSpeed.x * delta;
                        coin.scale.x = Math.sin(coin.currentScale.x) * coin.mainScale;
                    }
                    if (coin.scaleSpeed.y != 0)
                    {
                        coin.currentScale.y += coin.scaleSpeed.y * delta;
                        coin.scale.y = Math.sin(coin.currentScale.y) * coin.mainScale;
                    }
                    if(coin.dontAlphaTween){
                        coin.alpha -= 1 * delta * coin.alphaDecress;
                    }else{
                        if(coin.alpha < coin.targetAlpha){
                            coin.alpha+= 1 * delta * coin.alphaDecress;
                            if(coin.alpha >= coin.targetAlpha){
                                coin.alpha = coin.targetAlpha
                                coin.dontAlphaTween = true;
                            }
                        }else{
                            if(coin.alpha > coin.targetAlpha){
                                coin.alpha-= 1 * delta * coin.alphaDecress;
                                if(coin.alpha >= coin.targetAlpha){
                                    coin.alpha = coin.targetAlpha
                                    coin.dontAlphaTween = true;
                                }
                            }
                        }
                    }
                    if (coin.target)
                    {
                        coin.timer -= delta;
                        if (coin.timer <= 0)
                        {
                            let angle = Math.atan2(coin.target.y - coin.y, coin.target.x - coin.x);
                            let targetX = Math.cos(angle) * 500
                            let targetY = Math.sin(angle) * 500

                            coin.velocity.x = this.lerp(coin.velocity.x, targetX, 0.05)
                            coin.velocity.y = this.lerp(coin.velocity.y, targetY, 0.05)
                            if (utils.distance(coin.x, coin.y, coin.target.x, coin.target.y) < coin.height)
                            {
                                coin.alpha = 0;
                            }
                        }
                        else
                        {
                            coin.velocity.y += coin.gravity * delta;
                        }

                    }
                    else
                    {
                        coin.velocity.y += coin.gravity * delta;
                    }
                    if (coin.alpha <= 0)
                    {
                        if (coin.parent)
                        {
                            coin.parent.removeChild(coin);
                        }
                        window.PARTICLE_POOL.push(coin);
                        this.particles.splice(i, 1)
                    }
                }
                else
                {
                    coin.delay -= delta;
                }
            }
        }
    }
    kill()
    {

    }
    show(position, tot = 10, customData = {})
    {

        this.totParticles = tot;
        for (var i = 0; i < this.totParticles; i++)
        {
            if (this.particles.length > this.maxParticles)
            {
                break;
            }
            // console.log();
            
            let coin;
            if (window.PARTICLE_POOL.length)
            {
                coin = window.PARTICLE_POOL[0];
                window.PARTICLE_POOL.shift();
            }
            if (!coin)
            {
                coin = new PIXI.Sprite();
            }
            coin.texture = PIXI.Texture.from(customData.texture || 'cat_coin_particle')
            coin.gravity = (customData.gravity != undefined ? customData.gravity : 900)

            coin.alpha =  (customData.customAlpha != undefined ? customData.customAlpha : 1)
            coin.targetAlpha = (customData.targetAlpha != undefined ? customData.targetAlpha : coin.alpha)
            // console.log(coin.alpha, coin.targetAlpha);
            
            if(coin.alpha == coin.targetAlpha){
                coin.dontAlphaTween = true;
            }else{
                coin.dontAlphaTween = false;

            }
            coin.tint = customData.tint || 0xFFFFFF
            coin.alphaDecress = (customData.alphaDecress != undefined ? customData.alphaDecress : 1)
            coin.x = position.x;
            coin.y = position.y;
            coin.angSpeed = customData.angSpeed || 0
            coin.rotation = 0;
            coin.anchor.set(0.5)
            coin.scale.set(1)
            coin.blendMode = (customData.blendMode != undefined ? customData.blendMode : 0)
            coin.delay = (customData.delay != undefined ? customData.delay : 0)
            let scl = customData.scale || 0.03
            coin.timer = 0;
            coin.target = customData.target
            if (coin.target)
            {
                coin.timer = coin.target.timer;
            }
            coin.mainScale = config.height / (coin.height * coin.scale.y) * (scl)
            coin.scale.set(coin.mainScale)
            coin.scaleSpeed = (customData.scaleSpeed != undefined ? customData.scaleSpeed :
            {
                x: 0,
                y: 0
            });
            coin.currentScale = {
                x: 0,
                y: 0
            };
            let force = {
                x: (customData.forceX != undefined ? customData.forceX : 400),
                y: (customData.forceY != undefined ? customData.forceY : 500)
            }
            coin.velocity = {
                x: (Math.random() * 1 - 0.5) * force.x,
                y: (-Math.random() * 0.5 - 0.5) * force.y,
            }
            let parent = this;
            if (customData.customContainer)
            {
                parent = customData.customContainer;
            }
            parent.addChild(coin);
            this.particles.push(coin)
        }
    }
}