import * as PIXI from 'pixi.js';
import Signals from 'signals';
export default class ConfidenceBar extends PIXI.Container {
    constructor(width = 100, height = 50) {
        super();

        var canvas = document.createElement("canvas");

        let ctx = canvas.getContext('2d')
        let grd;

        grd = ctx.createLinearGradient(150.000, 300.000, 150.000, 0.000);

        // Add colors
        grd.addColorStop(0.000, 'rgba(223, 178, 50, 1.000)');
        grd.addColorStop(0.273, 'rgba(210, 166, 77, 1.000)');
        grd.addColorStop(0.416, 'rgba(209, 173, 89, 1.000)');
        grd.addColorStop(0.831, 'rgba(252, 233, 177, 1.000)');
        grd.addColorStop(0.993, 'rgba(244, 224, 163, 1.000)');

        // Fill with gradient
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, 300.000, 300.000);

        this.backImage = new PIXI.Sprite.from(canvas);

        this.maxScale = width / this.backImage.width;
        this.backImage.scale.x = (this.maxScale)
        this.backImage.scale.y = (height / this.backImage.height)

        this.mainMaskGraphic = new PIXI.Graphics().beginFill(0xe05102).drawRoundedRect(0, 0, width, height, height * 0.5)
        this.smallMaskGraphic = new PIXI.Graphics().beginFill(0xe05102).drawRoundedRect(0, 0, width, height, height * 0.5)
        this.smallMaskGraphic.scale.set((width - 4) / width, (height - 4) / height)
        this.smallMaskGraphic.x = 2
        this.smallMaskGraphic.y = 2
        this.darkBlue = new PIXI.Graphics().beginFill(0x112482).drawRoundedRect(0, 0, width, height, height * 0.5)
        this.addChild(this.darkBlue);
        this.addChild(this.backImage);
        this.addChild(this.smallMaskGraphic);
        this.addChild(this.mainMaskGraphic);
        this.mask = this.mainMaskGraphic
        this.backImage.mask = this.smallMaskGraphic



        this.totalSteps = 4;
        this.whiteBlink = new PIXI.Graphics().beginFill(0xFFFFFF).drawRect(0, 0, width, height)
        this.addChild(this.whiteBlink);
        this.whiteBlink.sin = 0;
        this.whiteBlink.visible = false;

        for (var i = 0; i < this.totalSteps - 1; i++) {
            let graph = new PIXI.Graphics().beginFill(0x112482).drawRect(-1, 0, 2, height);

            this.addChild(graph);

            graph.x = (i + 1) * width / (this.totalSteps)
        }

        this.glowing = false;
        // totalSteps
        // this.updateSelfBar(4)
    }
    glow(){
        if(this.glowing){
            return
        }
        this.whiteBlink.visible = true;
        this.whiteBlink.alpha = 0.5;
        TweenLite.killTweensOf(this.whiteBlink);
        TweenLite.to(this.whiteBlink, 0.75, {alpha:0});
    }
    updateSelfBar(value, force = false) {
        if (!this.glowing && value >= this.totalSteps) {
            // this.whiteBlink.visible = true;
            this.glowing = true;
            TweenLite.killTweensOf(this.whiteBlink);
            this.whiteBlink.sin = 0;
        }else if(value < this.totalSteps){
            // this.whiteBlink.visible = false;
            this.whiteBlink.alpha = 0;
            this.glowing = false;
            this.whiteBlink.sin = 0;
        }

        this.currentSelfLevel = value;

        TweenLite.to(this.backImage.scale, force ? 0 : 0.5,
            {
                x: this.maxScale * (this.currentSelfLevel / this.totalSteps)
            })

    }
    update(delta) {
        if(! this.glowing){
            return
        }
        this.whiteBlink.sin += delta * 5;
        this.whiteBlink.alpha = Math.cos(this.whiteBlink.sin) * 0.65;
    }
}