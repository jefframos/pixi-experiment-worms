import * as PIXI from 'pixi.js';
import Signals from 'signals';
import StandardPop from './StandardPop';
import UIButton from '../ui/UIButton';
import UIList from '../ui/UIList';
import GameOverItem from '../ui/GameOverItem';
export default class GameOverPopUp extends StandardPop
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

        this.h = config.height * 0.75
        this.w = this.h * 1.5//config.width * 0.65

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
            LOCALIZATION.START_SCREEN[LANGUAGE],
        {
            fontFamily: 'lilita_oneregular',
            fontSize: '32px',
            fill: 0xFFFFFF,
            align: 'center',
            // fontWeight: '800'
        });
        this.titleLabel.scale.set(this.w / this.titleLabel.width * 0.75)
        this.titleLabel.scaleContentMax = true;
        this.infoList.addChild(this.titleLabel);
        this.infoList.elementsList.push(this.titleLabel);
        this.infoItens.push(this.titleLabel);


       
        this.continueButton = new UIButton(this.w * 0.3, this.w * 0.3 * 0.25, "  PLEDGE  ") //PIXI.Sprite.from('back_button.png');
        // this.infoList.elementsList.push(this.continueButton);
        this.continueButton.listScl = 0.5
        this.continueButton.fitWidth = 0.65
        // this.infoItens.push(this.continueButton);
        // this.infoList.addChild(this.continueButton);
        this.continueButton.onClick.add(this.toContinue.bind(this));

        // this.container.addChild(this.infoContainer)

        this.playAgainButton = new UIButton(this.w * 0.3, this.w * 0.3 * 0.25, "PLAY AGAIN") //PIXI.Sprite.from('back_button.png');
        // this.infoList.elementsList.push(this.playAgainButton);
        this.playAgainButton.listScl = 0.5
        this.playAgainButton.fitWidth = 0.65
        // this.infoItens.push(this.playAgainButton);
        // this.infoList.addChild(this.playAgainButton);
        this.playAgainButton.onClick.add(this.playAgain.bind(this));
        
        this.buttonsContainer = new UIList();
        this.buttonsContainer.h = config.height * 0.15
        this.buttonsContainer.w = this.w //* 0.75
        
        this.buttonsContainer.addBackground(0)
        this.buttonsContainer.addChild(this.continueButton)
        this.buttonsContainer.addChild(this.playAgainButton)
        // this.infoList.addChild(this.playAgainButton);
        // this.infoList.addChild(this.playAgainButton);
        this.buttonsContainer.elementsList.push(this.playAgainButton)
        this.buttonsContainer.elementsList.push(this.continueButton)
        this.buttonsContainer.updateHorizontalList()



        this.infoList.addChild(this.buttonsContainer);
        this.infoList.elementsList.push(this.buttonsContainer);


        this.container.addChild(this.infoContainer)

        this.infoList.w = shipInfoSprite.width * 0.9
        this.infoList.h = shipInfoSprite.height * 0.7
        this.infoList.updateVerticalList();
        this.infoList.x = -shipInfoSprite.width / 2 + shipInfoSprite.width * 0.05
        this.infoList.y = -shipInfoSprite.height / 2 * 0.5
        // this.infoList.debug();

        this.infoContainer.addChild(this.infoList);


         this.popUpLabel = new PIXI.Text('Game Over',
        {
            fontFamily: 'lilita_oneregular',
            fontSize: '24px',
            fill: 0x3c7fb4,
            align: 'center',
            // fontWeight: '800'
        });
        // this.popUpLabel.scale.set(this.w / this.popUpLabel.width * 0.5)
        
        // this.addChild(this.popUpLabel);
        this.infoContainer.addChild(this.popUpLabel);
        this.popUpLabel.scale.set(this.w / this.popUpLabel.width * 0.4)
        this.popUpLabel.x = -this.popUpLabel.width / 2;
        this.popUpLabel.y = - this.h / 2 + this.margin * 0.85- this.popUpLabel.height / 2;

        this.playAgain = new Signals();
        this.onContinue = new Signals();

    }
    toContinue(){

        this.onContinue.dispatch();
        this.hide();
    }
    
    
    playAgain(){
        this.playAgain.dispatch();
        this.hide();
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

    show(params)
    {
        // alert()
        SOUND_MANAGER.play('level_complete')
        console.log(params);
        this.titleLabel.text = LOCALIZATION.GAME_OVER[LANGUAGE]
        if (params)
        {
            // this.scoreLabel.text = params.coins;
            // this.scoreContainer.updateHorizontalList();

            switch (params.level)
            {
                case 0:
                    {
                        this.titleLabel.text = LOCALIZATION.LEVEL_1_GAME_OVER[LANGUAGE]
                        break
                    }
                case 1:
                    {
                        this.titleLabel.text = LOCALIZATION.LEVEL_2_GAME_OVER[LANGUAGE]
                        break
                    }
                case 2:
                    {
                        // this.popUpLabel.text = 'Game Clear'
                        this.titleLabel.text = LOCALIZATION.LEVEL_3_GAME_OVER[LANGUAGE]
                        break
                    }
            }
        }


        this.popUpLabel.x = -this.popUpLabel.width / 2;


        this.infoList.updateVerticalList();
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