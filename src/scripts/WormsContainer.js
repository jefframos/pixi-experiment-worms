import * as PIXI from 'pixi.js';
import ParticleSystem from './effects/ParticleSystem'
// import Entity from './Ray'
import Entity from './Entity'
// import Ovulo from './CircleAttract'
import Ovulo from './Ovulo'
import UIButton from './UIButton'
import Ovario from './Ovario'
export default class WormsContainer extends PIXI.Container {
    constructor() {
        super();
        this.background = new PIXI.Graphics().beginFill(0x000000).drawRect(0, 0, config.width, config.height);
        this.addChild(this.background);

        // this.negative = new PIXI.filters.ColorMatrixFilter();
        // this.negative.negative();
        // this.filters = [this.negative]
        this.maxSizeResolution = Math.max(config.width, config.height);
        window.GAME_SCALES = this.maxSizeResolution / desktopResolution.width;

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


        this.minusZoom = new UIButton('zoom_out.png', 'zoom_out_press.png')
        this.HUDContainer.addChild(this.minusZoom);
        this.minusZoom.onMouseUp.add(this.onZoomOut.bind(this))

        this.plusZoom = new UIButton('zoom_in.png', 'zoom_in_press.png')
        this.HUDContainer.addChild(this.plusZoom);
        this.plusZoom.onMouseUp.add(this.onZoomIn.bind(this))

        this.buttonsList = [this.minusZoom, this.plusZoom];

        this.ovulo = new Ovulo(this.maxSizeResolution * 0.1);

        this.ovulo.x = config.width / 2;
        this.ovulo.y = config.height / 2;

        this.ovulo.interactive = true;
        this.ovulo.buttonMode = true;
        this.entityContainer.addChild(this.ovulo)


        this.ovario = new Ovario(this.maxSizeResolution * 0.3);

        this.ovario.x = config.width / 2;
        this.ovario.y = config.height / 2;

        // this.entityContainer.addChild(this.ovario)

        this.enemyList = [];

        // this.enemyList.push(this.ovario);

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
        this.counter = new PIXI.Text('0', { fontFamily: 'coveslight' });
        this.counter.style.fill = 0xFFFFFF;
        this.counter.style.fontSize = 26
        this.HUDContainer.addChild(this.counter)

        this.instrucionContainer = new PIXI.Container();
        this.instructions1 = new PIXI.Text('Drag the orb to move', { fontFamily: 'coveslight' });
        this.instructions1.style.fill = 0xFFFFFF;
        this.instrucionContainer.addChild(this.instructions1)
        this.instructions1.style.fontSize = 26
        this.instructions1.scale.set(config.height / this.counter.height * 0.035)

        this.instrucionContainer2 = new PIXI.Container();
        this.instructions2 = new PIXI.Text('Tap to spawn', { fontFamily: 'coveslight' });
        this.instructions2.style.fill = 0xFFFFFF;
        this.instrucionContainer2.addChild(this.instructions2)
        this.instructions2.style.fontSize = 26
        this.instructions2.scale.set(config.height / this.counter.height * 0.035 * 0.8)
        this.instrucionContainer2.sin = 0;
        this.instrucionContainer2.target = this.instructions2;
        // this.instrucionContainer.visible = false;

        this.instrucionContainer.scale.set(0.8)

        this.HUDContainer.addChild(this.instrucionContainer)
        this.HUDContainer.addChild(this.instrucionContainer2)

        this.pixiLogo = new PIXI.Sprite.from('pixi_v5.png');
        this.pixiLogo.scale.set(Math.min(this.maxSizeResolution / this.pixiLogo.height * 0.03,1))
        this.pixiLogo.anchor.set(0.5);
        this.HUDContainer.addChild(this.pixiLogo)

        this.mouseSprite = new PIXI.Sprite.from('mouse.png');
        this.mouseSprite.scale.set(config.height / this.mouseSprite.height * 0.1)
        this.mouseSprite.x = this.instructions1.width / 2;
        this.mouseSprite.y = this.instructions1.y - this.mouseSprite.height * 0.5 - 20;
        this.mouseSprite.anchor.set(0.5);
        this.instrucionContainer.addChild(this.mouseSprite)

        this.mouseEffectsArrows = [];
        let arrow1 = new PIXI.Sprite.from('arrow_right.png');
        let arrow2 = new PIXI.Sprite.from('arrow_right.png');
        arrow1.anchor.set(0.5);
        arrow1.scale.x = -1
        arrow1.x = - 50

        arrow2.anchor.set(0.5);
        arrow2.x = 50
        this.mouseSprite.addChild(arrow1)
        this.mouseSprite.addChild(arrow2)

        this.instrucionContainer.a1 = arrow1;
        this.instrucionContainer.a2 = arrow2;
        this.instrucionContainer.sin = 0;

        this.margin = 30;

        this.counter.x = this.margin
        this.counter.y = this.margin
        this.counter.scale.set(config.height / this.counter.height * 0.035)

        this.absorvingElement = null;

        this.currentZoom = 0.75;

        this.centerPivot(true);

        this.updateZoom();

        this.resize();

        this.addSperms({ x: config.width / 2, y: 0 }, 10);
        this.addSperms({ x: config.width / 2, y: config.height }, 10);
    }
    resize() {
        this.minusZoom.scale.set(config.height / this.minusZoom.height * 0.1)
        this.plusZoom.scale.set(config.height / this.plusZoom.height * 0.1)
        this.minusZoom.x = this.minusZoom.width * 0.5 + this.margin
        this.minusZoom.y = config.height - this.minusZoom.height * 0.5 - this.margin

        this.plusZoom.x = config.width - this.plusZoom.width * 0.5 - this.margin
        this.plusZoom.y = config.height - this.plusZoom.height * 0.5 - this.margin

        this.instrucionContainer.x = config.width / 2 - this.instrucionContainer.width / 2;
        this.instrucionContainer.y = this.plusZoom.y - this.instrucionContainer.height / 2 + this.mouseSprite.height * 0.5;

        this.instrucionContainer2.x = config.width / 2 - this.instrucionContainer2.width / 2;
        this.instrucionContainer2.y = this.margin

        this.pixiLogo.x = config.width - this.pixiLogo.width / 2 - this.margin;
        this.pixiLogo.y = this.pixiLogo.height / 2 + this.margin;

    }
    onZoomOut() {
        this.currentZoom -= 0.1;
        this.centerPivot();
        this.updateZoom();
    }
    onZoomIn() {
        this.currentZoom += 0.1;
        this.centerPivot();
        this.updateZoom();
    }
    onWheelManager(e) {
        var evt = window.event || e;
        var delta = evt.detail ? evt.detail : evt.wheelDelta;
        const wheelForce = (delta / 120) / 8;
        this.currentZoom += wheelForce;
        this.centerPivot()
        this.updateZoom();
    }
    updateZoom() {
        TweenLite.killTweensOf(this.entityContainer.scale)
        this.currentZoom = Math.max(this.currentZoom, 0.25)
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
            ent = new Entity(this.trailContainer, this.maxSizeResolution * 0.03);
        }
        return ent
    }
    addSperms(pos = { x: 0, y: 0 }, q = 25) {
        if (!this.hidingInstruction2) {
            this.hidingInstruction2 = true;
            TweenLite.to(this.instrucionContainer2, 1, {
                alpha: 0, onComplete: () => {
                    this.instrucionContainer2.visible = false;
                }
            })
        }

        for (let index = 0; index < q; index++) {
            setTimeout(() => {
                let ent = this.getEntity();
                let ang = Math.random() * Math.PI * 2;
                ent.x = pos.x + Math.cos(ang) * this.maxSizeResolution * 0.02;
                ent.y = pos.y + Math.sin(ang) * this.maxSizeResolution * 0.02;
                ent.reset();
                ent.onOvuloCollide.add((target) => {
                    // if (!this.ovulo.isProtected) {
                    this.absorve(target, this.ovulo);
                    // this.ovulo.hitted();
                    // }
                })
                ent.onEnemyCollide.add((target, enemy) => {
                    enemy.hit();
                    this.enemyAttack(target, enemy);
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
                this.counter.text = this.entityList.length;
            }, 50 * index);
        }
    }
    updateTapAnimation(delta) {
        if (!this.instrucionContainer2.visible) {
            return;
        }
        this.instrucionContainer2.sin += delta * 3;
        this.instrucionContainer2.target.alpha = Math.sin(this.instrucionContainer2.sin) * 0.5 + 0.75;
    }
    updateMouseAnimation(delta) {
        if (!this.instrucionContainer.visible) {
            return;
        }
        this.instrucionContainer.sin += delta * 7;
        this.instrucionContainer.a1.alpha = Math.sin(this.instrucionContainer.sin) + 0.15
        this.instrucionContainer.a1.x = - 50 + Math.cos(this.instrucionContainer.sin) * 10 - 10
        this.instrucionContainer.a1.scale.set(-Math.cos(this.instrucionContainer.sin) * 0.15 - 0.85, Math.cos(this.instrucionContainer.sin) * 0.15 + 0.85)

        this.instrucionContainer.a2.alpha = Math.sin(this.instrucionContainer.sin) + 0.15
        this.instrucionContainer.a2.x = 50 + -(Math.cos(this.instrucionContainer.sin) * 10 - 10)
        this.instrucionContainer.a2.scale.set(Math.sin(this.instrucionContainer.sin) * 0.15 + 0.85, Math.sin(this.instrucionContainer.sin) * 0.15 + 0.85)
    }
    update(delta) {
        this.updateMouseAnimation(delta);
        this.updateTapAnimation(delta);
        //thunder
        // delta *= 4.5
        delta *= 1.5
        delta *= GAME_SCALES;
        if (utils.distance(this.ovulo.x, this.ovulo.y, this.ovario.x, this.ovario.y) < this.ovario.radius / 2 - this.ovulo.radius / 2) {
            this.ovulo.protected()
        } else {
            this.ovulo.unprotected()
        }
        if (this.absorvingElement) {
            this.absorvingElement.vel.x *= 0.9
            this.absorvingElement.vel.y *= 0.9
            this.absorvingElement.angVel = { x: 0, y: 0 }
            if (this.absorvingElement) {
                this.absorvingElement.absorving(delta * 3);
            }
            if (this.absorvingElement) {
                this.absorvingElement.update(delta * 3);
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
                    // element.testEnemiesCollision(this.enemyList);
                    element.collide(this.entityList);
                    element.update(delta)
                }
            }

        }
        this.ovulo.update(delta);
        this.ovario.update(delta);
        // this.centerPivot();
        if (this.particleSystem) {
            this.particleSystem.update(delta);
            if (this.addTimer > 0) {
                this.addTimer -= delta;
            } else {
                this.addParticle(3);
            }
        }

        if (this.holdingOvulo) {
            let ovuloGlobal = this.ovulo.getGlobalPosition();
            let dist = utils.distance(this.mousePosition.x, this.mousePosition.y, ovuloGlobal.x, ovuloGlobal.y);
            if (dist < (this.ovulo.radius * this.entityContainer.scale.x) / 2) {
                this.ovulo.zeroVel();
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

        //LIGHT
        // this.addParticleExplosion(entity, target)
        // entity.kill();
        // entity.changeColor(target.sprite.tint);
        this.absorvingElement = entity;
    }
    addParticleExplosion(pos, target, quant = 3) {
        // return
        for (let index = 0; index < quant; index++) {
            let scl = Math.random() * 0.005 + 0.01
            this.particleSystem.show({ x: pos.x, y: pos.y }, 1, {
                texture: 'particle_sperm.png',
                customContainer: this.entityContainer,
                delay: 0.1 * index,
                // blendMode: 1,
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
    centerPivot(force) {
        // return
        TweenLite.killTweensOf(this.entityContainer.pivot)
        TweenLite.killTweensOf(this.entityContainer)
        TweenLite.to(this.entityContainer.pivot, force ? 0 : 0.5, { x: this.ovulo.x, y: this.ovulo.y })
        TweenLite.to(this.entityContainer, force ? 0 : 0.5, { x: config.width / 2, y: config.height / 2 })
        // this.entityContainer.pivot.x = this.ovulo.x //+ config.width / 2;
        // this.entityContainer.pivot.y = this.ovulo.y //+ config.height / 2;

        // this.entityContainer.x = config.width / 2;
        // this.entityContainer.y = config.height / 2;
    }
    onMouseClick(e) {

    }
    onMouseMove(e) {
        if (!this.holdingOvulo) {
            return;
        }
        this.mousePosition = e.data.global;
        let ovuloGlobal = this.ovulo.getGlobalPosition();
        let dist = utils.distance(this.mousePosition.x, this.mousePosition.y, ovuloGlobal.x, ovuloGlobal.y);
        if (this.holdingOvulo && dist > (this.ovulo.radius * this.entityContainer.scale.x) / 2) {
            let ovuloGlobal = this.ovulo.getGlobalPosition();
            let angle = Math.atan2(this.mousePosition.y - ovuloGlobal.y, this.mousePosition.x - ovuloGlobal.x);
            this.ovulo.applyVelocity(angle, Math.max(Math.min(2 - this.entityContainer.scale.x, 1), 2));
            if (!this.hidingInstruction) {
                this.hidingInstruction = true;
                TweenLite.to(this.instrucionContainer, 1, {
                    alpha: 0, onComplete: () => {
                        this.instrucionContainer.visible = false;
                    }
                })
            }
        } else {
            this.ovulo.zeroVel();
        }
    }

    onMouseDown(e) {
        this.mousePosition = e.data.global;
        this.collideEnvironment = false;
        for (let index = 0; index < this.buttonsList.length; index++) {
            const element = this.buttonsList[index];

            if (utils.distance(this.mousePosition.x, this.mousePosition.y, element.x, element.y) < (element.width / element.tex1.scale.x)) {
                this.collideEnvironment = true;
            }
        }
        let ovuloGlobal = this.ovulo.getGlobalPosition();
        if (utils.distance(this.mousePosition.x, this.mousePosition.y, ovuloGlobal.x, ovuloGlobal.y) < this.ovulo.width * this.entityContainer.scale.x / 2) {
            this.holdingOvulo = true;
            // this.holdingOvuloDiff = { x: this.mousePosition.x - this.ovulo.x, y: this.mousePosition.y - this.ovulo.y }
        }
        // for (let index = 0; index < this.enemyList.length; index++) {
        //     const element = this.enemyList[index];
        //     let elementGlobal = element.getGlobalPosition();

        //     if (utils.distance(this.mousePosition.x, this.mousePosition.y, elementGlobal.x, elementGlobal.y) < (element.radius * this.entityContainer.scale.x) / 2) {
        //         this.collideEnvironment = true;
        //     }
        // }
    }
    onMouseOutside(e) {
        this.holdingOvulo = false;
        this.collideEnvironment = true;
        this.ovulo.zeroVel();
    }
    onMouseUp(e) {
        let canAdd = true;//e.data.global.y > this.maxSizeResolution * 0.075
        if (canAdd && !this.holdingOvulo && !this.collideEnvironment) {
            let localPos = this.entityContainer.toLocal(e.data.global)
            this.addSperms(localPos);
        }
        this.ovulo.zeroVel();
        this.holdingOvulo = false;
    }
}