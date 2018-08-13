import * as PIXI from 'pixi.js';
import StandardPop from './StandardPop';
import ClipboardJS from 'clipboard';

export default class StartPopUp extends StandardPop {
    constructor(label, screenManager) {
        super(label, screenManager);

        var canvas = document.createElement("canvas");

        let ctx = canvas.getContext('2d')
        let grd;

        grd = ctx.createLinearGradient(150.000, 0.000, 150.000, 300.000);


        // 7a
        // b0
        // db
        // Add colors
        // c9e0f1

        // grd.addColorStop(0.000, 'rgba(200, 223, 239, 1.000)');
        // grd.addColorStop(0.000, 'rgba(200, 223, 239, 1.000)');
        // grd.addColorStop(0.7500, 'rgba(186, 215, 238, 1.000)');
        // grd.addColorStop(0.996, 'rgba(122, 176, 218, 1.000)');

        grd.addColorStop(0.000, 'rgba(200, 223, 239, 0.500)');
        // grd.addColorStop(0.500, 'rgba(200, 223, 239, 1.000)');
        // grd.addColorStop(0.500, 'rgba(201, 223, 241, 1.000)');

        grd.addColorStop(0.5, 'rgba(122, 176, 218, 1.000)');
        grd.addColorStop(1, 'rgba(122, 176, 218, 1.000)');

        // Fill with gradient
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, 300.000, 300.000);

        this.backImage = new PIXI.Sprite.from(canvas);
        this.backImage.scale.set(config.width / this.backImage.width, config.height / this.backImage.height)
        this.backImage.anchor.set(0.5)
        this.container.addChild(this.backImage)


        this.logoContainer = new PIXI.Container();
        let logo = new PIXI.Sprite.from('logo-self-esteem-squad.png')
        this.logoContainer.addChild(logo);



        // this.logoBack = new PIXI.Graphics().beginFill(0xe05102).drawRoundedRect(0, 0, config.height * 0.5, config.height * 0.5 * 0.75, roundRadius)
        // // this.logoContainer.addChild(this.logoBack);
        // this.logoFront = new PIXI.Graphics().beginFill(0xed823c).drawRoundedRect(0, 0, config.height * 0.5, config.height * 0.5 * 0.75, roundRadius)
        // // this.logoContainer.addChild(this.logoFront);
        // this.logoFront.y = -10;
        this.logoContainer.pivot.x = this.logoContainer.width / 2;
        this.logoContainer.pivot.y = this.logoContainer.height * 0.65;
        this.logoContainer.x = config.width / 2;
        this.logoContainer.y = this.margin * 0.5;
        // this.logoContainer.y = config.height - this.margin * 0.5;

        let logoTarget = config.height / (this.logoContainer.height / this.logoContainer.scale.y) * 0.4;

        this.logoContainer.scale.set(logoTarget)


        this.playButtonContainer = new PIXI.Container();
        let playB = new PIXI.Sprite.from('button_play.png')
        this.playButtonContainer.addChild(playB);
        this.playButtonContainer.pivot.x = this.playButtonContainer.width / 2;
        this.playButtonContainer.pivot.y = this.playButtonContainer.height * 0.5;
        this.playButtonContainer.x = config.width / 2;
        this.playButtonContainer.scale.set(config.height / (this.playButtonContainer.height / this.playButtonContainer.scale.y) * 0.2)


        this.mainCharsContainer = new PIXI.Container();
        let char1 = new PIXI.Sprite.from('home_character_01.png')
        let char2 = new PIXI.Sprite.from('home_character_02.png')
        let char3 = new PIXI.Sprite.from('home_character_03.png')
        char1.anchor.set(0.5, 0)
        char2.anchor.set(0.5, 0)
        char3.anchor.set(0.5, 0)
        // char3.scale.x = -1

        char1.x = 0//config.width / 2;
        char1.y = 50//config.width / 2;
        char2.x = + char1.width * 1.1;
        char3.x = - char1.width * 1.1;

        this.mainCharsContainer.addChild(char2)
        this.mainCharsContainer.addChild(char3)
        this.mainCharsContainer.addChild(char1)
        // char1.scale.set(0.8)
        this.container.addChild(this.mainCharsContainer)
        this.mainCharsContainer.scale.set(config.height / this.mainCharsContainer.height * 0.8)
        // this.mainCharsContainer.scale.set(config.height / this.mainCharsContainer.height * 0.65)
        this.mainCharsContainer.x = 0//- this.mainCharsContainer.width / 2 - this.logoContainer.width / 2 * 0.9
        this.mainCharsContainer.y = - this.mainCharsContainer.height * 0.35;


        // this.contentLabel = new PIXI.Text(
        //     'Lorem ipsum dolor sit amet\n'+
        //     'sed do eiusmod  ut labore.\n'+
        //     'Lorem sit amet, consectetur\n'+
        //     'sed do eiusmod tempor ut et.\n\n'+
        //     'Lorem sit amet, consectetur\n'+
        //     'sed do eiusmod  ut labore.\n',
        // {
        //     fontFamily: 'lilita_oneregular',
        //     fontSize: '42px',
        //     fill: 0x083974,
        //     align: 'left',
        //     // fontWeight: '800'
        // });
        // this.contentLabel.scale.set((config.width / 2 - this.logoContainer.width / 2) / this.contentLabel.width * 0.9)
        // this.contentLabel.scaleContentMax = true;

        // this.contentLabel.x = 0//this.logoContainer.width / 2
        // this.contentLabel.y = - this.contentLabel.height * 0.5;

        // this.container.addChild(this.contentLabel)



        this.margin = config.height * 0.15;

        this.topContainer = new PIXI.Container();
        this.topWhite = new PIXI.Graphics().beginFill(0xFFFFFF).drawRect(0, 0, config.width, config.height)
        this.topContainer.addChild(this.topWhite)
        this.backContainer.addChild(this.topContainer)
        this.topContainer.y = config.height / 2 - config.height

        // this.topLabel = new PIXI.Text('LOADING',
        // {
        //     fontFamily: 'lilita_oneregular',
        //     fontSize: '24px',
        //     fill: 0x012c63,
        //     align: 'center',
        //     // fontWeight: '800'
        // });
        // this.topLabel.pivot.x = this.topLabel.width / 2;
        // this.topLabel.pivot.y = this.topLabel.height / 2;
        // this.topLabel.scale.set(this.margin / this.topLabel.height * 0.5)
        // this.addChild(this.topLabel);
        // this.topLabel.x = config.width / 2;
        // this.topLabel.y = this.margin / 2;

        this.bottomContainer = new PIXI.Container();
        this.bottomWhite = new PIXI.Graphics().beginFill(0xFFFFFF).drawRect(0, 0, config.width, config.height)
        this.bottomContainer.addChild(this.bottomWhite)
        this.backContainer.addChild(this.bottomContainer)

        this.bottomContainer.y = config.height / 2


        this.middleMask = new PIXI.Graphics().beginFill(0xFF0000).drawCircle(0, 0, config.height - this.margin * 2)
        this.container.addChild(this.middleMask)
        this.container.mask = this.middleMask

        // this.filterGlow = new GlowFilter(5, 2, 1, 0x78aacd, 0.5);
        // this.container.filters = [this.filterGlow]

        this.middleMask.scale.set(0)


        this.addChild(this.logoContainer)
        this.addChild(this.playButtonContainer)
        this.logoContainer.visible = false;


        this.doveLogo = new PIXI.Sprite.from('logo-dove.png')
        this.addChild(this.doveLogo)

        this.doveLogo.scale.set(topMargin / this.doveLogo.height)
        this.doveLogo.x = config.width - this.doveLogo.width * 1.25;
        this.doveLogo.y = config.height - this.doveLogo.height * 1.25;
    }

    update(delta) {
        // this.testEnemy.update(delta)
    }

    hide(dispatch, callback) {
        // this.onHide.dispatch(this);
        // TweenLite.to(this.container, 0.25,
        // {
        //     alpha: 0
        // });
        // this.visible = false;
        // TweenLite.to(this.topLabel, 0.5,{alpha:0});
        SOUND_MANAGER.play('click')
        TweenLite.to(this.playButtonContainer, 0.25, {
           alpha:0
        })
        TweenLite.to(this.logoContainer, 0.5, {
            y: - this.logoContainer.height,
            ease: Back.easeIn
        })
        TweenLite.to(this.middleMask.scale, 0.5,
            {
                delay: 0.25,
                x: 0,
                y: 0,
                ease: Back.easeIn,
                onComplete: () => {
                    if (dispatch) {
                        this.onHide.dispatch(this);
                    }
                    if (callback) {
                        callback();
                    }
                    this.afterHide();
                    this.toRemove = true
                }
            })
        // super.hide(dispatch, callback);
    }

    show() {
        this.middleMask.scale.set(0)
        let logoTarget = config.height / (this.logoContainer.height / this.logoContainer.scale.y) * 0.25;

        this.logoContainer.scale.set(logoTarget * 1.5, logoTarget * 0.5)

        this.logoContainer.y = this.margin * 1.5;
        this.playButtonContainer.y = config.height - this.margin * 1.0;
        // this.topLabel.alpha = 0;
        // TweenLite.to(this.topLabel, 0.5,
        //     {
        //         alpha: 1,
        //         delay: 0.5
        //     })
        //     // this.middleMask.scale.set(2, 0.5)
        let playTargetScale = config.height / (this.playButtonContainer.height / this.playButtonContainer.scale.y) * 0.2
        this.playButtonContainer.scale.set(playTargetScale * 1.5, playTargetScale * 0.5)

        this.playButtonContainer.visible = false;
        this.playButtonContainer.alpha = 1;
        TweenLite.to(this.playButtonContainer.scale, 0.75,
            {
                x: playTargetScale,
                y: playTargetScale,
                delay: 0.75,
                ease: Elastic.easeOut,
                onStart: () => {
                    this.playButtonContainer.visible = true;
                }
            })

        TweenLite.to(this.middleMask.scale, 0.75,
            {
                // delay: 0.5,
                x: maskScale.x,
                y: maskScale.y,
                ease: Back.easeOut
            })
        this.logoContainer.visible = false;
        TweenLite.to(this.logoContainer.scale, 0.75,
            {
                x: logoTarget,
                y: logoTarget,
                delay: 0.5,
                ease: Elastic.easeOut,
                onStart: () => {
                    this.logoContainer.visible = true;
                }
            })
        super.show();
    }
}