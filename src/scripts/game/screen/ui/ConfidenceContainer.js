import * as PIXI from 'pixi.js';
import Signals from 'signals';
import GradientContainer from './GradientContainer';
import ConfidenceBar from './ConfidenceBar';
export default class ConfidenceContainer extends PIXI.Container
{
    constructor(w, h)
    {
        super();

        let backGradient = new GradientContainer(w, h)
        this.grad = new ConfidenceBar((w * 0.7) - 6, h - 6)
        let confidenceLabel = new PIXI.Text('BODY CONFIDENCE',
        {
            fontFamily: 'lilita_oneregular',
            fontSize: '14px',
            fill: 0x112482,
            align: 'center',
            // fontWeight: '800'
        });
        let confWidth = this.grad.width
        // confidenceLabel.scale.set(confWidth / confidenceLabel.width * 0.6)
        confidenceLabel.x = this.grad.width / 2 - confidenceLabel.width / 2;        

        this.grad.y = confidenceLabel.height
        this.grad.x = 0
        this.addChild(this.grad);
        this.addChild(confidenceLabel);

        this.updateBar(0, true)

    }
    glow(){
        this.grad.glow()
    }
    update(delta){
        this.grad.update(delta)
    }
    updateBar(level = 0, force = false)
    {
        this.grad.updateSelfBar(level, force)
    }
}