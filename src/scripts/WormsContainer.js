import * as PIXI from 'pixi.js';
import ParticleSystem from './effects/ParticleSystem'
import Entity from './Entity'
import FILTERS from 'pixi-filters'
export default class WormsContainer extends PIXI.Container {
    constructor() {
        super();
        this.background = new PIXI.Graphics().beginFill(0x000000).drawRect(0, 0, config.width, config.height);
        this.addChild(this.background);

        // this.negative = new PIXI.filters.ColorMatrixFilter();
        // this.negative.negative();
        // this.filters = [this.negative]
        window.ENTITY_ID = 0;
        window.ENTITY_POOL = [];

        this.topGradient = new PIXI.Sprite(PIXI.Texture.from('sky-gradient.png'));
        this.topGradient.width = config.width + 50;
        this.topGradient.height = config.height + 50;
        this.topGradient.x = -25;
        this.topGradient.y = -25;
        this.addChild(this.topGradient);

        this.bottomGradient = new PIXI.Sprite(PIXI.Texture.from('sky-gradient.png'));
        this.bottomGradient.scale.y = -1;
        this.bottomGradient.width = config.width + 50;
        this.bottomGradient.height = config.height + 50;
        this.bottomGradient.x = -25;
        this.bottomGradient.y = this.bottomGradient.height + 25;
        this.addChild(this.bottomGradient);

        this.bigblur = new PIXI.Sprite(PIXI.Texture.from('bigblur.png'));
        this.bigblur.width = config.width + 50;
        this.bigblur.height = config.height + 50;
        this.bigblur.x = -25;
        this.bigblur.y = -25;
        // this.bigblur.blendMode = PIXI.BLEND_MODES.ADD;
        this.bigblur.tint = 0
        this.bigblur.alpha = 0.5
        this.addChild(this.bigblur);

        // this.additiveSky = new PIXI.Sprite(PIXI.Texture.from('testefx1.png'));
        this.additiveSky = new PIXI.extras.TilingSprite(PIXI.Texture.from('testefx1.png'), 1080, 1800);
        this.additiveSky.width = config.width;
        this.additiveSky.height = config.height * 2;
        this.additiveSky.blendMode = PIXI.BLEND_MODES.ADD;
        this.additiveSky.tint = 0
        this.additiveSky.alpha = 0.8
        this.addChild(this.additiveSky);

        this.fogGradient = new PIXI.Sprite(PIXI.Texture.from('sky-gradient.png'));
        this.fogGradient.scale.y = -1;
        this.fogGradient.width = config.width + 50;
        this.fogGradient.height = config.height * 0.35;
        this.fogGradient.x = -25;
        this.fogGradient.y = config.height // - 200;
        this.fogGradient.alpha = 0.3
        this.fogGradient.blendMode = PIXI.BLEND_MODES.ADD;
        this.fogGradient.tint = 0xfed7ff;
        this.addChild(this.fogGradient);

        window.SKYCOLOR = {
            day1: {
                top: 0x4373d4,
                bottom: 0x75a2fb,
                front1: 0xf5ddff,
                blur: 0xf5ddff,
                additiveSky: 0xf5ddff,
                slot: 0xFFFFFF,
                fogGradient: 0x00FF00,
            },
            night1: {
                top: 0x9900ff,
                bottom: 0x3300FF,
                front1: 0x8985ff,
                blur: 0x00FF00,
                additiveSky: 0xFF00FF,
                slot: 0xFFFFFF,
                fogGradient: 0x00FF00,
            },
            night2: {
                top: 0x003399,
                bottom: 0x663399,
                front1: 0x8985ff,
                blur: 0x00FF00,
                additiveSky: 0xFF00FF,
                slot: 0xFFFFFF,
                fogGradient: 0x00FF00,
            },
            dark: {
                top: 0x000000,
                bottom: 0x000000,
                blur: 0x000000,
                additiveSky: 0x0000FF,
                slot: 0xFFFFFF,
                fogGradient: 0x000000,
            },
        }

        let type = 'dark';

        this.ovulo = new PIXI.Sprite.from('assets/game/head.png');
        this.ovulo.anchor.set(0.5);
        this.ovulo.x = config.width / 2;
        this.ovulo.y = config.height / 2;

        this.ovulo.startScale = 80 / this.ovulo.height;
        this.ovulo.scaleSin = Math.random();
        this.ovulo.scale.set(this.ovulo.startScale);
        this.ovulo.interactive = true;
        this.ovulo.buttonMode = true;
        this.addChild(this.ovulo)

        this.topGradient.tint = SKYCOLOR[type].top
        this.bottomGradient.tint = SKYCOLOR[type].bottom
        this.bigblur.tint = SKYCOLOR[type].blur
        this.additiveSky.tint = SKYCOLOR[type].additiveSky
        this.fogGradient.tint = SKYCOLOR[type].fogGradient

        this.particleSystem = new ParticleSystem();
        this.addChild(this.particleSystem);

        this.trailContainer = new PIXI.Container();
        this.addChild(this.trailContainer);

        this.entityContainer = new PIXI.Container();
        this.addChild(this.entityContainer);

        this.HUDContainer = new PIXI.Container();
        this.addChild(this.HUDContainer);

        this.mousePosition = { x: 0, y: 0 }

        this.interactive = true;
        this.on('mousemove', this.onMouseMove.bind(this)).on('touchmove', this.onMouseMove.bind(this));
        this.on('click', this.onMouseClick.bind(this)).on('tap', this.onMouseClick.bind(this));
        this.on('mousedown', this.onMouseDown.bind(this)).on('touchstart', this.onMouseClick.bind(this));
        this.on('mouseup', this.onMouseUp.bind(this)).on('touchend', this.onMouseClick.bind(this));

        this.entityList = [];
        this.counter = new PIXI.Text('0');
        this.counter.style.fill = 0xFFFFFF;
        this.HUDContainer.addChild(this.counter)

        this.absorvingElement = null;

        this.add10({ x: config.width / 2, y: 0 });
    }
    getEntity(){
        let ent;
        if(ENTITY_POOL.length){
            ent = ENTITY_POOL[0];
            ENTITY_POOL.shift();
            
        }else{
            ent = new Entity(this.trailContainer);
        }
        return ent
    }
    add10(pos = { x: 0, y: 0 }) {
        for (let index = 0; index < 10; index++) {
            let ent = this.getEntity()//new Entity(this.trailContainer);
            let ang = Math.random() * Math.PI * 2;
            ent.x = pos.x + Math.cos(ang) * 30;
            ent.y = pos.y + Math.sin(ang) * 30;
            ent.reset();
            ent.onOvuloCollide.add((target) => {
                this.absorve(target);
            })
            ent.onKill.add((target) => {
                //this.absorve(target);
                ENTITY_POOL.push(target);
                console.log(ENTITY_POOL.length);                
                this.absorvingElement = null;
                this.counter.text = this.entityList.length;
            })
            this.entityContainer.addChild(ent)
            this.entityList.push(ent)
        }
        this.counter.text = this.entityList.length;
    }
    update(delta) {
        if (this.absorvingElement) {
            this.absorvingElement.vel.x *= 0.9
            this.absorvingElement.vel.y *= 0.9
            this.absorvingElement.angVel = { x: 0, y: 0 }
            this.absorvingElement.update(delta);
            this.absorvingElement.absorving(delta);
        }
        this.additiveSky.tilePosition.y += delta * - 5;
        for (let index = 0; index < this.entityList.length; index++) {
            const element = this.entityList[index];
            element.setTarget(this.ovulo, !this.absorvingElement);
            element.collide(this.entityList);
            element.update(delta)
        }
        this.ovulo.scaleSin += delta * 5;
        this.ovulo.scale.x = this.ovulo.startScale + Math.cos(this.ovulo.scaleSin) * this.ovulo.startScale * 0.1
        this.ovulo.scale.y = this.ovulo.startScale + Math.sin(this.ovulo.scaleSin) * this.ovulo.startScale * 0.1
        if (this.particleSystem) {
            this.particleSystem.update(delta);
            if (this.addTimer > 0) {
                this.addTimer -= delta;
            } else {
                this.addParticle(3);
            }
        }
    }
    absorve(entity) {
        if (this.absorvingElement) {
            return;
        }
        for (let index = 0; index < this.entityList.length; index++) {
            const element = this.entityList[index];
            if (element == entity) {
                this.entityList.splice(index, 1);
                break
            }
        }
        this.addParticleExplosion(entity)
        this.absorvingElement = entity;
    }
    addParticleExplosion(pos, quant = 6) {
        for (let index = 0; index < quant; index++) {
            let scl = Math.random() * 0.005 + 0.01
            this.particleSystem.show({ x: pos.x, y: pos.y }, 1, {
                texture: 'spark2.png',
                customContainer: this,
                delay:0.1 * index,
                blendMode: 1,
                tint: 0xFFFFFF,
                // tint: 0x44a7f4,
                scale: scl,
                gravity: 300,
                forceY: Math.random() *100 + 100,
                forceX: Math.random() *400 - 200,
                alphaDecress: 0.5,
                customAlpha: 0.7,
                // targetAlpha: Math.random() * 0.2 + 0.5,
            })
        }
    }
    addParticle(quant = 1) {
        // return
        this.addTimer = Math.random() * 2;
        for (let index = 0; index < quant; index++) {
            let tempX = config.width * Math.random();
            let tempY = config.height * Math.random();
            let scl = Math.random() * 0.015 + 0.01
            this.particleSystem.show({ x: tempX, y: tempY }, 1, {
                texture: 'spark2.png',
                customContainer: this,
                blendMode: 1,
                tint: 0xFFFFFF,
                // tint: 0x44a7f4,
                scale: scl,
                gravity: 0,
                forceY: 2 + (1 - scl) * 15,
                forceX: 0,
                alphaDecress: 0.1,
                customAlpha: 0.01,
                targetAlpha: Math.random() * 0.2 + 0.5,
            })
        }
    }
    onMouseClick(e) {

    }
    onMouseMove(e) {
        this.mousePosition = e.data.global;
        if (this.holdingOvulo) {
            this.ovulo.x = this.mousePosition.x - this.holdingOvuloDiff.x;
            this.ovulo.y = this.mousePosition.y - this.holdingOvuloDiff.y;
        }
    }

    onMouseDown(e) {
        this.mousePosition = e.data.global;
        // if (this.mouseDown) {

        if (utils.distance(this.mousePosition.x, this.mousePosition.y, this.ovulo.x, this.ovulo.y) < this.ovulo.width / 2) {
            this.holdingOvulo = true;
            this.holdingOvuloDiff = { x: this.mousePosition.x - this.ovulo.x, y: this.mousePosition.y - this.ovulo.y }
        }
        // }
    }
    onMouseUp(e) {
        if (!this.holdingOvulo) {
            this.add10(e.data.global);
        }
        this.holdingOvulo = false;
    }
}