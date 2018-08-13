import * as PIXI from 'pixi.js';
export default class UIList extends PIXI.Container
{
    constructor()
    {
        super();
        this.container = new PIXI.Container();
        this.addChild(this.container);
        this.elementsList = [];
        this.w = 0;
        this.h = 0;
    }
    addBackground(alpha = 0)
    {
        this.background = new PIXI.Graphics().beginFill(0xFF0000).drawRect(0, 0, this.w, this.h)
        this.container.addChild(this.background)
        this.background.alpha = alpha;
    }
    debug()
    {
        this.debugGr = new PIXI.Graphics().beginFill(0xFF0000).drawRect(0, 0, this.w, this.h)
        this.container.addChild(this.debugGr)
        this.debugGr.alpha = 0.5;
    }
    updateHorizontalList()
    {
        let listSizes = [];
        let sum = 0;
        let quant = 0;
        for (var i = 0; i < this.elementsList.length; i++)
        {

            if (this.elementsList[i].listScl)
            {
                listSizes.push(this.elementsList[i].listScl)
                sum += this.elementsList[i].listScl;
                quant++;
            }
            else
            {
                listSizes.push(0);
            }
        }
        let adjust = 1 - sum;
        let scales = adjust / ((this.elementsList.length) - quant);
        let chunkSize = 0;
        for (var i = 0; i < this.elementsList.length; i++)
        {
            if (listSizes[i] == 0)
            {
                listSizes[i] = scales
            }
        }
        let plus = 0;
        let positions = [];
        let stdH = 1;
        let stdW = 1;
        for (var i = 0; i < listSizes.length; i++)
        {
            // let pixig = new PIXI.Graphics().beginFill(0xFF0000).drawCircle(0, 0, 5)
            // this.container.addChild(pixig)
            plus = 0;
            let nextX = 0;
            chunkSize = this.w * listSizes[i];
            if (i == 0)
            {
                nextX = 0;
            }
            else
            {
                nextX = positions[i - 1] + this.w * listSizes[i - 1]
            }
            positions.push(nextX);
            if (this.elementsList[i].fitHeight)
            {
                stdH = (this.elementsList[i].height / this.elementsList[i].scale.y)
                this.elementsList[i].scale.set(this.h / stdH * this.elementsList[i].fitHeight)
            }
            if (this.elementsList[i].fitWidth)
            {
                stdW = (this.elementsList[i].width / this.elementsList[i].scale.x)
                this.elementsList[i].scale.set(chunkSize / stdW * this.elementsList[i].fitWidth)
            }
            else if (this.elementsList[i].scaleContent)
            {
                stdW = (this.elementsList[i].width / this.elementsList[i].scale.x)
                this.elementsList[i].scale.set(chunkSize / stdW)
            }
            else if (this.elementsList[i].scaleContentMax && (this.elementsList[i].width > chunkSize))
            {
                stdW = (this.elementsList[i].width / this.elementsList[i].scale.x)
                this.elementsList[i].scale.set(chunkSize / stdW * this.elementsList[i].scaleContentMax)
            }
            let align = 0.5
            if (this.elementsList[i].align != undefined)
            {
                align = this.elementsList[i].align;
            }

            this.elementsList[i].x = nextX + chunkSize * align - this.elementsList[i].width * align;
            // pixig.x = this.elementsList[i].x 
            this.elementsList[i].y = this.h / 2 - this.elementsList[i].height / 2
        }

    }


    updateVerticalList()
    {
        let listSizes = [];
        let sum = 0;
        let quant = 0;
        for (var i = 0; i < this.elementsList.length; i++)
        {

            if (this.elementsList[i].listScl)
            {
                listSizes.push(this.elementsList[i].listScl)
                sum += this.elementsList[i].listScl;
                quant++;
            }
            else
            {
                listSizes.push(0);
            }
        }
        let adjust = 1 - sum;
        let scales = adjust / ((this.elementsList.length) - quant);
        let chunkSize = 0;
        for (var i = 0; i < this.elementsList.length; i++)
        {
            if (listSizes[i] == 0)
            {
                listSizes[i] = scales
            }
        }
        let plus = 0;
        let positions = [];
        let stdH = 1;
        let stdW = 1;
        for (var i = 0; i < listSizes.length; i++)
        {
            // let pixig = new PIXI.Graphics().beginFill(0xFF0000).drawCircle(0, 0, 5)
            // this.container.addChild(pixig)
            plus = 0;
            let nextX = 0;
            chunkSize = this.h * listSizes[i];
            if (i == 0)
            {
                nextX = 0;
            }
            else
            {
                nextX = positions[i - 1] + this.h * listSizes[i - 1]
            }
            positions.push(nextX);
            if (this.elementsList[i].fitHeight)
            {
                stdH = (this.elementsList[i].height / this.elementsList[i].scale.y)
                this.elementsList[i].scale.set(chunkSize / stdH * this.elementsList[i].fitHeight)
            }
            else if (this.elementsList[i].fitWidth)
            {
                stdW = (this.elementsList[i].width / this.elementsList[i].scale.x)
                this.elementsList[i].scale.set(this.w / stdW * this.elementsList[i].fitWidth)
            }
            else if (this.elementsList[i].scaleContent)
            {
                stdW = (this.elementsList[i].height / this.elementsList[i].scale.y)
                this.elementsList[i].scale.set(chunkSize / stdW)
            }
            else if (this.elementsList[i].scaleContentMax && (this.elementsList[i].height > chunkSize))
            {
                stdW = (this.elementsList[i].height / this.elementsList[i].scale.y)
                this.elementsList[i].scale.set(chunkSize / stdW)
            }
            let align = 0.5
            if (this.elementsList[i].align != undefined)
            {
                align = this.elementsList[i].align;
            }

            let nextY = nextX + chunkSize * align - this.elementsList[i].height * align
            this.elementsList[i].y = nextY;
            // pixig.x = nextX

            this.elementsList[i].x = this.w / 2 - this.elementsList[i].width / 2
        }

    }
}