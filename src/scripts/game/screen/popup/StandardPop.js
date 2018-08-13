import * as PIXI from 'pixi.js';
import Signals from 'signals';
import config from '../../../config';
export default class StandardPop extends PIXI.Container
{
    constructor(label, screenManager)
    {
        super();
        this.screenManager = screenManager;
        this.label = label;
        this.onShow = new Signals();
        this.onHide = new Signals();
        this.onConfirm = new Signals();
        this.onClose = new Signals();

        this.backContainer = new PIXI.Container();
        this.container = new PIXI.Container();

        this.w = config.height * 0.5;
        this.h = config.height * 0.5;

        // this.background = new PIXI.Graphics().beginFill(0).drawRect(-config.width/2, -config.height/2,config.width, config.height) 
        // this.container.addChild(this.background)
        // this.background.alpha = 0.5;


        
        // this.popUp = new PIXI.Graphics().beginFill(0xFFFFFF).drawRect(0, 0, this.w, this.h) //new PIXI.Sprite(PIXI.Texture.from('UIpiece.png'));
        // this.popUp.pivot.x = this.popUp.width / 2
        // this.popUp.pivot.y = this.popUp.height / 2
        //     // this.popUp.scale.set((this.size / this.popUp.width));
        // this.popUp.alpha = 1;
        // // this.popUp.rotation = Math.PI / 4;
        // this.popUp.tint = 0xFFFFFF;
        // // this.popUp.blendMode = PIXI.BLEND_MODES.ADD;
        // this.container.addChild(this.popUp)
        this.container.x = config.width / 2;
        this.container.y = config.height / 2;
        this.addChild(this.backContainer)
        this.addChild(this.container)

        this.container.interactive = true;
        this.container.buttonMode = true;
        this.container.on('mousedown', this.confirm.bind(this)).on('touchstart', this.confirm.bind(this));

        // this.readyLabel = new PIXI.Text('PLAY!', {
        //     fontFamily: 'retro_computerregular',
        //     fontSize: '32px',
        //     fill: 0,
        //     align: 'center',
        //     fontWeight: '800'
        // });
        // this.readyLabel.pivot.x = this.readyLabel.width / 2;
        // this.readyLabel.pivot.y = this.readyLabel.height  / 2;
        // this.container.addChild(this.readyLabel)

    }
    update(delta){

    }
    show(param)
    {
        this.toRemove = false;
        this.onShow.dispatch(this);
        this.visible = true;
    }
    afterHide(){

    }
    hide(dispatch = true, callback = null)
    {
        // this.visible = false;
        this.onHide.dispatch(this);
        // TweenLite.to(this.container, 0.25, {alpha:0});        
    }
    confirm()
    {
        this.onConfirm.dispatch(this);
        this.hide(true);
    }
    close()
    {
        this.onClose.dispatch(this);
        this.hide(true);
    }
}