import * as PIXI from 'pixi.js';
import Signals from 'signals';
export default class GradientContainer extends PIXI.Container
{
    constructor(width = 100, height = 50)
    {
        super();

        var canvas = document.createElement("canvas");

        let ctx = canvas.getContext('2d')
        let grd;

        grd = ctx.createLinearGradient(150.000, 0.000, 150.000, 300.000);

        // Add colors
        grd.addColorStop(0.000, 'rgba(97, 149, 188, 1.000)');
        grd.addColorStop(0.994, 'rgba(38, 96, 142, 1.000)');

        // Fill with gradient
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, config.width, 300.000);

        this.backImage = new PIXI.Sprite.from(canvas);

        this.backImage.scale.set(width / this.backImage.width, height / this.backImage.height)

        this.maskGraphic = new PIXI.Graphics().beginFill(0xe05102).drawRoundedRect(0, 0, width, height, height * 0.5)
        this.addChild(this.backImage);
        this.addChild(this.maskGraphic);

        this.mask = this.maskGraphic

    }
}