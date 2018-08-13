import * as PIXI from 'pixi.js';
import Coin from './Coin';
import Enemy from './Enemy';
import Trigger from './Trigger';
export default class SceneManager {
    constructor(gameScreen) {
        this.gameScreen = gameScreen;

        this.environmentList = [];
        this.floorList = [];
        this.floorListMiddle = [];
        this.floorListFront = [];

        this.coins = [];
        this.enemies = [];
        this.triggers = [];

        this.totalShopTexture = 6;
        this.totalShopsInScreen = 5;

        this.triggersMessages = [];
    }
    getTrigger() {
        let trigger;
        if (window.TRIGGER_POOL.length) {
            trigger = window.TRIGGER_POOL[0];
            window.TRIGGER_POOL.shift();
        }
        if (!trigger) {
        }
        trigger = new Trigger(config.height * 0.28);
        return trigger;
    }
    getEnemy() {
        let enemy;
        if (window.ENEMY_POOL.length) {
            enemy = window.ENEMY_POOL[0];
            window.ENEMY_POOL.shift();
        }
        if (!enemy) {
            enemy = new Enemy(config.height * 0.28);
        }
        return enemy;
    }
    getCoin() {
        let coin;
        if (window.COIN_POOL.length) {
            coin = window.COIN_POOL[0];
            window.COIN_POOL.shift();
        }
        if (!coin) {
            coin = new Coin(config.height * 0.15);
        }
        return coin;
    }
    getEnv() {
        let env;
        if (window.ENVIRONMENT_POOL.length) {
            env = window.ENVIRONMENT_POOL[0];
            window.ENVIRONMENT_POOL.shift();
        }
        if (!env) {
            env = new PIXI.Sprite();
        }
        return env;
    }
    updateFloor(delta) {
        let texts = ['floor_back', 'floor_middle', 'floor_front']
        let arrays = ['floorList', 'floorListMiddle', 'floorListFront']
        for (var j = 0; j < arrays.length; j++) {

            for (var i = this[arrays[j]].length - 1; i >= 0; i--) {
                let tempShop = this[arrays[j]][i];
                tempShop.x -= this.gameScreen.player.velocity.x * delta * (1 + (j / 3 * 0.25));
                if (tempShop.x + tempShop.width < -tempShop.width) {
                    tempShop.parent.removeChild(tempShop);
                    ENVIRONMENT_POOL.push(tempShop);
                    this[arrays[j]].splice(i, 1);
                }
            }
            while (this[arrays[j]].length < this.totalShopsInScreen) {
                let floor = this.getEnv();

                floor.texture = PIXI.Texture.from(window.ASSET_URL + 'assets/env/' + texts[j] + '.jpg')
                if (j >= texts.length - 1 && !floor.floor) {
                    let floorFloor = this.getEnv();
                    floorFloor.texture = PIXI.Texture.from(window.ASSET_URL + 'assets/env/floor_02.png')
                    floorFloor.y = floor.height;
                    floorFloor.scale.set(floor.width / floorFloor.width / floorFloor.scale.y)
                    floor.addChild(floorFloor);

                    floor.floor = floorFloor;
                }
                floor.scale.set(this.gameScreen.currentShopScale, this.gameScreen.currentShopScale * 1.2)
                if (j > 0) {
                    let last = this[arrays[j - 1]][0]
                    floor.y = last.y + last.height;
                }
                else {
                    floor.y = this.gameScreen.currentShopPos;
                }
                if (this[arrays[j]].length) {
                    let last = this[arrays[j]][this[arrays[j]].length - 1]
                    floor.x = last.x + last.width;
                }
                this.gameScreen.floorContainer.addChild(floor);
                this[arrays[j]].push(floor)
            }
        }
    }
    updateEnvironment(delta) {

        let movingEscalator = false;
        if (this.gameScreen.escalatorContainer && this.gameScreen.escalatorContainer.x > -this.gameScreen.escalatorContainer.width) {
            movingEscalator = true;
            this.gameScreen.escalatorContainer.x -= this.gameScreen.player.velocity.x * delta;
        }
        //else 
        if (this.gameScreen.npcConainer) {
            this.gameScreen.npcConainer.x -= this.gameScreen.player.velocity.x * delta;

            if (this.gameScreen.npcConainer.x < -this.gameScreen.npcConainer.width - 30 && !movingEscalator) {
                this.gameScreen.currentNPC++;
                this.gameScreen.npc1.texture = PIXI.Texture.from('shadow_0' + (this.gameScreen.currentNPC) + '.png');
                this.gameScreen.currentNPC %= 7;

                this.gameScreen.currentNPC++;
                this.gameScreen.npc2.texture = PIXI.Texture.from('shadow_0' + (this.gameScreen.currentNPC) + '.png');
                this.gameScreen.currentNPC %= 7;

                this.gameScreen.currentNPC++;
                this.gameScreen.npc3.texture = PIXI.Texture.from('shadow_0' + (this.gameScreen.currentNPC) + '.png');
                this.gameScreen.currentNPC %= 7;

                this.gameScreen.npcConainer.x = config.width + Math.random() * this.gameScreen.npcConainer.width * 3 //+ this.gameScreen.npc.width
                this.gameScreen.environmentContainer.removeChild(this.gameScreen.npcConainer)
                this.gameScreen.environmentContainer.addChild(this.gameScreen.npcConainer)
            }
        }
        for (var i = this.environmentList.length - 1; i >= 0; i--) {
            let tempShop = this.environmentList[i];
            tempShop.x -= this.gameScreen.player.velocity.x * delta * 0.9;
            if (tempShop.x + tempShop.width < -tempShop.width * 0.5) {
                tempShop.parent.removeChild(tempShop);
                ENVIRONMENT_POOL.push(tempShop);
                this.environmentList.splice(i, 1);
            }
        }
        while (this.environmentList.length < this.totalShopsInScreen) {
            let shop = this.getEnv();
            let id = Math.ceil(Math.random() * this.totalShopTexture)
            // console.log(id);
            shop.texture = PIXI.Texture.from('shop0' + id + '.jpg');

            if (!shop.ceiling) {
                let ceiling = new PIXI.Sprite.from(window.ASSET_URL + 'assets/env/floor_02.png');
                ceiling.scale.set(shop.width / ceiling.width);
                shop.addChild(ceiling);
                shop.ceiling = ceiling;
                ceiling.scale.y *= 5
                ceiling.y = -ceiling.height;
            }

            shop.scale.set(config.height * 0.55 / shop.height * shop.scale.y)
            // shop.y = config.height * 0.9 - shop.height - 50;

            shop.y = this.gameScreen.floorPos - shop.height - 50 //- shop.height - 50;

            this.gameScreen.currentShopPos = shop.y + shop.height
            this.gameScreen.currentShopScale = shop.scale.x;
            if (this.environmentList.length) {
                let last = this.environmentList[this.environmentList.length - 1]
                shop.x = last.x + last.width;
            } else {
                shop.x = -500
            }
            this.gameScreen.environmentContainer.addChildAt(shop, 0);
            this.environmentList.push(shop)
        }
    }
    updateEnemies(delta) {
        for (var i = this.enemies.length - 1; i >= 0; i--) {
            let tempEntity = this.enemies[i];
            if (!tempEntity) {
                return
            }
            if (!tempEntity.isFinalLine) {
                tempEntity.update(delta);
            }
            tempEntity.x -= this.gameScreen.player.velocity.x * delta;
            let force = false

            if (tempEntity.isFinalLine && this.gameScreen.player.x > tempEntity.x) {
                this.gameScreen.endGame();
                return;
            }
            let getCollided = this.playerCollision(tempEntity, this.gameScreen.player);
            if (tempEntity.hitted > 0) {
                tempEntity.hitted--;
            }
            if (!tempEntity.hitted && !tempEntity.isFinalLine && !this.gameScreen.player.dashing && !this.gameScreen.gameFinished && getCollided) {
                tempEntity.hitted = 8;
                this.gameScreen.getHurt();
                // force = true;
                // tempEntity.hitted = true;
            } else if (!tempEntity.hitted && !tempEntity.isFinalLine && this.gameScreen.player.dashing && !this.gameScreen.gameFinished && getCollided) {
                tempEntity.kill();
                tempEntity.avoided = true;
                this.gameScreen.hitEnemy(tempEntity);
                tempEntity.avoid()
                // alert('AVOIDED')
                // alert('KILL ENEMY')
            }
            if (!tempEntity.avoided && tempEntity.x < this.gameScreen.player.x) {
                tempEntity.avoided = true;
                this.gameScreen.avoidEnemy();
                tempEntity.avoid()
                // alert('AVOIDED')
            }
            if (tempEntity.x + tempEntity.width < -5)
            // if (force || tempEntity.x + tempEntity.width < -5)
            {
                tempEntity.parent.removeChild(tempEntity);
                if (tempEntity.isEnemy) {
                    ENEMY_POOL.push(tempEntity);
                }
                this.enemies.splice(i, 1);
            }

        }
    }
    updateCoins(delta) {
        for (var i = this.coins.length - 1; i >= 0; i--) {
            let tempCoin = this.coins[i];
            tempCoin.update(delta);
            tempCoin.x -= this.gameScreen.player.velocity.x * delta;
            let force = false
            if (!this.gameScreen.gameFinished && this.playerCollision(tempCoin, this.gameScreen.player)) {
                this.gameScreen.getCoins(tempCoin);
                force = true;
            }
            if (force || tempCoin.x + tempCoin.width < -5) {
                tempCoin.parent.removeChild(tempCoin);
                COIN_POOL.push(tempCoin);
                this.coins.splice(i, 1);
            }

        }
    }

    updateTriggers(delta) {
        for (var i = this.triggers.length - 1; i >= 0; i--) {
            let tempTrigger = this.triggers[i];
            tempTrigger.update(delta);
            tempTrigger.x -= this.gameScreen.player.velocity.x * delta;
            let force = false
            if (!this.gameScreen.gameFinished && this.gameScreen.player.x > tempTrigger.x)//this.playerCollision(tempTrigger, this.gameScreen.player))
            {
                this.gameScreen.popTrigger(tempTrigger);
                force = true;
            }
            if (force || tempTrigger.x + tempTrigger.width < -5) {
                tempTrigger.parent.removeChild(tempTrigger);
                TRIGGER_POOL.push(tempTrigger);
                this.triggers.splice(i, 1);
            }

        }
    }
    addTrigger(pos = 0, message = 'hfas') {
        let found = this.triggersMessages.find(function (element) {
            return element == message;
        });

        if (!found) {
            this.triggersMessages.push(message)
            this.addTriggerBlock(pos, message)
            return
        }
        let trigger = this.getTrigger(config.height * 0.25);

        console.log('ADD TRIGGER');
        trigger.y = this.gameScreen.floorPos - trigger.height * 0.5
        trigger.x = config.width;
        trigger.reset(message)
        this.triggers.push(trigger)
        // debugger
        this.gameScreen.entityContainer.addChild(trigger)
    }

    addTriggerBlock(pos = 0, message = 'hfas') {
        let trigger = this.getTrigger(config.height * 0.25);

        trigger.y = this.gameScreen.floorPos - trigger.height * 0.5
        trigger.x = config.width;
        trigger.reset(message, true)
        this.triggers.push(trigger)
        // debugger
        this.gameScreen.entityContainer.addChild(trigger)
    }

    addCoin(pos = 0, height = 0) {
        let coin = this.getCoin(config.height * 0.35);

        coin.y = this.gameScreen.floorPos - coin.height - coin.height * height;
        coin.x = config.width + pos;
        this.coins.push(coin)
        // debugger
        this.gameScreen.entityContainer.addChild(coin)
    }
    addEnemy(pos = 0, ) {
        let enemy = this.getEnemy(config.height * 0.5);
        enemy.reset(this.gameScreen.levelAssets[this.gameScreen.currentRun].enemy, this.gameScreen.levelAssets[this.gameScreen.currentRun].enemyScale);
        enemy.isStatic = this.gameScreen.levelAssets[this.gameScreen.currentRun].enemyStatic;
        enemy.alpha = 1;
        enemy.x = config.width + enemy.radius + pos
        enemy.y = this.gameScreen.floorPos + 10//- enemy.radius * 0.5

        this.enemies.push(enemy)
        this.gameScreen.entityContainer.addChild(enemy)
    }

    AABBDetect(rect1, rect2) {
        if (rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.height + rect1.y > rect2.y) {
            return true;
        }
        return false;
    }
    circleCollision(entity1, entity2) {
        let a = entity1.x - entity2.x;
        let b = entity1.y - entity2.y;
        let c = Math.sqrt(a * a + b * b);
        return c < entity1.width / 2 + entity2.width / 2;
    }
    playerCollision(entity1, player) {
        let a = entity1.x - player.x;
        // console.log(player.entitySprite.height * player.entitySprite.anchor.y)
        let b = (entity1.y - entity1.height / 2) - player.y - player.circleCollision.y // player.entitySprite.height * player.entitySprite.anchor.y;
        let c = Math.sqrt(a * a + b * b);
        return c < (entity1.width / 2 + player.circleCollision.width / 2) * 0.8;
    }

    addFinalLine() {

        this.gameScreen.addEndEscalator();
        if (this.gameScreen.finalLineChar && this.gameScreen.finalLineChar.parent) {
            this.gameScreen.finalLineChar.parent.removeChild(this.gameScreen.finalLineChar);

            this.gameScreen.finalLineChar.texture = PIXI.Texture.from(this.gameScreen.levelAssets[this.gameScreen.currentRun].finalLine);
        } else {
            this.gameScreen.finalLineChar = new PIXI.Sprite.from(this.gameScreen.levelAssets[this.gameScreen.currentRun].finalLine);
        }
        this.gameScreen.finalLineChar.scale.set(this.gameScreen.player.radius / this.gameScreen.finalLineChar.width * this.gameScreen.finalLineChar.scale.y * 0.75)
        this.gameScreen.finalLineChar.anchor.set(0.5, 0.95);
        this.gameScreen.finalLineChar.y = this.gameScreen.escalator.y + this.gameScreen.escalator.height * 0.8 + 20 //- this.finalLineChar.height //* 1.5 - this.finalLineChar.height * 1.5 //* this.escalator.anchor.y//this.floorPos - this.finalLineChar.radius * 0.5 + 200
        // this.finalLineChar.y = 500//this.escalator.height * 0.8 + 10//- this.finalLineChar.height //* 1.5 - this.finalLineChar.height * 1.5 //* this.escalator.anchor.y//this.floorPos - this.finalLineChar.radius * 0.5 + 200
        this.gameScreen.finalLineChar.x = this.gameScreen.escalator.x - this.gameScreen.escalator.width * 0.75// - (this.gameScreen.escalator.width / this.gameScreen.escalator.scale.x) - this.gameScreen.finalLineChar.width //- 100 //+ 150 //config.width + this.finalLineChar.radius
        // this.finalLineChar.x = - (this.escalator.width * this.escalator.scale.x) - this.finalLineChar.width - 125 //+ 150 //config.width + this.finalLineChar.radius
        // this.gameScreen.finalLineChar.hitted = true;

        this.gameScreen.finalLineChar.scale.x *= this.gameScreen.levelAssets[this.gameScreen.currentRun].endImageSide;

        let finalLine = this.getEnemy(config.height * 0.5);
        finalLine.setFinalLine(this.gameScreen.player.radius, this.gameScreen.levelAssets[this.gameScreen.currentRun].finalLine);
        finalLine.alpha = 0;
        finalLine.y = this.gameScreen.floorPos - finalLine.radius * 0.5;
        finalLine.x = config.width + finalLine.radius;

        this.enemies.push(finalLine);
        this.gameScreen.environmentContainer.addChild(finalLine);

        this.gameScreen.escalatorContainer.addChildAt(this.gameScreen.finalLineChar, 0);

        if (this.escalatorNPCContainer) {
            this.escalatorNPCContainer.visible = true;
        }
        else {

            this.currentNPC = Math.floor(Math.random() * 4);
            this.escalatorNPCContainer = new PIXI.Container();
            for (var i = 0; i < 4; i++) {
                this.currentNPC++;
                let npc1 = new PIXI.Sprite.from('npc' + this.currentNPC + '.png');
                this.currentNPC %= 4;
                npc1.scale.set(this.gameScreen.player.radius / 160);
                npc1.anchor.set(0.5, 1);
                npc1.x = 80 * i;
                npc1.y = Math.random() * 10;
                this.escalatorNPCContainer.addChild(npc1);
            }


            this.escalatorNPCContainer.y = this.gameScreen.escalator.y + this.gameScreen.escalator.height * 0.9;
            this.escalatorNPCContainer.x = this.gameScreen.escalator.x - this.gameScreen.escalator.width * 0.5//- (this.gameScreen.escalator.width / this.gameScreen.escalator.scale.x);
            this.gameScreen.escalatorContainer.addChild(this.escalatorNPCContainer);
        }

        //
        setTimeout(() => {
            let timeline = new TimelineLite();
            timeline.add(TweenLite.to(this.gameScreen.finalLineChar, 1.5,
                {
                    ease: Linear.easeNone,
                    x: this.gameScreen.finalLineChar.x + this.gameScreen.escalator.width * 0.2
                }))
            timeline.add(TweenLite.to(this.gameScreen.finalLineChar, 1.5,
                {
                    ease: Linear.easeNone,
                    x: this.gameScreen.finalLineChar.x + this.gameScreen.escalator.width * 0.45,
                    y: this.gameScreen.finalLineChar.y - this.gameScreen.escalator.width * 0.3,
                    onComplete: () => {
                        this.escalatorNPCContainer.visible = false;
                        this.gameScreen.finishEndAnimation();
                    }
                }))
        }, this.gameScreen.finalLineChar.visible ? 1500 : 0);


    }
}