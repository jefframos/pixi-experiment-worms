import * as PIXI from 'pixi.js';
import Signals from 'signals';
import StandardPop from './StandardPop';
import UIButton from '../ui/UIButton';
import UIList from '../ui/UIList';
import GameOverItem from '../ui/GameOverItem';
import PlaymobHelper from '../../../PlaymobHelper';
export default class SharePopUp extends StandardPop
{
    constructor(label, screenManager)
    {
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

        // this.w = config.width * 0.65
        // this.h = config.height * 0.75

        this.h = config.height * 0.75
        this.w = this.h * 1.25 //config.width * 0.65

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
        this.circleShape.y = -this.circleShape.height * 0.8;

        this.infoContainer.mask = shipInfoSprite
        this.infoScale = 1;
        shipInfoSprite.pivot.x = shipInfoSprite.width / 2;
        shipInfoSprite.pivot.y = shipInfoSprite.height / 2;


        this.titleLabel = new PIXI.Text(
            LOCALIZATION.SHARE[LANGUAGE],
            {
                fontFamily: 'lilita_oneregular',
                fontSize: '24px',
                fill: 0xFFFFFF,
                align: 'center',
                // fontWeight: '800'
            });
        // this.titleLabel.scale.set(this.w / this.titleLabel.width * 0.75)
        this.titleLabel.fitWidth = 0.95;
        this.infoList.addChild(this.titleLabel);
        this.infoList.elementsList.push(this.titleLabel);
        this.infoItens.push(this.titleLabel);

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

        this.scoreContainer.addBackground(0,0.5)
        // this.scoreContainer.debug()
        this.scoreContainer.updateHorizontalList();

        this.scoreContainer.listScl = 0.15

        // this.infoList.addChild(this.scoreContainer);
        // this.infoList.elementsList.push(this.scoreContainer);
        // this.infoItens.push(this.scoreContainer);



        this.socialList = new UIList();
        this.socialList.w = this.w * this.background.scale.x * 0.65

        this.socialList.h = this.h * 0.3

        this.socialList.listScl = 0.5 //0.75
        this.socialList.fitHeight = 1 //0.75
        this.infoList.addChild(this.socialList);
        this.infoList.elementsList.push(this.socialList);

        let socials = [1, 3]
        if(window.isIronSource){
            socials = [0, 1, 2, 3]
        }
        // let socials = [0, 1, 2, 4]
        let txts = ['wapp', 'fb', 'sms', 'email']
        let sprites = ['share_whatsapp.png', 'share_fb_messenger.png', 'share_sms.png', 'share_email.png']
        for (var i = 0; i < socials.length; i++)
        {
            let socialContainer = new PIXI.Container();
            let back = new PIXI.Graphics().beginFill(0xFFFFFF).drawCircle(this.socialList.h, this.socialList.h, this.socialList.h)
            socialContainer.addChild(back)

            let spr = new PIXI.Sprite.from(sprites[socials[i]])
            spr.anchor.set(0.5);
            spr.x = back.width / 2;
            spr.y = back.height / 2;
            socialContainer.addChild(spr)
            spr.scale.set(back.height / spr.height * 0.75)
            // let txt = new PIXI.Text(
            // txts[i],
            // {
            //     fontFamily: 'lilita_oneregular',
            //     fontSize: '48px',
            //     fill: 0x3c7fb4,
            //     align: 'center',
            //     // fontWeight: '800'
            // });
            // txt.pivot.x = txt.width / 2;
            // txt.pivot.y = txt.height / 2;
            // txt.x = back.width / 2;
            // txt.y = back.height / 2;
            // socialContainer.addChild(txt)
            let backLine = new PIXI.Graphics().lineStyle(4, 0xc8a152).drawCircle(this.socialList.h * 0.9, this.socialList.h * 0.9, this.socialList.h * 0.9)
            socialContainer.addChild(backLine)
            backLine.x = this.socialList.h * 0.1;
            backLine.y = this.socialList.h * 0.1;
            // socialContainer.listScl = 0.3;
            socialContainer.fitHeight = 0.65;
            socialContainer.id = socials[i];
            socialContainer.interactive = true;
            socialContainer.buttonMode = true;
            socialContainer.on('mouseup', this.socialDown.bind(this)).on('touchend', this.socialDown.bind(this));


            this.socialList.addChild(socialContainer)
            this.socialList.elementsList.push(socialContainer);
        }

        // this.on('mouseup', this.mouseUp.bind(this))
        //     .on('touchend', this.mouseUp.bind(this))
        //     .on('pointerout', this.mouseUp.bind(this))
        //     .on('pointerupoutside', this.mouseUp.bind(this))
        //     .on('mouseupoutside', this.mouseUp.bind(this));
        // this.on('mousedown', this.mouseDown.bind(this)).on('touchstart', this.mouseDown.bind(this));
        // this.socialList.debug()
        this.socialList.addBackground()
        this.socialList.updateHorizontalList();



        this.continueButton = new UIButton(this.w * 0.3, this.w * 0.3 * 0.25, 'PLAY AGAIN') //PIXI.Sprite.from('back_button.png');
        this.infoList.elementsList.push(this.continueButton);
        this.continueButton.listScl = 0.2
        this.continueButton.fitHeight = 0.75
        this.infoItens.push(this.continueButton);
        this.infoList.addChild(this.continueButton);
        this.continueButton.onClick.add(this.hide.bind(this));

        this.container.addChild(this.infoContainer)

        this.infoList.w = shipInfoSprite.width * 0.9
        this.infoList.h = shipInfoSprite.height * 0.7
        this.infoList.updateVerticalList();
        this.infoList.x = -shipInfoSprite.width / 2 + shipInfoSprite.width * 0.05
        this.infoList.y = -shipInfoSprite.height / 2 * 0.5
            // this.infoList.debug();

        this.infoContainer.addChild(this.infoList);


        this.popUpLabel = new PIXI.Text('SHARE',
        {
            fontFamily: 'lilita_oneregular',
            fontSize: '24px',
            fill: 0x3c7fb4,
            align: 'center',
            // fontWeight: '800'
        });
        // this.popUpLabel.scale.set(this.w / this.popUpLabel.width * 0.5)

        this.infoContainer.addChild(this.popUpLabel);
        this.popUpLabel.scale.set(this.w / this.popUpLabel.width * 0.25)
        this.popUpLabel.x = -this.popUpLabel.width / 2;
        this.popUpLabel.y = -this.h / 2 + this.margin * 0.85 - this.popUpLabel.height / 2;

    }



    socialDown(evt)
    {

        var ua = navigator.userAgent.toLowerCase();
        var smsURL;
        var text = 'Sharing is fun!';
        if (ua.indexOf("iphone") > -1 || ua.indexOf("ipad") > -1)
        {
            smsURL = "sms:&body=" + encodeURIComponent(text);
            console.log('iOS', smsURL);

        }
        else
        {
            smsURL = "sms:?body=" + encodeURIComponent(text);
            console.log('not iOS', smsURL);
        }
        // location.href = url;

        let fbURL =  'fb-messenger://share/?link=https%3A%2F%2Fdove.com%2F&app_id=286482021920404'
        if(!window.isIronSource){
            fbURL=  'fb-messenger://share/?link=https%3A%2F%2Fdove.com%2F&app_id=286482021920404'
        }

        // let fbURL =  'fb-messenger://share/?link=https%3A%2F%2Fdove.com%2F&app_id=286482021920404'
        let links = ["whatsapp://send?text=Sharing%20is%20fun", fbURL, smsURL, 'mailto:?to=&body=foo&subject=Play%20this']
        switch (evt.target.id){
            case 0:{
                PlaymobHelper.track(PlaymobHelper.events.SOCIAL_MEDIA_SHARE_WHATSAPP)
                break;
            }
            case 1:{
                PlaymobHelper.track(PlaymobHelper.events.SOCIAL_MEDIA_SHARE_FACEBOOK_MESSENGER)
                break;
            }
            case 2:{
                PlaymobHelper.track(PlaymobHelper.events.SOCIAL_MEDIA_SHARE_SMS)
                break;
            }
            case 3:{
                PlaymobHelper.track(PlaymobHelper.events.SOCIAL_MEDIA_SHARE_EMAIL)
                break;
            }
        }
        console.log(evt.target.id);
        window.location.replace(links[evt.target.id]);
    }
    hide(dispatch, callback)
    {
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
            onComplete: () =>
            {
                if (dispatch)
                {
                    super.hide(dispatch, callback);
                }
                if (callback)
                {
                    callback();
                }
                this.afterHide();
                this.toRemove = true
            }
        })
    }

    show()
    {
        // this.scoreLabel.text = window.TOTAL_COINS||1;
        this.socialList.updateHorizontalList();
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