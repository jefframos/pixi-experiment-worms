import * as PIXI from 'pixi.js';
import ParticleSystem from './effects/ParticleSystem'
import Entity from './Entity'
import Ovulo from './Ovulo'
import Enemy from './Enemy'
import Ovario from './Ovario'
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

        this.topGradient = new PIXI.Sprite.from('sky-gradient.png');
        this.topGradient.width = config.width + 50;
        this.topGradient.height = config.height + 50;
        this.topGradient.x = -25;
        this.topGradient.y = -25;
        this.addChild(this.topGradient);

        this.bottomGradient = new PIXI.Sprite.from('sky-gradient.png');
        this.bottomGradient.scale.y = -1;
        this.bottomGradient.width = config.width + 50;
        this.bottomGradient.height = config.height + 50;
        this.bottomGradient.x = -25;
        this.bottomGradient.y = this.bottomGradient.height + 25;
        this.addChild(this.bottomGradient);

        this.bigblur = new PIXI.Sprite.from('bigblur.png');
        this.bigblur.width = config.width + 50;
        this.bigblur.height = config.height + 50;
        this.bigblur.x = -25;
        this.bigblur.y = -25;
        // this.bigblur.blendMode = PIXI.BLEND_MODES.ADD;
        this.bigblur.tint = 0
        this.bigblur.alpha = 0.5
        this.addChild(this.bigblur);

        // this.additiveSky = new PIXI.Sprite.from('testefx1.png');
        this.additiveSky = new PIXI.extras.TilingSprite(PIXI.Texture.from('testefx1.png'), 1080, 1800);
        this.additiveSky.width = config.width;
        this.additiveSky.height = config.height * 2;
        this.additiveSky.blendMode = PIXI.BLEND_MODES.ADD;
        this.additiveSky.tint = 0
        this.additiveSky.alpha = 0.8
        this.addChild(this.additiveSky);

        this.fogGradient = new PIXI.Sprite.from('sky-gradient.png');
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



        this.topGradient.tint = SKYCOLOR[type].top
        this.bottomGradient.tint = SKYCOLOR[type].bottom
        this.bigblur.tint = SKYCOLOR[type].blur
        this.additiveSky.tint = SKYCOLOR[type].additiveSky
        this.fogGradient.tint = SKYCOLOR[type].fogGradient

        this.particleSystem = new ParticleSystem();
        this.addChild(this.particleSystem);

        this.entityContainer = new PIXI.Container();
        this.addChild(this.entityContainer);

        this.trailContainer = new PIXI.Container();
        this.entityContainer.addChild(this.trailContainer);


        this.HUDContainer = new PIXI.Container();
        this.addChild(this.HUDContainer);


        this.ovulo = new Ovulo();

        this.ovulo.x = config.width / 2;
        this.ovulo.y = config.height / 2;

        this.ovulo.interactive = true;
        this.ovulo.buttonMode = true;
        this.entityContainer.addChild(this.ovulo)


        this.ovario = new Ovario(350);

        this.ovario.x = config.width * 0.85;
        this.ovario.y = config.height / 2;

        this.entityContainer.addChild(this.ovario)

        this.enemyList = [];

        this.enemyList.push(this.ovario);

        this.mousePosition = { x: 0, y: 0 }

        this.interactive = true;
        this.on('mousemove', this.onMouseMove.bind(this)).on('touchmove', this.onMouseMove.bind(this));
        this.on('click', this.onMouseClick.bind(this)).on('tap', this.onMouseClick.bind(this));
        this.on('mousedown', this.onMouseDown.bind(this)).on('touchstart', this.onMouseDown.bind(this));
        this.on('mouseup', this.onMouseUp.bind(this)).on('touchend', this.onMouseUp.bind(this));
        this.on('mouseout', this.onMouseOutside.bind(this)).on('touchendoutside', this.onMouseOutside.bind(this));

        var mousewheelevt = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel"; //FF doesn't recognize mousewheel as of FF3.x        
        if (document.attachEvent)
            document.attachEvent("on" + mousewheelevt, this.onWheelManager.bind(this));
        else if (document.addEventListener)
            document.addEventListener(mousewheelevt, this.onWheelManager.bind(this), false);


        this.entityList = [];
        this.counter = new PIXI.Text('0');
        this.counter.style.fill = 0xFFFFFF;
        this.HUDContainer.addChild(this.counter)

        this.absorvingElement = null;

        this.currentZoom = 1;

        this.centerPivot();

        // this.add10({ x: config.width / 2, y: 0 });
    }
    onWheelManager(e) {
        var evt = window.event || e;
        var delta = evt.detail ? evt.detail : evt.wheelDelta;
        const wheelForce = (delta / 120) / 8;
        this.currentZoom += wheelForce;

        // let loc = this.content.toLocal({ x: e.clientX, y: e.clientY })
        // let pivotDiff = { x:this.content.width / 2 - loc.x, y:this.content.height / 2 - loc.y}
        // let middle = { x:this.content.width / 2 , y:this.content.height / 2 }
        // let newPivot = { x:middle.x - pivotDiff.x , y: middle.y - pivotDiff.y }

        // this.pivotGr.x = newPivot.x
        // this.pivotGr.y = newPivot.y
        this.updateZoom();
    }
    updateZoom() {
        TweenLite.killTweensOf(this.entityContainer.scale)
        this.currentZoom = Math.max(this.currentZoom, 0.5)
        this.currentZoom = Math.min(this.currentZoom, 1.5)
        TweenLite.to(this.entityContainer.scale, 0.5, { x: this.currentZoom, y: this.currentZoom })
    }
    getEntity() {
        let ent;
        if (ENTITY_POOL.length > 0) {
            ent = ENTITY_POOL[0];
            ENTITY_POOL.shift();
        }
        if (!ent) {
            ent = new Entity(this.trailContainer);
        }
        return ent
    }
    add10(pos = { x: 0, y: 0 }) {
        for (let index = 0; index < 10; index++) {
            let ent = this.getEntity();
            let ang = Math.random() * Math.PI * 2;
            ent.x = pos.x + Math.cos(ang) * 30;
            ent.y = pos.y + Math.sin(ang) * 30;
            ent.reset();
            ent.onOvuloCollide.add((target) => {
                if(!this.ovulo.isProtected){
                    this.absorve(target, this.ovulo);
                }
            })
            ent.onEnemyCollide.add((target, enemy) => {
                // if(!this.ovulo.isProtected){
                    
                    enemy.hit();
                    this.enemyAttack(target, enemy);
                // }
            })
            ent.onKill.add((target) => {
                //double verify it the entity was removed from the main entity list
                for (let index = 0; index < this.entityList.length; index++) {
                    const element = this.entityList[index];
                    if (element.id == target.id) {
                        this.entityList.splice(index, 1);
                        break
                    }
                }
                //avvoid that the same entity will be used twice on the pool
                this.counter.text = this.entityList.length;
                for (let index = 0; index < ENTITY_POOL.length; index++) {
                    const element = ENTITY_POOL[index];
                    if (element.id == target.id) {
                        return
                    }
                }
                ENTITY_POOL.push(target);
                this.absorvingElement = null;
            })
            this.entityContainer.addChild(ent)
            this.entityList.push(ent)
        }
        this.counter.text = this.entityList.length;
    }
    update(delta) {
        delta *= 1.5
        if (utils.distance(this.ovulo.x, this.ovulo.y, this.ovario.x, this.ovario.y) < this.ovario.radius/2 - this.ovulo.radius/2) {
            this.ovulo.protected()
        }else{
            this.ovulo.unprotected()
        }
        if (this.absorvingElement) {
            this.absorvingElement.vel.x *= 0.9
            this.absorvingElement.vel.y *= 0.9
            this.absorvingElement.angVel = { x: 0, y: 0 }
            if (this.absorvingElement) {
                this.absorvingElement.absorving(delta);
            }
            if (this.absorvingElement) {
                this.absorvingElement.update(delta);
            }
        }
        this.additiveSky.tilePosition.y += delta * - 5;

        for (let index = this.entityList.length - 1; index >= 0; index--) {
            const element = this.entityList[index];
            if (!this.absorvingElement || element.id != this.absorvingElement.id) {
                if (element.killed) {
                    for (let index2 = 0; index2 < this.entityList.length; index2++) {
                        const target = this.entityList[index2];
                        if (element.id == target.id) {
                            this.entityList.splice(index2, 1);
                            break
                        }
                    }
                } else {

                    element.setTarget(this.ovulo, !this.absorvingElement);
                    element.testEnemiesCollision(this.enemyList);
                    element.collide(this.entityList);
                    element.update(delta)
                }
            }

        }
        this.ovulo.update(delta);
        this.centerPivot();
        if (this.particleSystem) {
            this.particleSystem.update(delta);
            if (this.addTimer > 0) {
                this.addTimer -= delta;
            } else {
                this.addParticle(3);
            }
        }
    }
    enemyAttack(entity, target) {        
        this.addParticleExplosion(entity, target)
    }
    absorve(entity, target) {
        if (this.absorvingElement) {
            return;
        }
        // localPos = this.entityContainer.toLocal(e.data.global)
        this.addParticleExplosion(entity, target)
        entity.changeColor(target.sprite.tint);
        entity.kill();
        this.absorvingElement = entity;
    }
    addParticleExplosion(pos, target, quant = 6) {
        for (let index = 0; index < quant; index++) {
            let scl = Math.random() * 0.005 + 0.01
            this.particleSystem.show({ x: pos.x, y: pos.y }, 1, {
                texture: 'spark2.png',
                customContainer: this.entityContainer,
                delay: 0.1 * index,
                blendMode: 1,
                tint: target.sprite.tint,
                // tint: 0x44a7f4,
                scale: scl,
                gravity: 300,
                forceY: Math.random() * 100 + 100,
                forceX: Math.random() * 400 - 200,
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
    centerPivot(){
        this.entityContainer.pivot.x = this.ovulo.x //+ config.width / 2;
        this.entityContainer.pivot.y = this.ovulo.y //+ config.height / 2;

        this.entityContainer.x = config.width / 2;
        this.entityContainer.y = config.height / 2;
    }
    onMouseClick(e) {

    }
    onMouseMove(e) {
        this.mousePosition = e.data.global;
        if (this.holdingOvulo) {

            // if (this.absorvingElement) {
            //     let absorvDiff = { x: this.ovulo.x - this.absorvingElement.x, y: this.ovulo.y -this.absorvingElement.y }

            //     this.absorvingElement.x = this.ovulo.x+absorvDiff.x;
            //     this.absorvingElement.y = this.ovulo.y+absorvDiff.y;
            // }

            let ovuloGlobal = this.ovulo.getGlobalPosition();

            let angle = Math.atan2(this.mousePosition.y - ovuloGlobal.y, this.mousePosition.x - ovuloGlobal.x)

            this.ovulo.applyVelocity(angle);
        }
    }

    onMouseDown(e) {
        this.mousePosition = e.data.global;
        // if (this.mouseDown) {
        this.collideEnvironment = false;
        let ovuloGlobal = this.ovulo.getGlobalPosition();
        if (utils.distance(this.mousePosition.x, this.mousePosition.y, ovuloGlobal.x, ovuloGlobal.y) < this.ovulo.width / 2) {
            this.holdingOvulo = true;
            // this.holdingOvuloDiff = { x: this.mousePosition.x - ovuloGlobal.x, y: this.mousePosition.y - ovuloGlobal.y }
            this.holdingOvuloDiff = { x: this.mousePosition.x - this.ovulo.x, y: this.mousePosition.y - this.ovulo.y }
        }
        for (let index = 0; index < this.enemyList.length; index++) {
            const element = this.enemyList[index];
            let elementGlobal = element.getGlobalPosition();

            if (utils.distance(this.mousePosition.x, this.mousePosition.y, elementGlobal.x, elementGlobal.y) < element.width / 2) {
                this.collideEnvironment = true;
            }
        }

        // }
    }
    onMouseOutside(e){
        this.holdingOvulo = false;
        this.collideEnvironment = true;
        this.ovulo.zeroVel();
    }
    onMouseUp(e) {
        if (!this.holdingOvulo && !this.collideEnvironment) {
            let localPos = this.entityContainer.toLocal(e.data.global)
            this.add10(localPos);
        }
        this.ovulo.zeroVel();
        this.holdingOvulo = false;
    }
}