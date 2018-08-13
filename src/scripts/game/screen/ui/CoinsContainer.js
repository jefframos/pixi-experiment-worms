import * as PIXI from 'pixi.js';
import Signals from 'signals';
import GradientContainer from './GradientContainer';
import UIList from './UIList';
export default class CoinsContainer extends PIXI.Container
{
    constructor(w, h)
    {
        super();
        h -= 6
        this.backGradient = new PIXI.Graphics().beginFill(0x112482).drawRoundedRect(0, 0, w, h, h * 0.5)
       
        this.addChild(this.backGradient);

        this.uiList = new UIList();

        
        this.uiList.w = w;
        this.uiList.h = h;
        this.addChild(this.uiList);

        this.coin = new PIXI.Sprite.from('pickup.png');
        this.coin.align = 0.5
        this.coin.listScl = 0.3
        this.coin.fitHeight = 0.75
        // this.uiList.addChild(this.coin);
        this.uiList.elementsList.push(this.coin)

        this.coinsLabel = new PIXI.Text('0',
        {
            fontFamily: 'lilita_oneregular',
            fontSize: '32px',
            fill: 0xFFFFFF,
            align: 'center',
            // fontWeight: '800'
        });
        this.coinsLabel.fitHeight = 0.9
        this.coinsLabel.align = 0.5
        this.coinsLabel.scaleContentMax = 0.7
        this.uiList.addChild(this.coinsLabel);
        this.uiList.elementsList.push(this.coinsLabel)
        this.coinsLabel.scale.set(this.backGradient.height / this.coinsLabel.height * 0.9)

        // this.uiList.debug()
        // this.uiList.updateHorizontalList()

        let confidenceLabel = new PIXI.Text('SCORE',
        {
            fontFamily: 'lilita_oneregular',
            fontSize: '14px',
            fill: 0x112482,
            align: 'center',
            // fontWeight: '800'
        });
        let confWidth = this.backGradient.width
        // confidenceLabel.scale.set(confWidth / confidenceLabel.width * 0.6)
        confidenceLabel.x = this.backGradient.width / 2 - confidenceLabel.width / 2;     
        this.addChild(confidenceLabel);  

        this.uiList.y = confidenceLabel.height 
        this.backGradient.y = confidenceLabel.height 
        // setTimeout(()=>{this.updateCoins(535135354325432)}, 1000);
    }
    updateCoins(value){
        this.coinsLabel.text = value

        this.coinsLabel.x = this.backGradient.width / 2 - this.coinsLabel.width / 2
        this.coinsLabel.y = this.backGradient.height / 2 - this.coinsLabel.height / 2
        // this.uiList.updateHorizontalList()
    }
}