import * as PIXI from 'pixi.js';
import Signals from 'signals';
export default class GameOverItem extends PIXI.Container
{
    constructor(width = 100, height = 50, text = 'lorem ipsun')
    {
        super();

        let margin = width * 0.05
        this.back = new PIXI.Graphics().beginFill(0xFFFFFF).drawRoundedRect(0,0, width, height)//PIXI.Sprite(PIXI.Texture.from('button_off'));
        this.border = new PIXI.Graphics().lineStyle(1, 0xFFFFFF).drawRoundedRect(0,0, width, height)//PIXI.Sprite(PIXI.Texture.from('button_off'));
        //this.back.anchor.set(0.5)

        // this.icon = new PIXI.Sprite(PIXI.Texture.from(texture));
        //this.icon.anchor.set(0.5)
        // if(scl){
        //     // this.icon.scale.set(this.back.width / this.icon.width * scl)
        // }
        this.back.alpha = 0;

        this.pledge = text;

        this.buttonLabel = new PIXI.Text(text,
        {
            fontFamily: 'lilita_oneregular',
            fontSize: '18px',
            fill: 0xFFFFFF,
            align: 'center',
            // fontWeight: '800'
        });

        this.addChild(this.back);
        this.addChild(this.border);
        this.addChild(this.buttonLabel);
        // if(this.buttonLabel.width > this.back.width * 0.8){
        //     this.buttonLabel.scale.set(this.back.width / this.buttonLabel.width * 0.8)
        // }

        if((this.buttonLabel.width * 0.9) > this.back.width){
            // this.buttonLabel.scale.set(this.back.width / this.buttonLabel.width * 0.9)
        }
        this.buttonLabel.scale.set(this.back.height / this.buttonLabel.height * 0.4)

        this.buttonLabel.x = this.back.width / 2 - this.buttonLabel.width / 2;
        this.buttonLabel.y = this.back.height / 2 - this.buttonLabel.height / 2;

        // this.border.x = margin * 0.5
        // this.border.y = margin * 0.5
        // this.addChild(this.icon);
        this.interactive = true;

        this.on('mouseup', this.mouseUp.bind(this))
            .on('touchend', this.mouseUp.bind(this))
            .on('pointerout', this.mouseUp.bind(this))
            .on('pointerupoutside', this.mouseUp.bind(this))
            .on('mouseupoutside', this.mouseUp.bind(this));
        this.on('mousedown', this.mouseDown.bind(this)).on('touchstart', this.mouseDown.bind(this));

        this.onToggle = new Signals();
        this.isSelected = false;
        // this.iconPos = this.icon.y;
    }
    toggle(){
        if(this.isSelected){
            this.unselect()
        }else{
            this.select()
        }
        this.onToggle.dispatch(this);
    }
    unselect(){
        this.isSelected = false;
        this.buttonLabel.style.fill = 0xFFFFFF;
        this.back.alpha = 0;
    }
    select(){
        this.isSelected = true;
        this.buttonLabel.style.fill = 0x3c7fb4;
        this.back.alpha = 1;
    }
    mouseDown()
    {
        this.toggle();
    }
    mouseUp()
    {
        
    }
    
}