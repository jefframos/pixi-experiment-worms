import * as PIXI from 'pixi.js';
import Signals from 'signals';
import StandardPop from './StandardPop';
import UIButton from '../ui/UIButton';
import UIList from '../ui/UIList';
import GameOverItem from '../ui/GameOverItem';
export default class PreSharePopUp extends StandardPop {
    constructor(label, screenManager) {
        super(label, screenManager);

        var canvas = document.createElement("canvas");

        let ctx = canvas.getContext('2d')
        let grd;

        grd = ctx.createLinearGradient(150.000, 0.000, 150.000, 300.000);

        // Add colors
        grd.addColorStop(0.000, 'rgba(200, 223, 239, 1.000)');
        grd.addColorStop(0.996, 'rgba(122, 177, 218, 1.000)');

        // Fill with gradient
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, 300.000, 300.000);
        this.container.interactive = false;
        this.container.buttonMode = false;
        this.prizeDark = new PIXI.Graphics().beginFill(0).drawRect(0, 0, config.width, config.height) //new PIXI.Sprite(PIXI.Texture.from('UIpiece.png'));
        this.prizeDark.alpha = 0.25;
        // this.prizeDark.interactive = true;
        // this.prizeDark.buttonMode = true;
        // this.prizeDark.on('mousedown', this.hideCallback.bind(this)).on('touchstart', this.hideCallback.bind(this));
        this.addChildAt(this.prizeDark, 0);





        this.infoItens = [];
        this.infoList = new UIList();

        this.h = config.height * 0.75
        this.w = this.h * 1.5 //config.width * 0.65

        this.infoContainer = new PIXI.Container();
        let shipInfoSprite = new PIXI.Graphics().beginFill(0).drawRoundedRect(0, 0, this.w, this.h, roundRadius * 0.5)
        this.infoContainer.addChild(shipInfoSprite);

        this.margin = topMargin;

        this.background = new PIXI.Graphics().beginFill(0x3c7fb4).drawRect(-config.width / 2, -config.height / 2, config.width, config.height)
        this.background.scale.set(config.width / this.background.width, config.height / this.background.height)
        this.infoContainer.addChild(this.background)

        this.circleShape = new PIXI.Graphics().beginFill(0xFFFFFF).drawCircle(0, 0, shipInfoSprite.height / 2)
        this.infoContainer.addChild(this.circleShape)
        this.circleShape.scale.x = maskScale.x
        this.circleShape.y = -this.circleShape.height * 0.75;

        this.infoContainer.mask = shipInfoSprite
        this.infoScale = 1
        shipInfoSprite.pivot.x = shipInfoSprite.width / 2;
        shipInfoSprite.pivot.y = shipInfoSprite.height / 2;




        this.titleLabel = new PIXI.Text(
            LOCALIZATION.PLAY_MORE[LANGUAGE],
            {
                fontFamily: 'lilita_oneregular',
                fontSize: '32px',
                fill: 0xFFFFFF,
                align: 'center',
                // fontWeight: '800'
            });
        this.titleLabel.scale.set(this.w / this.titleLabel.width * 0.75)
        this.titleLabel.scaleContentMax = true;
        // this.infoList.addChild(this.titleLabel);
        // this.infoList.elementsList.push(this.titleLabel);
        // this.infoItens.push(this.titleLabel);

        this.scoreContainer = new UIList();

        this.scoreContainer.w = this.w * 0.5;
        this.scoreContainer.h = this.h * 0.2


        this.coin = new PIXI.Sprite.from('pickup.png');
        this.coin.align = 1
        this.coin.listScl = 0.3
        this.coin.fitHeight = 0.75
        this.scoreContainer.addChild(this.coin);
        this.scoreContainer.elementsList.push(this.coin)

        this.scoreLabel = new PIXI.Text(
            '963',
            {
                fontFamily: 'lilita_oneregular',
                fontSize: '42px',
                fill: 0xFFFFFF,
                align: 'center',
                // fontWeight: '800'
            });

        // this.scoreLabel.scaleContentMax = 0.5
        this.scoreContainer.addChild(this.scoreLabel);
        this.scoreContainer.elementsList.push(this.scoreLabel);
        this.scoreContainer.scaleContentMax = true;

        this.scoreContainer.addBackground(0, 0.5)
        // this.scoreContainer.debug()
        this.scoreContainer.updateHorizontalList();

        this.scoreContainer.listScl = 0.35

        this.infoList.addChild(this.scoreContainer);
        this.infoList.elementsList.push(this.scoreContainer);
        this.infoItens.push(this.scoreContainer);

        this.buttonsContainer = new UIList();
        this.buttonsContainer.h = config.height * 0.15
        this.buttonsContainer.w = this.w * 0.75

        this.continueButton = new UIButton(this.w * 0.3, this.w * 0.3 * 0.25, "PLAY AGAIN", false) //PIXI.Sprite.from('back_button.png');

        this.toShareButton = new UIButton(this.w * 0.3, this.w * 0.3 * 0.25, "SHARE", false) //PIXI.Sprite.from('back_button.png');
        this.toShareButton.onClick.add(() => {
            this.hide()
        });
        // this.continueButton.listScl = 0.2
        // this.continueButton.fitHeight = 0.75
        // this.infoItens.push(this.continueButton);
        // this.infoList.addChild(this.continueButton);
        // this.infoList.addChild(this.continueButton);

        this.buttonsContainer.addBackground()
        this.buttonsContainer.addChild(this.continueButton)
        this.buttonsContainer.addChild(this.toShareButton)
        this.buttonsContainer.elementsList.push(this.continueButton)
        this.buttonsContainer.elementsList.push(this.toShareButton)
        this.buttonsContainer.updateHorizontalList()
        this.infoList.elementsList.push(this.buttonsContainer);

        this.buttonsContainer.listScl = 0.3

        this.infoItens.push(this.buttonsContainer);
        this.infoList.addChild(this.buttonsContainer);
        this.continueButton.onClick.add(() => {
            this.hide(true)
        });
        // console.log(this);
        this.container.addChild(this.infoContainer)



        let tempH = config.height * 0.05


        this.baseContainer = new PIXI.Container()
        this.baseContainer.fitHeight = 1//0.85
        this.baseContainer.listScl = 0.2
        this.baseContainer.align = 1
        // let baseShape = new PIXI.Graphics().beginFill(0xFFFFFF).drawRect(0, -tempH, this.w,tempH)
        let baseShape = new PIXI.Graphics().beginFill(0xFFFFFF).drawRect(0, 0, this.w * 0.4, tempH * 2)
        // this.baseContainer.addChild(baseShape)
        baseShape.alpha = 0
        this.baseText = new PIXI.Text(
            LOCALIZATION.SHARE_BOTTOM[LANGUAGE],
            {
                fontFamily: 'lilita_oneregular',
                fontSize: '24px',
                fill: 0xFFFFFF,
                // fill: 0x083974,
                align: 'center',
                // fontWeight: '800'
            });
            this.baseText.interactive = true;
            this.baseText.on('mousedown', this.clickInfo.bind(this)).on('touchstart', this.clickInfo.bind(this));
        // this.baseText.scale.set(tempH/ this.baseText.height * 0.75)

        this.baseContainer.addChild(this.baseText);

        let th = this.baseText.height / 2;

        this.copyButton = new PIXI.Graphics().beginFill(0x34f7f3).drawCircle(th, th, th);
        this.copyButton.x = this.baseText.width + 30
        // this.addChild(this.copyButton);
        // this.copyButton.y = 20
        this.copyButton.interactive = true;
        // this.baseContainer.addChild(this.copyButton);
        this.copyButton.on('click', this.copyToClipboard.bind(this)).on('tap', this.copyToClipboard.bind(this));

        // this.baseText.x = this.w * 0.5 - this.baseText.width * 0.5
        // this.baseText.y = -tempH + tempH * 0.5 - this.baseText.height * 0.5

        this.infoList.addChild(this.baseContainer);
        this.infoList.elementsList.push(this.baseContainer);
        this.infoItens.push(this.baseContainer);




        this.infoList.w = shipInfoSprite.width * 0.9
        this.infoList.h = shipInfoSprite.height * 0.7
        this.infoList.updateVerticalList();
        this.infoList.x = -shipInfoSprite.width / 2 + shipInfoSprite.width * 0.05
        this.infoList.y = -shipInfoSprite.height / 2 * 0.5 //+ 20
        // this.infoList.debug();

        // console.log(baseContainer.position);

        this.infoContainer.addChild(this.infoList);
        this.popUpLabel = new PIXI.Text('DO MORE!',
            {
                fontFamily: 'lilita_oneregular',
                fontSize: '24px',
                fill: 0x3c7fb4,
                // fill: 0x3c7fb4,
                align: 'center',
                // fontWeight: '800'
            });
        // this.popUpLabel.scale.set(this.w / this.popUpLabel.width * 0.5)

        // this.addChild(this.popUpLabel);
        this.infoContainer.addChild(this.popUpLabel);
        this.popUpLabel.scale.set(this.w / this.popUpLabel.width * 0.4)
        this.popUpLabel.x = -this.popUpLabel.width / 2;
        this.popUpLabel.y = -this.h / 2 + this.margin * 0.85 - this.popUpLabel.height / 2;


        this.playAgain = new Signals();
        this.toShare = new Signals();


    }
    copyToClipboard() {
        console.log(LOCALIZATION.SHARE_LINK[LANGUAGE]);
        
        const el = document.createElement('textarea');
        el.value = LOCALIZATION.SHARE_LINK[LANGUAGE];
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);

    }

    clickInfo() {
        window.location.href = 'https://playmob.io/tracking_link/ses-more-info?platform_identifier=web'
    }

    hide(dispatch, callback) {
        SOUND_MANAGER.play('click')
        TweenLite.to(this.prizeDark, 0.5,
            {
                delay: 0.25,
                alpha: 0
            });
        TweenLite.to(this.infoContainer.scale, 0.25,
            {
                // delay: 0.25,
                // x: 0,
                x: 0,
                ease: Back.easeIn,
                onComplete: () => {
                    if (dispatch) {
                        this.playAgain.dispatch()
                    } else {
                        this.toShare.dispatch()
                    }
                    super.hide(dispatch, callback);
                    if (callback) {
                        callback();
                    }
                    this.afterHide();
                    this.toRemove = true
                }
            })
    }

    show() {
        this.scoreLabel.text = window.TOTAL_COINS || 1;

        this.infoContainer.scale.set(0, this.infoScale);
        TweenLite.to(this.infoContainer.scale, 0.5,
            {
                x: this.infoScale,
                y: this.infoScale,
                ease: Back.easeOut
            });
        TweenLite.to(this.prizeDark, 0.5,
            {
                alpha: 0.75
            });
        this.visible = true;
        super.show();
    }
}