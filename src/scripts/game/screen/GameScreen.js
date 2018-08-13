import * as PIXI from 'pixi.js';
import Screen from '../../screenManager/Screen'
import Signals from 'signals';
import Player from './Player';
import Coin from './Coin';
import Enemy from './Enemy';
import CoinsContainer from './ui/CoinsContainer';
import ConfidenceContainer from './ui/ConfidenceContainer';
import UIList from './ui/UIList';
import SceneManager from './SceneManager';
// import Levels from './Levels';
import PlaymobHelper from './../../PlaymobHelper'
window.ENVIRONMENT_POOL = [];
window.COIN_POOL = [];
window.ENEMY_POOL = [];
window.TRIGGER_POOL = [];
window.ENEMY_COUNTER = 0;
export default class GameScreen extends Screen {
    constructor(label) {
        super(label);

        SOUND_MANAGER.playLoop('dove_music_11025', 0.5)

        this.firstCoinCollected = false;
        this.firstAction = false;

        window.onkeydown = function (evt) {
            console.log(evt);

            if (this.gamePaused) {
                return;
            }
            if (evt.key == 'ArrowUp') {
                this.onJump();
            }
            else if (evt.key == 'ArrowRight' || evt.key == 'ArrowLeft') {
                this[this.levelAssets[this.currentRun].action]()
            }
            // console.log(evt);
            // console.log(this);

        }.bind(this);

        this.gameContainer = new PIXI.Container();
        this.addChild(this.gameContainer);

        this.uiContainer = new PIXI.Container();
        this.addChild(this.uiContainer);

        this.topUIContainer = new UIList();
        this.addChild(this.topUIContainer);

        let size = {
            x: config.width,
            y: topMargin * 0.75,
        }
        size.y = Math.min(size.y, config.width * 0.05)
        this.topUIContainer.w = size.x;
        this.topUIContainer.h = size.y;
        this.logoContainer = new PIXI.Container();
        // this.logoBack = new PIXI.Graphics().beginFill(0xe05102).drawRoundedRect(0, 0, size.x * 0.15, size.x* 0.1, roundRadius)
        // this.logoContainer.addChild(this.logoBack);
        this.logoFront = new PIXI.Sprite.from('logo-self-esteem-squad.png')

        // new PIXI.Graphics().beginFill(0xed823c).drawRoundedRect(0, 0, size.x * 0.15, size.x * 0.1, roundRadius)
        this.logoContainer.addChild(this.logoFront);
        // this.logoFront.y = this.logoFront.height * 0.5 - this.topUIContainer.h * 0.5;
        // this.logoBack.y = this.logoFront.height * 0.5 - this.topUIContainer.h * 0.5 + 5;

        this.logoContainer.listScl = 0.125
        this.logoContainer.fitHeight = 1
        // this.logoContainer.scaleContentMax = 0.7
        this.topUIContainer.addChild(this.logoContainer)

        this.coinsContainer = new CoinsContainer(config.width * 0.2, size.y * 0.8);
        this.coinsContainer.listScl = 0.25
        this.coinsContainer.align = 1
        this.topUIContainer.addChild(this.coinsContainer);

        this.selfContainer = new ConfidenceContainer(config.width * 0.45, size.y * 0.8)
        // this.selfContainer.align = 1
        this.selfContainer.listScl = 0.5
        this.topUIContainer.addChild(this.selfContainer);

        this.muteButtonContainer = new PIXI.Container();
        this.muteButton = new PIXI.Sprite.from('button_mute_on.png') // = new PIXI.Graphics().beginFill(0x3c7fb4).drawCircle(size.y, size.y, size.y)
        this.muteButtonContainer.addChild(this.muteButton)

        this.muteButtonContainer.listScl = 0.125
        this.muteButtonContainer.scaleContentMax = 0.7
        this.muteButtonContainer.fitHeight = 1.3
        this.topUIContainer.addChild(this.muteButtonContainer);

        this.topUIContainer.elementsList.push(this.logoContainer);
        this.topUIContainer.elementsList.push(this.selfContainer);
        this.topUIContainer.elementsList.push(this.coinsContainer);
        this.topUIContainer.elementsList.push(this.muteButtonContainer);

        this.selfContainer.x = config.width / 2 - this.selfContainer.width / 2
        this.coinsContainer.x = this.selfContainer.x + this.selfContainer.width + 20

        this.logoFront.scale.set(topMargin / this.logoFront.height * 1.5)
        this.logoFront.x = 20

        this.doveLogo = new PIXI.Sprite.from('logo-dove.png');
        this.topUIContainer.addChild(this.doveLogo);
        this.doveLogo.x = this.logoFront.x + this.logoFront.width + 5

        this.doveLogo.scale.set(topMargin / this.doveLogo.height)

        this.muteButtonContainer.scale.set(topMargin / this.muteButtonContainer.height * 1)
        this.muteButtonContainer.x = config.width - this.muteButtonContainer.width - 20
        this.muteButtonContainer.interactive = true;
        // this.topUIContainer.elementsList.push(this.infoLabel);
        // this.topUIContainer.debug();
        // this.topUIContainer.updateHorizontalList();

        this.muteButtonContainer.on('mousedown', this.toggleMute.bind(this)).on('touchstart', this.toggleMute.bind(this));

        this.topUIContainer.y = topMargin * 0.35 //- this.uiContainer.h * 0.5
        // this.


        this.background = new PIXI.Graphics().beginFill(0xFFFFFF).drawRect(0, 0, config.width, config.height);
        this.gameContainer.addChild(this.background);

        this.floorContainer = new PIXI.Container();
        this.gameContainer.addChild(this.floorContainer);

        this.environmentContainer = new PIXI.Container();
        this.gameContainer.addChild(this.environmentContainer);

        this.entityContainer = new PIXI.Container();
        this.gameContainer.addChild(this.entityContainer);

        this.sceneManager = new SceneManager(this);

        this.interactive = true;
        this.buttonMode = true;

        this.jumpButton = new PIXI.Graphics().beginFill(0xFF0000).drawRect(0, 0, config.width / 2, config.height);
        this.jumpButton.interactive = true;
        this.jumpButton.buttonMode = true;
        this.jumpButton.on('mousedown', this.onJump.bind(this)).on('touchstart', this.onJump.bind(this));
        // this.jumpButton.on('mousedown', this.onTapDown.bind(this)).on('touchstart', this.onTapDown.bind(this));
        this.uiContainer.addChild(this.jumpButton)
        this.jumpButton.x = config.width / 2 //config.width - this.jumpButton.width;
        this.jumpButton.y = config.height - this.jumpButton.height + topMargin * 2;


        this.jumpButton.alpha = 0;



        this.dashButton = new PIXI.Graphics().beginFill(0xFF0000).drawRect(0, 0, config.width / 2, config.height);
        this.dashButton.interactive = true;
        this.dashButton.buttonMode = true;
        // this.dashButton.on('mousedown', this.onDash.bind(this)).on('touchstart', this.onDash.bind(this));
        this.dashButton.on('mousedown', this.onTapDown.bind(this)).on('touchstart', this.onTapDown.bind(this));
        this.uiContainer.addChild(this.dashButton)
        this.dashButton.x = 0 //- this.dashButton.width;
        this.dashButton.y = config.height - this.dashButton.height + topMargin * 2;

        let actionSprite = window.isMobile ? 'button_action.png' : 'button_jump_keyboard.png'
        this.dashSprite = new PIXI.Sprite.from(actionSprite)
        this.dashSprite.anchor.set(0.5);
        this.uiContainer.addChild(this.dashSprite)

        this.spriteStandardScale = config.height / this.dashSprite.height * 0.2
        this.dashSprite.scale.set(this.spriteStandardScale)
        this.dashSprite.x = this.dashSprite.width * 0.9;
        this.dashSprite.y = config.height - this.dashSprite.height * 0.9;

        let jumpSprite = window.isMobile ? 'button_jump.png' : 'button_action_keyboard.png'
        this.jumpSprite = new PIXI.Sprite.from(jumpSprite)
        this.jumpSprite.anchor.set(0.5);
        this.uiContainer.addChild(this.jumpSprite)
        this.jumpSprite.scale.set(this.spriteStandardScale)
        this.jumpSprite.x = config.width - this.jumpSprite.width * 0.9;
        this.jumpSprite.y = config.height - this.jumpSprite.height * 0.9;
        // this.jumpButton.alpha = 0;
        this.dashButton.alpha = 0;


        this.dashSprite.alpha = 0;
        this.jumpSprite.alpha = 0;


        this.currentShopPos = 0;
        this.currentShopScale = 1;
        this.playerShadow = new PIXI.Graphics().beginFill(0x000000).drawCircle(0, 0, config.height * 0.1)
        this.playerShadow.scale.y = 0.25;
        this.playerShadow.alpha = 0.1;
        this.playerShadow.x = -5500
        this.entityContainer.addChild(this.playerShadow)

        this.player = new Player(config.height * 0.175)
        this.entityContainer.addChild(this.player);
        this.player.x = config.width * 0.2;
        this.player.y = config.height / 2;
        this.floorPos = config.height * 0.75 // - this.player.radius
        this.player.visible = false;

        this.sceneManager.updateEnvironment(0);
        this.margin = topMargin;

        this.middleMask = new PIXI.Graphics().beginFill(0xFF0000).drawCircle(0, 0, config.height - this.margin * 2)
        this.addChild(this.middleMask)
        this.gameContainer.mask = this.middleMask
        this.middleMask.x = config.width / 2;
        this.middleMask.y = config.height / 2 * 1.2;

        this.middleMask.scale.set(3)

        this.onGameOver = new Signals();





        if (config.width < config.height) {

            let temp = config.height

            config.height = config.width
            config.width = temp;

        }


        let levels = []


        let waves = [];

        // alert(config.width+' - '+config.height)



        waves.push(
            {
                items: ['addCoin', 'addCoin', 'addCoin', 'addCoin', 'addCoin'],
                height: [1, 3, 4, 3, 1],
                dist: config.width * 0.12
            })

        let arc = waves.length - 1;

        waves.push(
            {
                items: ['addCoin', 'addCoin', 'addCoin', 'addCoin', 'addCoin', 'addCoin', 'addCoin', 'addCoin', 'addCoin', 'addCoin'],
                height: [1, 2.5, 3.25, 2.5, 1, 1, 2.5, 3.25, 2.5, 1],
                dist: config.width * 0.18
            })

        let doubleArc = waves.length - 1;

        waves.push(
            {
                items: ['addCoin', 'addCoin', 'addCoin', 'addCoin', 'addCoin'],
                height: [0, 0, 0, 0, 0],
                dist: config.width * 0.075
            })

        let first = waves.length - 1;


        waves.push(
            {
                items: ['addCoin', 'addCoin', 'addCoin', 'addCoin', 'addCoin', 'addCoin'],
                height: [1, 1, 1, 1, 1, 1],
                dist: config.width * 0.1
            })

        waves.push(
            {
                items: ['addCoin', 'addCoin', 'addCoin', 'addCoin', 'addCoin'],
                height: [1, 1, 1, 1, 1],
                dist: config.width * 0.15
            })

        waves.push(
            {
                items: ['addTrigger'],
                height: [window.isMobile ? LOCALIZATION.FIRST_TUTORIAL[LANGUAGE] : LOCALIZATION.FIRST_TUTORIAL_DESKTOP[LANGUAGE]],
                dist: config.width * 0.5
            })
        let firstBlock = waves.length - 1;

        waves.push(
            {
                items: ['addTrigger'],
                height: [LOCALIZATION.SEC_TUTORIAL[LANGUAGE]],
                dist: config.width * 0.5
            })
        let firstCoins = waves.length - 1;

        waves.push(
            {
                items: ['addTrigger', 'addEnemy'],
                height: [LOCALIZATION.LEVEL_1_ENEMY[LANGUAGE], 0],
                dist: config.width * 0.5
            })
        let firstSisters = waves.length - 1;

        waves.push(
            {
                items: ['addTrigger'],
                height: [LOCALIZATION.LEVEL_1_ENEMY_AFTER[LANGUAGE]],
                dist: config.width * 0.5
            })
        let afterSisters = waves.length - 1;

        waves.push(
            {
                items: ['addTrigger', 'addEnemy'],
                height: [LOCALIZATION.LEVEL_2_ENEMY[LANGUAGE], 0],
                dist: config.width * 0.5
            })
        let firstSelfie = waves.length - 1;

        waves.push(
            {
                items: ['addTrigger'],
                height: [LOCALIZATION.LEVEL_2_ENEMY_AFTER[LANGUAGE]],
                dist: config.width * 0.5
            })
        let afterSelfie = waves.length - 1;

        waves.push(
            {
                items: ['addTrigger', 'addEnemy'],
                height: [LOCALIZATION.LEVEL_3_ENEMY[LANGUAGE], 0],
                dist: config.width * 0.5
            })
        let firstPlanks = waves.length - 1;

        waves.push(
            {
                items: ['addTrigger'],
                height: [LOCALIZATION.LEVEL_3_ENEMY_AFTER[LANGUAGE]],
                dist: config.width * 0.5
            })
        let afterPlanks = waves.length - 1;




        waves.push(
            {
                items: ['addEnemy'],
                height: [0],
                dist: config.width * 0.075
            })

        waves.push(
            {
                items: ['addFinalLine'],
                height: [0],
                dist: config.width * 0.075
            })





        let enemy = waves.length - 2;
        let last = waves.length - 1;



        levels = [
            // [firstSisters, afterSisters, 2, 1, enemy, 0, 1, enemy, 2, 1, enemy, 0, last],

            [firstBlock, arc, arc, firstCoins, 2, firstSisters, 0, afterSisters, 3, 2, enemy, 0, 2, enemy, arc, 2, enemy, 0, last],

            // [0, 2, firstSisters, 3, 2, enemy, 0, 2, enemy, 3, 2, enemy, 0, last],
            // [last, 2, enemy, 3, 2, enemy, 0, 2, enemy, 3, 2, enemy, 0, last],
            [0, first, 4, firstSelfie, afterSelfie, 4, arc, enemy, 2, enemy, arc, 3, 2, enemy, arc, 3, 2, last],
            [0, arc, first, 4, firstPlanks, afterPlanks, arc, enemy, 2, enemy, arc, 3, 2, enemy, 3, 2, arc, last],
            // [first, 3, firstPlanks, afterPlanks, 3, enemy, 1, enemy, 2, 1, enemy, 2, 1, last],
        ];











        this.levels = levels
        this.waves = waves

        this.currentWaveData = {
            id: 0,
            currentItem: 0,
            currentTime: 0,
        };

        this.levelAssets = [
            {
                char: 'dami',
                enemy: 'obstacle_03a.png',
                enemyStatic: true,
                enemyScale: 1.1,
                finalLine: 'home_character_03.png',
                action: 'onSlide',
                // action: 'onAirDash',
                hit: LOCALIZATION.LEVEL_1_HIT[LANGUAGE],
                endImageSide: -1,
                side: 1
            },
            // this.levelAssets = [
            // {
            //     char: 'skinnyguy',
            //     enemy: 'obstacle_03a.png',
            //     enemyScale: 1,
            //     finalLine: 'gingerstatic.png',
            //     action: 'onSlide',
            //     hit: ' Watch out! Unrealistic body imagery can appear\nin many walks of life.',
            //     endImageSide: 1,
            //     side: 1
            // },
            {
                // char: 'may',
                char: 'may',
                enemy: 'obstacle_02.png',
                enemyStatic: false,
                enemyScale: 0.5,
                finalLine: 'home_character_01.png',
                action: 'onDash',
                hit: LOCALIZATION.LEVEL_2_HIT[LANGUAGE],
                endImageSide: 1,
                side: -1
            },
            {
                char: 'rosie',
                enemy: 'obstacle_01.png',
                enemyStatic: true,
                enemyScale: 1,
                finalLine: 'home_character_02.png',
                action: 'onSlide',
                hit: LOCALIZATION.LEVEL_3_HIT[LANGUAGE],
                endImageSide: 1,
                side: 1
            }
        ]
        this.currentRun = 0;
        this.currentLevelStep = 0;
        this.player.updateAnimations(this.levelAssets[0].char)

        this.topUIContainer.alpha = 0;

        this.npcConainer = new PIXI.Container();
        this.environmentContainer.addChild(this.npcConainer)

        this.npc1 = new PIXI.Sprite.from('shadow_01.png');
        this.npc1.scale.set(this.player.radius / 160) //this.npc1.width)
        this.npc1.anchor.set(0.5, 1)

        this.npc2 = new PIXI.Sprite.from('shadow_02.png');
        this.npc2.scale.set(this.player.radius / 160) //this.npc2.width)
        this.npc2.anchor.set(0.5, 1)
        this.npc2.x = this.npc2.width

        this.npc3 = new PIXI.Sprite.from('shadow_03.png');
        this.npc3.scale.set(this.player.radius / 160) //this.npc3.width)
        this.npc3.anchor.set(0.5, 1)
        this.npc3.x = this.npc3.width * 2


        this.npcConainer.addChild(this.npc1)
        this.npcConainer.addChild(this.npc2)
        this.npcConainer.addChild(this.npc3)

        this.npcConainer.x = config.width + 200;
        this.npcConainer.y = this.floorPos - 10;
        this.currentNPC = 0;

        this.escalator = new PIXI.Sprite.from('escalator.png');
        this.escalator.anchor.set(0.8, 0.1)
        // this.escalator.y = this.currentShopPos
        this.escalator.scale.set(this.currentShopScale * 1.2)

        this.escalatorContainer = new PIXI.Container();
        this.escalatorContainer.addChild(this.escalator);
        this.gameContainer.addChild(this.escalatorContainer);

        this.sceneManager.updateFloor(0);
        this.addBeginEscalator();


        this.playButton = new PIXI.Sprite.from('button_play.png');
        this.playButton.on('mousedown', this.playDown.bind(this)).on('touchstart', this.playDown.bind(this));
        this.playButton.interactive = true;
        this.playButton.anchor.set(0.5);
        this.playButton.visible = false;
        // this.uiContainer.addChild(this.playButton)

        this.lastEnemyCollided = 0//null;
    }
    hitEnemy(enemy) {
        if ((enemy)) {
            console.log('ENEMY', this.lastEnemyCollided, enemy.id);

            if (this.lastEnemyCollided == enemy.id) {
                return;
            }
        }
        // getCoins
        if (enemy && this.lastEnemyCollided != enemy.id) {

            this.shakeScale();
            this.collectCoins(10);
            // this.getCoins(this.player);
            // this.getCoins(this.player);
            // this.getCoins(this.player);
            // this.getCoins(this.player);
            for (let index = 0; index < 5; index++) {
                setTimeout(() => {
                    SOUND_MANAGER.play('coin')
                }, 100 * index);
            }
            let gb = this.player.getGlobalPosition()
            gb.y -= config.height * 0.25;
            this.screenManager.addParticles(gb, 10,
                {
                    texture: 'pickup.png',
                    alphaDecress: 0,
                    gravity: config.height * 2,
                    forceX: config.width * 0.5,
                    forceY: config.height * 1,
                    targetingSpeed: config.height * 2.8,
                    target:
                    {
                        timer: 0.45,
                        // x: this.selfContainer.x + this.selfContainer.grad.x + this.selfContainer.grad.width / 2,
                        x: this.coinsContainer.x + this.coinsContainer.coin.x + this.coinsContainer.coin.width / 2,
                        // y: this.selfContainer.y + this.selfContainer.grad.y
                        y: this.coinsContainer.y + this.coinsContainer.coin.y + this.coinsContainer.coin.height / 2
                    },
                    scale: 0.075
                });

            SOUND_MANAGER.play('coin')
            this.lastEnemyCollided = enemy.id;
            this.enemiesAvoided++;

        }
        if (this.currentRun <= 2) {
            this.enemiesAvoided = Math.min(this.enemiesAvoided, 4);
        }
    }
    avoidEnemy(enemy) {
        console.log('ENEMMMM');


        //GET NEW COINS AQUI
        // setTimeout(() => {
        //     this.lastEnemyCollided = false;
        // }, 1000);
        this.enemiesAvoided++;

        if (this.currentRun <= 2) {
            this.enemiesAvoided = Math.min(this.enemiesAvoided, 4);
        }
    }
    toggleMute() {
        SOUND_MANAGER.toggleMute()
        if (SOUND_MANAGER.isMute) {
            this.muteButton.texture = PIXI.Texture.from('button_mute_off.png')
        }
        else {
            this.muteButton.texture = PIXI.Texture.from('button_mute_on.png')
        }
    }
    addEndEscalator() {
        this.escalatorContainer.x = config.width + this.escalator.width
        this.escalatorContainer.y = this.currentShopPos - (this.escalator.height) + (this.escalator.height * this.escalator.anchor.y) + 40
        this.escalatorContainer.parent.removeChild(this.escalatorContainer);
        this.environmentContainer.addChild(this.escalatorContainer);

        if (this.currentRun >= 2) {
            this.escalator.alpha = 0;
            if (this.finalLineChar) {
                this.finalLineChar.visible = false;
            }
        }
        else {
            this.escalator.alpha = 1;
            if (this.finalLineChar) {
                this.finalLineChar.visible = true;
            }
        }

        // console.log(this.finalLineChar);
        // console.log(this.finalLineChar);
        // console.log(this.finalLineChar);
        // console.log(this.finalLineChar);
        // console.log(this.finalLineChar);
        // console.log(this.finalLineChar);
    }
    addBeginEscalator() {
        this.escalatorContainer.x = 0
        this.escalatorContainer.y = this.currentShopPos
        this.escalatorContainer.parent.removeChild(this.escalatorContainer);
        this.gameContainer.addChild(this.escalatorContainer);
    }
    onAdded() {
        this.screenManager.infoContainer.onHide.add(() => {
            if (this.gameStarted) {

                this.gamePaused = false;
                // this.onTapDown();
            }
        })
    }

    resetGame() {
        this.player.x = -this.player.width;
        this.currentCoins = 0;
        this.currentLevel = 0;
        this.currentRun = 0;
        this.enemiesAvoided = 0;
        this.enemiesCollided = 0;
        this.totalSecGameplay = 0;
        this.currentSecGameplay = 0;
        this.currentLevelStep = 0;
        this.currentLevelCoins = 0;
        this.confidencePoints = 3;
        this.selfContainer.updateBar(this.confidencePoints, true);
        this.coinsContainer.updateCoins(this.currentCoins);
        this.maxCoins = 10;
        this.hurts = 0;
        this.firstTrigger = false;
        this.updateLevelSide();

        this.cameraSin = 0;

        // this.playButton.scale.set(config.height / this.playButton.height / this.playButton.scale.y * 0.2);
        // this.playButton.visible = true;
        // this.playButton.x = config.width / 2;
        // this.playButton.y = config.height / 2 + topMargin;
        // TweenLite.from(this.playButton.scale, 0.25,
        // {
        //     // delay: 1,
        //     x: 0,
        //     y: 0,
        //     ease: Back.easeOut,
        // })
    }
    updateLevelSide() {
        if (this.levelAssets[this.currentRun].side == -1) {
            this.gameContainer.scale.x = -1;
            this.gameContainer.x = config.width;
            if (!isMobile) {
                let actionSprite = window.isMobile ? 'button_action.png' : 'button_action_keyboard.png'
                this.dashSprite.texture = PIXI.Texture.from(actionSprite)

                let jumpSprite = window.isMobile ? 'button_jump.png' : 'button_jump_keyboard.png'
                this.jumpSprite.texture = PIXI.Texture.from(jumpSprite)
            }
        }
        else {
            this.gameContainer.scale.x = 1;
            this.gameContainer.x = 0;
            if (!isMobile) {
                let actionSprite = window.isMobile ? 'button_action.png' : 'button_action_keyboard.png'
                this.dashSprite.texture = PIXI.Texture.from(actionSprite)

                let jumpSprite = window.isMobile ? 'button_jump.png' : 'button_jump_keyboard.png'
                this.jumpSprite.texture = PIXI.Texture.from(jumpSprite)
            }
        }
    }
    startGame(char = 0) {
        // this.gameStarted = true;
        this.enemiesAvoided = 0;
        this.enemiesCollided = 0;
        this.resetVelocity();
        this.coinTimer = 1;
        this.firstTrigger = false;
        this.currentLevelCoins = 0;
        this.currentSecGameplay = 0;
        this.playerStartPos = config.width * 0.15;
        this.player.x = -this.player.width;
        this.player.floorCollide(this.floorPos);
        this.player.visible = true;
        this.hurts = 0;
        this.player.fullEffect.visible = false;

        if (this.levelAssets[this.currentRun].action == 'onJump') {
            this.dashSprite.visible = false;
        }
        else {
            this.dashSprite.visible = true;
        }

        TweenLite.to(this.dashSprite, 0.5,
            {
                alpha: 1
            })
        TweenLite.to(this.jumpSprite, 0.5,
            {
                alpha: 1
            })


        this.dashSprite.scale.set(this.levelAssets[this.currentRun].side * this.spriteStandardScale, this.spriteStandardScale)


        this.player.updateAnimations(this.levelAssets[this.currentRun].char)

        this.currentLevelStep = 0;

        this.middleMask.scale.set(1.5)

        this.updateLevelSide();

        if (this.currentRun == 0) {

        } else {
            PlaymobHelper.trackLevelEvent(PlaymobHelper.levelEvents.LEVEL_STARTED, this.currentRun + 1);
        }

        // this.currentCoins = 0;
        // this.maxCoins = 32;
        this.gameFinished = false;

        this.confidencePoints = 3;
        this.selfContainer.updateBar(this.confidencePoints, true);

        this.currentLevel = 0;


        TweenLite.to(this.topUIContainer, 0.5,
            {
                alpha: 1
            })
        TweenLite.to(this.middleMask.scale, 0.75,
            {
                // delay: 1,
                x: maskScale.x,
                y: maskScale.y * 1.1,
                ease: Back.easeOut,
                onComplete: () => {

                }
            })


        if (this.currentRun > 0) {
            this.movePlayer = true;
            this.gamePaused = false;
        }
        else {
            this.playDown()
            // this.playButton.scale.set(config.height / this.playButton.height * this.playButton.scale.y * 0.2);
            // this.playButton.visible = true;
            // this.playButton.x = config.width / 2;
            // this.playButton.y = config.height / 2 + topMargin;
            // TweenLite.from(this.playButton.scale, 0.25,
            //     {
            //         // delay: 1,
            //         x: 0,
            //         y: 0,
            //         ease: Back.easeOut,
            //     })
        }
        this.addBeginEscalator();
    }

    playDown() {
        PlaymobHelper.track(PlaymobHelper.events.HITS_THE_PLAY_BUTTON_TO_START_GAME);
        SOUND_MANAGER.play('whoosh');
        this.movePlayer = true;
        this.gamePaused = false;
        return
        TweenLite.to(this.playButton, 0.5,
            {
                // delay: 1,
                // x: 0,
                y: config.height * 1.2,
                ease: Back.easeIn,
                onComplete: () => {
                    this.movePlayer = true;
                    this.gamePaused = false;
                }
            })
    }

    updateShadow() {
        this.playerShadow.x = this.player.x;
        this.playerShadow.y = this.floorPos;

        let shadowScale = 2 - (this.player.y / (config.height - (config.height - this.floorPos)));

        this.playerShadow.alpha = 0.65 - shadowScale * 0.5
        this.playerShadow.scale.set(shadowScale, shadowScale * 0.25)
    }
    update(delta) {
        if (this.gamePaused) {
            return;
        }



        // return
        if (this.gameFinished) {
            // this.destroyAllItems();
            // this.gameStarted = false;
            this.player.update(delta);
            this.player.x += this.player.velocity.x * delta;
            if (this.player.x >= config.width + this.player.width) {
                this.gamePaused = true;
                this.gameOver();
            }
            if (this.player.y > this.floorPos) {
                this.player.floorCollide(this.floorPos);
                this.cameraVirtualVelocity.y = -config.height * 0.25;
            }
            this.updateShadow();

            return
        }

        if (this.movePlayer) {
            this.player.update(delta);
            this.player.x += this.player.velocity.x * delta;
            if (this.player.x >= this.playerStartPos) {
                this.player.x = this.playerStartPos;
                this.gameStarted = true;
                this.movePlayer = false;
                // this.player.velocity.x *= 0.5
            }
            this.updateShadow();
        }

        if (!this.gameStarted) {
            return
        }

        this.selfContainer.update(delta);
        if (this.player.velocity.x > 0 && !this.gameFinished) {

            this.coinTimer -= delta;
            if (this.coinTimer <= 0) {
                // this.currentWaveData.id = Math.floor(Math.random() * this.waves.length)
                let levels = this.levels[this.currentRun];
                if (this.currentLevelStep >= levels.length) {
                    this.coinTimer = 99999;
                }
                else {
                    this.currentWaveData.id = levels[this.currentLevelStep];
                    this.currentLevelStep++;
                    let waveData = this.waves[this.currentWaveData.id];
                    this.currentWaveData.currentTime += delta;
                    for (var i = 0; i < waveData.items.length; i++) {
                        this.sceneManager[waveData.items[i]](waveData.dist * i, waveData.height[i])
                    }
                    this.coinTimer = 1.5;
                }
            }
        }
        if (!this.gameFinished) {
            this.player.update(delta);

            this.totalSecGameplay += delta;
            this.currentSecGameplay += delta;
        }
        if (!this.movePlayer && !this.gameFinished) {

            this.updateShadow();
            this.sceneManager.updateEnvironment(delta);
            this.sceneManager.updateFloor(delta);
            this.sceneManager.updateCoins(delta);
            this.sceneManager.updateTriggers(delta);
            this.sceneManager.updateEnemies(delta);
        }

        if (this.player.y > this.floorPos) {
            this.player.floorCollide(this.floorPos);
            this.cameraVirtualVelocity.y = -config.height * 0.25;
        }

        // this.cameraVelocity.y -= delta * 200;
        this.udpateVelocity();

        this.gameContainer.y += this.cameraVelocity.y * delta; // + Math.sin(this.cameraSin);



        this.gameContainer.x += this.cameraVelocity.x * delta;

        this.cameraSin += delta * 10;


        if (this.gameContainer.y < 0) {
            this.gameContainer.y = 0;
        }

        if (this.gameContainer.x >= 0) {
            // console.log(this.gameContainer.x);
            if (this.gameContainer.scale.x == 1) {

                this.gameContainer.x = 0;
            }
            else {

                this.gameContainer.x = config.width //0;
            }
        }
        else {
            this.cameraVirtualVelocity.x = config.height * 0.1
        }
    }
    transitionIn() {
        super.transitionIn();
        this.addEvents();
    }
    transitionOut(nextScreen) {
        this.removeEvents();
        this.nextScreen = nextScreen;
        setTimeout(function () {
            this.endTransitionOut();
        }.bind(this), 0);
    }
    destroy() {

    }
    popTrigger(trigger) {
        if (trigger.block) {
            this.gamePaused = true;
            this.screenManager.showInfoBlock(trigger.message)

            this.firstTrigger = true;
            //                PlaymobHelper.trackLevelEvent(PlaymobHelper.levelEvents["LEVEL_MID-GAME_AWARENESS_MESSAGE_SHOWN"], this.currentRun + 1)
            PlaymobHelper.track(PlaymobHelper.events["LEVEL_" + (this.currentRun + 1) + "_MID-GAME_AWARENESS_MESSAGE_SHOWN"])

        }
        else {
            if (!this.firstTrigger) {
                this.firstTrigger = true;
                //                PlaymobHelper.trackLevelEvent(PlaymobHelper.levelEvents["LEVEL_MID-GAME_AWARENESS_MESSAGE_SHOWN"], this.currentRun + 1)
                PlaymobHelper.track(PlaymobHelper.events["LEVEL_" + (this.currentRun + 1) + "_MID-GAME_AWARENESS_MESSAGE_SHOWN"])
            }
            this.screenManager.showInfo(trigger.message)
        }
    }
    shakeScale() {
        TweenLite.killTweensOf(this.gameContainer.scale);
        TweenLite.killTweensOf(this.gameContainer);
        this.currentScaleX = this.gameContainer.scale.x < 0 ? -1 : 1;

        // this.gameContainer.scale.x = this.levelAssets[this.currentRun].side * 1.5;
        this.gameContainer.scale.y *= 1.2;


        console.log(this.levelAssets[this.currentRun].side, this.gameContainer.scale.x);

        this.gameContainer.rotation = (Math.random() - 0.5) * 0.25;
        TweenLite.to(this.gameContainer, 0.5,
            {
                rotation: 0,
                ease: Elastic.easeOut
            })
        TweenLite.to(this.gameContainer.scale, 0.5,
            {
                x: this.currentScaleX,
                y: 1,
                ease: Elastic.easeOut
            })
    }
    getHurt() {

        SOUND_MANAGER.play('impact')
        this.coinTimer += 1.5;
        this.screenManager.shake(this.gameContainer, 0.5, 4);

        TweenLite.killTweensOf(this.gameContainer);
        this.gameContainer.rotation = Math.random() - 0.5;
        TweenLite.to(this.gameContainer, 0.5,
            {
                rotation: 0,
                ease: Elastic.easeOut
            })
        // this.shakeScale();
        this.player.fullEffect.visible = false;
        this.enemiesCollided++;
        this.screenManager.flash()
        this.player.getHurt();
        this.hurts++;
        this.confidencePoints--;
        this.confidencePoints = Math.max(this.confidencePoints, 0)
        this.selfContainer.updateBar(this.confidencePoints);


        if (this.currentRun == 0 && !this.playerDeadOnce) {
            this.playerDeadOnce = true;
            this.firstActionAfterDead = false;
        }


        if (this.confidencePoints <= 0) {
            this.destroyAllItems();
            this.topUIContainer.alpha = 0;

            this.coinsContainer.updateCoins(this.currentCoins);
            // return



            SOUND_MANAGER.play('gameover')

            this.player.x = -this.player.width;
            this.updateShadow();

            this.onGameOver.dispatch(this.currentRun, true, this.currentCoins);

            this.currentCoins -= this.currentLevelCoins;

            this.coinsContainer.updateCoins(this.currentCoins);

            // PlaymobHelper.trackLevelEvent(PlaymobHelper.levelEvents.LEVEL_COINS_COLLECTED, this.currentLevel + 1, { quantity: this.currentLevelCoins })

            this.gamePaused = true;
        }

        if (this.hurts >= 1) {
            this.hurts = -90;
            // this.gamePaused = true;
            this.screenManager.showInfo(this.levelAssets[this.currentRun].hit);
        }
    }
    getCoins(coin, skipAnimation = false) {

        if (!skipAnimation) {
            this.screenManager.addParticles(coin.getGlobalPosition(), 3,
                {
                    texture: 'pickup.png',
                    alphaDecress: 0,
                    gravity: config.height,
                    forceX: config.width * 0.2,
                    forceY: config.height * 0.2,
                    targetingSpeed: config.height * 2.8,
                    target:
                    {
                        timer: 0.15,
                        // x: this.selfContainer.x + this.selfContainer.grad.x + this.selfContainer.grad.width / 2,
                        x: this.coinsContainer.x + this.coinsContainer.coin.x + this.coinsContainer.coin.width / 2,
                        // y: this.selfContainer.y + this.selfContainer.grad.y
                        y: this.coinsContainer.y + this.coinsContainer.coin.y + this.coinsContainer.coin.height / 2
                    },
                    scale: 0.05
                });

            SOUND_MANAGER.play('coin')
        }

        this.collectCoins();
    }
    collectCoins(tot = 1) {
        this.confidencePoints += 0.025 * tot;
        this.confidencePoints = Math.min(this.confidencePoints, 4)
        if (this.confidencePoints >= 4) {
            this.player.fullEffect.visible = true;
        } else {
            this.player.fullEffect.visible = false;

        }
        this.selfContainer.updateBar(this.confidencePoints, true);

        this.currentCoins += tot;
        this.currentLevelCoins += tot;

        this.selfContainer.glow();

        this.coinsContainer.updateCoins(this.currentCoins);
        if (!this.firstCoinCollected) {
            this.firstCoinCollected = true;
            PlaymobHelper.track(PlaymobHelper.events.FIRST_CONFIDENCE_COIN_COLLECTED);
        }
    }
    destroyAllItems(justCoins = false) {
        if (!justCoins) {
            for (var i = this.sceneManager.enemies.length - 1; i >= 0; i--) {
                let tempCoin = this.sceneManager.enemies[i];
                tempCoin.parent.removeChild(tempCoin);
                if (tempCoin.isEnemy) {
                    ENEMY_POOL.push(tempCoin);
                }
                this.sceneManager.enemies.splice(i, 1);

            }
        }
        for (var i = this.sceneManager.coins.length - 1; i >= 0; i--) {
            let tempCoin = this.sceneManager.coins[i];
            // console.log(tempCoin);
            // this.getCoins(tempCoin);
            tempCoin.parent.removeChild(tempCoin);
            COIN_POOL.push(tempCoin);
            this.sceneManager.coins.splice(i, 1);

        }

        for (var i = this.sceneManager.triggers.length - 1; i >= 0; i--) {
            let tempTrigger = this.sceneManager.triggers[i];
            console.log(tempTrigger);
            // this.getCoins(tempTrigger);
            tempTrigger.parent.removeChild(tempTrigger);
            TRIGGER_POOL.push(tempTrigger);
            this.sceneManager.triggers.splice(i, 1);

        }
    }
    finishEndAnimation() {

        this.destroyAllItems();
        this.topUIContainer.alpha = 0;

        this.coinsContainer.updateCoins(this.currentCoins);
        // return

        this.onGameOver.dispatch(this.currentRun, false, this.currentCoins);
        this.gamePaused = true;

        PlaymobHelper.trackLevelEvent(PlaymobHelper.levelEvents.LEVEL_COINS_COLLECTED, (this.currentRun + 1), { quantity: this.currentLevelCoins })
        PlaymobHelper.trackLevelEvent(PlaymobHelper.levelEvents.LEVEL_SECONDS_OF_GAMEPLAY, (this.currentRun + 1), { quantity: Math.ceil(this.currentSecGameplay) })

        if (this.currentRun >= 2) {
            PlaymobHelper.track(PlaymobHelper.events.FINAL_SECONDS_OF_GAMEPLAY, { quantity: Math.ceil(this.totalSecGameplay) })
        }

        this.currentRun++;
    }
    gameOver() {
        // this.startGame();
        this.destroyAllItems(true);
        // return
       



        return
        TweenLite.to(this.finalLineChar, 2,
            {
                ease: Linear.easeNone,
                x: this.finalLineChar.x + 125,
                y: this.finalLineChar.y - 100,
                onComplete: () => {
                    this.finishEndAnimation();
                }
            })
        // return



    }
    endGame() {
        this.gameFinished = true;

        this.dashSprite.alpha = 0;
        this.jumpSprite.alpha = 0;

        this.playerShadow.x = 9999


        SOUND_MANAGER.play('end_level_cheering', 0.5)

        // alert('END GAME')
        // this.selfContainer.updateBar(4);
    }
    onSlide() {
        if (this.gameFinished || !this.gameStarted) {
            return;
        }
        if (this.player.dash(true)) {
            if (!this.firstAction) {
                this.firstAction = true;
                PlaymobHelper.track(PlaymobHelper.events.FIRST_ACTION_BUTTON_USAGE);
            }
            SOUND_MANAGER.play('whoosh')
            this.cameraVelocity.x = -config.height * 0.75 * 1.1;
            this.screenManager.flash();
            this.shakeScale();
        }
    }
    onDash() {
        if (this.gameFinished || !this.gameStarted) {
            return;
        }
        if (this.player.dash()) {
            if (!this.firstAction) {
                this.firstAction = true;
                PlaymobHelper.track(PlaymobHelper.events.FIRST_ACTION_BUTTON_USAGE);
            }
            if (this.playerDeadOnce && !this.firstActionAfterDead) {
                PlaymobHelper.track(PlaymobHelper.events.FIRST_ACTION_BUTTON_USAGE_AFTER_LEVEL_1_FAILURE);
                this.firstActionAfterDead = true;
            }


            this.dashSprite.scale.set(0.5, 1.2)
            TweenLite.to(this.dashSprite.scale, 0.5,
                {
                    x: this.spriteStandardScale * this.levelAssets[this.currentRun].side,
                    y: this.spriteStandardScale,
                    ease: Elastic.easeOut
                })
            SOUND_MANAGER.play('whoosh')
            this.cameraVelocity.x = -config.height * 0.75 * 1.1;
            this.screenManager.flash();
            this.shakeScale();
        }
    }
    onJump() {
        if (this.gameFinished || !this.gameStarted) {
            return;
        }
        if (this.player.jump()) {
            if (!this.firstAction) {
                this.firstAction = true;
                PlaymobHelper.track(PlaymobHelper.events.FIRST_ACTION_BUTTON_USAGE);
            }
            if (this.playerDeadOnce && !this.firstActionAfterDead) {
                PlaymobHelper.track(PlaymobHelper.events.FIRST_ACTION_BUTTON_USAGE_AFTER_LEVEL_1_FAILURE);
                this.firstActionAfterDead = true;
            }
            this.jumpSprite.scale.set(0.5, 1.2)
            TweenLite.to(this.jumpSprite.scale, 0.5,
                {
                    x: this.spriteStandardScale,
                    y: this.spriteStandardScale,
                    ease: Elastic.easeOut
                })

            SOUND_MANAGER.play('whoosh')
            this.cameraVirtualVelocity.y = config.height * 0.1;
            this.cameraVelocity.y = config.height * 0.2;

            // this.cameraVelocity.x = -config.height * 0.75 * 1.1;
            // this.screenManager.flash();
            // this.shakeScale();

        }
    }
    onTapDown() {
        if (!this.gamePaused && !this.gameFinished) {
            this[this.levelAssets[this.currentRun].action]()
        }
    }
    removeEvents() {

    }
    addEvents() {

    }



    udpateVelocity() {
        let axis = ['x', 'y']
        for (var i = 0; i < axis.length; i++) {
            if (this.cameraVelocity[axis[i]] < this.cameraVirtualVelocity[axis[i]]) {
                this.cameraVelocity[axis[i]] += this.cameraAcceleration[axis[i]];
                if (this.cameraVelocity[axis[i]] > this.cameraVirtualVelocity[axis[i]]) {
                    this.cameraVelocity[axis[i]] = this.cameraVirtualVelocity[axis[i]];
                }
            }
            else if (this.cameraVelocity[axis[i]] > this.cameraVirtualVelocity[axis[i]]) {
                this.cameraVelocity[axis[i]] -= this.cameraAcceleration[axis[i]];
                if (this.cameraVelocity[axis[i]] < this.cameraVirtualVelocity[axis[i]]) {
                    this.cameraVelocity[axis[i]] = this.cameraVirtualVelocity[axis[i]];
                }
            }
        }

    }
    resetVelocity() {
        this.cameraVelocity = {
            x: 0,
            y: 0
        }
        this.cameraVirtualVelocity = {
            x: 0,
            y: 0
        }
        this.cameraAcceleration = {
            x: config.width * 0.075,
            y: config.height * 0.525
        }
    }
}