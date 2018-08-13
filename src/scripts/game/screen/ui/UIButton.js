import * as PIXI from 'pixi.js';
import Signals from 'signals';
import config from '../../../config';
import utils from '../../../utils';
export default class UIButton extends PIXI.Container
{
    constructor(width = 100, height = 50, label = 'CONTINUE', scalable = true)
    {
        super();

        console.log(width);
        let margin = width * 0.05
        this.back = new PIXI.Graphics().beginFill(0xFFFFFF).drawRect(0,0, width, height)//PIXI.Sprite(PIXI.Texture.from('button_off'));
        this.border = new PIXI.Graphics().lineStyle(2, 0xFFFFFF).drawRect(0,0, width - margin, height - margin)//PIXI.Sprite(PIXI.Texture.from('button_off'));
        //this.back.anchor.set(0.5)
        this.border.tint = 0xc8a152;

        // this.icon = new PIXI.Sprite(PIXI.Texture.from(texture));
        //this.icon.anchor.set(0.5)
        // if(scl){
        //     // this.icon.scale.set(this.back.width / this.icon.width * scl)
        // }

        this.buttonLabel = new PIXI.Text(label,
        {
            fontFamily: 'lilita_oneregular',
            fontSize: '18px',
            fill: 0x083974,
            align: 'center',
            // fontWeight: '800'
        });

        this.addChild(this.back);
        this.addChild(this.border);
        this.addChild(this.buttonLabel);
        if(scalable && this.buttonLabel.width > this.back.width * 0.7){
            this.buttonLabel.scale.set(this.back.width / this.buttonLabel.width * 0.7)
        }
        this.buttonLabel.x = this.back.width / 2 - this.buttonLabel.width / 2;
        this.buttonLabel.y = this.back.height / 2 - this.buttonLabel.height / 2;

        this.border.x = margin * 0.5
        this.border.y = margin * 0.5
        // this.addChild(this.icon);

        this.buttonMode = true;
        this.interactive = true;

        this.on('mouseup', this.mouseUp.bind(this))
            .on('touchend', this.mouseUp.bind(this))
            .on('pointerout', this.mouseUp.bind(this))
            .on('pointerupoutside', this.mouseUp.bind(this))
            .on('mouseupoutside', this.mouseUp.bind(this));
        this.on('mousedown', this.mouseDown.bind(this)).on('touchstart', this.mouseDown.bind(this));

        // this.iconPos = this.icon.y;
     this.onClick = new Signals();
        // this.iconPos = this.icon.y;
    }
    mouseDown()
    {
        // this.buttonLabel.style.fill = 0xFFFFFF;
        // this.border.tint = 0xFFFFFF;
        // this.back.tint = 0xc8a152;
        this.onClick.dispatch(this);
    }
    mouseUp()
    {
       
    }    
}