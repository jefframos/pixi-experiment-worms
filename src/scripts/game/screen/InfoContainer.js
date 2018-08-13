import * as PIXI from 'pixi.js';
import Signals from 'signals';
import UIList from './ui/UIList';
export default class InfoContainer extends UIList
{
    constructor()
    {
        super();

        window.onkeyup = function (evt) {
            // console.log('INFOOOOOO');
            if(!this.visible){
                return;
            }
           
            if (evt.key == 'ArrowUp') {
                this.hideCallback();
            }
            else if (evt.key == 'ArrowRight' || evt.key == 'ArrowLeft') {
                this.hideCallback();
            }
            // console.log(evt);
            // console.log(this);

        }.bind(this);


        this.onHide = new Signals();

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


        this.prizeDark = new PIXI.Graphics().beginFill(0).drawRect(0, 0, config.width, config.height) //new PIXI.Sprite(PIXI.Texture.from('UIpiece.png'));
        this.prizeDark.alpha = 0.25;
        this.prizeDark.interactive = true;
        this.prizeDark.buttonMode = true;
        this.prizeDark.on('mousedown', this.hideCallback.bind(this)).on('touchstart', this.hideCallback.bind(this));
        this.addChild(this.prizeDark);

        this.infoItens = [];
        this.infoList = new UIList();

        this.infoContainer = new PIXI.Container();
        let shipInfoSprite = new PIXI.Graphics().beginFill(0).drawRoundedRect(0, 0, config.width * 0.65, config.height * 0.15, roundRadius * 0.5)
        this.infoContainer.addChild(shipInfoSprite);

        this.margin = config.height * 0.15;

        this.background = new PIXI.Graphics().beginFill(0x3c7fb4).drawRect(-config.width / 2, -config.height / 2, config.width, config.height)
        this.background.scale.set(config.width / this.background.width, config.height / this.background.height)
        this.infoContainer.addChild(this.background)

        this.circleShape = new PIXI.Graphics().beginFill(0xFFFFFF).drawCircle(0, 0, shipInfoSprite.height / 2)
            // this.infoContainer.addChild(this.circleShape)
        this.circleShape.scale.x = maskScale.x
        this.circleShape.y = -this.circleShape.height * 0.8;

        this.infoContainer.mask = shipInfoSprite
        this.infoScale = 1
        shipInfoSprite.pivot.x = shipInfoSprite.width / 2;
        shipInfoSprite.pivot.y = shipInfoSprite.height / 2;

        // shipInfoSprite.anchor.set(0.5);

        this.infoIcon = new PIXI.Sprite.from('pickup.png');
        this.infoList.elementsList.push(this.infoIcon);
        this.infoIcon.listScl = 0.2
        this.infoIcon.fitHeight = 0.75
        this.infoItens.push(this.infoIcon);
        this.infoList.addChild(this.infoIcon);

        this.addChild(this.infoContainer)


        this.infoLabel = new PIXI.Text('Do you want change your cats by fish?',
        {
            fontFamily: 'lilita_oneregular',
            fontSize: '24px',
            fill: 0xFFFFFF,
            align: 'center',
            // fontWeight: '800'
        });
        this.infoLabel.scaleContentMax = true;
        this.infoList.addChild(this.infoLabel);
        this.infoList.elementsList.push(this.infoLabel);
        this.infoItens.push(this.infoLabel);

        this.infoList.w = shipInfoSprite.width * 0.85
        this.infoList.h = shipInfoSprite.height * 0.85
        this.infoList.updateHorizontalList();
        this.infoList.x = -shipInfoSprite.width / 2 + shipInfoSprite.width * 0.075
        this.infoList.y = -shipInfoSprite.height / 2 + shipInfoSprite.height * 0.075

        this.infoContainer.addChild(this.infoList);

        this.infoContainer.y = -this.infoContainer.height

        // this.filterGlow = new GlowFilter(50, 2, 0, 0x001e3e, 0.1);
        // this.infoContainer.filters = [this.filterGlow]

        this.hide();
    }
    hideCallback()
    {
        SOUND_MANAGER.play('click')
        this.onHide.dispatch();
        this.hide();
    }
    hide()
    {
        this.visible = false;
    }
    show(pos, icon = null, desc = 'lalala', align = {
        x: 0.5,
        y: 0.5
    }, block = false)
    {
        
        this.prizeDark.visible = block;
        // SOUND_MANAGER.play('pickup_item2')
        this.infoList.elementsList = [];
        for (var i = 0; i < this.infoItens.length; i++)
        {
            this.infoList.elementsList.push(this.infoItens[i]);
        }

        if (this.containerThumb && this.containerThumb.parent)
        {
            this.containerThumb.parent.removeChild(this.containerThumb)
        }
        if (icon instanceof PIXI.Container)
        {
            this.containerThumb = icon
            this.infoIcon.addChild(this.containerThumb);
            this.infoIcon.visible = true;
            this.infoIcon.texture = null;
        }
        else if (!icon)
        {
            for (var j = this.infoList.elementsList.length - 1; j >= 0; j--)
            {
                if (this.infoIcon == this.infoList.elementsList[j])
                {
                    this.infoList.elementsList.splice(j, 1)
                }
            }
            this.infoIcon.visible = false
        }
        else
        {
            this.infoIcon.texture = new PIXI.Texture.from(icon);
            this.infoIcon.visible = true
        }

        this.infoContainer.x = pos.x //- align.x * this.realSize.w/2
        this.infoContainer.y = config.height - this.infoContainer.mask.height //- align.y * this.realSize.h/2
        this.infoLabel.text = desc

        this.infoList.updateHorizontalList();

        this.infoContainer.scale.set(this.infoScale, 0);
        TweenLite.to(this.infoContainer.scale, 0.75,
        {
            x: this.infoScale,
            y: this.infoScale,
            ease: Elastic.easeOut
        });
        TweenLite.to(this.prizeDark, 0.5,
        {
            alpha: 0.25
        });
        this.visible = true;

        console.log('SHOW INFOOOOOOOO');
        console.log('SHOW INFOOOOOOOO');

        clearTimeout(this.timeout);
        if (!block)
        {
            this.timeout = setTimeout(() =>
            {
                this.hide();
            }, 6000);
        }
    }
}