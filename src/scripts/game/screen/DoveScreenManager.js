import * as PIXI from 'pixi.js';
import ScreenManager from '../../screenManager/ScreenManager';
import ParticleSystem from '../effects/ParticleSystem';
import GameScreen from './GameScreen';
import StandardPopUp from './popup/StandardPop';
import StartPopUp from './popup/StartPopUp';
import EndLevelPopUp from './popup/EndLevelPopUp';
import ClearLevelPopUp from './popup/ClearLevelPopUp';
import IntroPopUp from './popup/IntroPopUp';
import SharePopUp from './popup/SharePopUp';
import StartLevelPopUp from './popup/StartLevelPopUp';
import GameOverPopUp from './popup/GameOverPopUp';
import PreSharePopUp from './popup/PreSharePopUp';
import InfoContainer from './InfoContainer';
import PlaymobHelper from './../../PlaymobHelper'

export default class DoveScreenManager extends ScreenManager {
    constructor() {
        super();

        // // screenManager.timeScale = 0;
        // //create screen manager
        // //add screens
        this.infoContainer = new InfoContainer();


        this.gameScreen = new GameScreen('GameScreen');
        this.addScreen(this.gameScreen)
        this.forceChange('GameScreen');

        this.currentLevel = 0;

        this.gameScreen.onGameOver.add((currentLevel, forceEnd, coins = 0) => {
            this.infoContainer.hide()

            PlaymobHelper.trackLevelEvent(PlaymobHelper.levelEvents.LEVEL_OBJECTIVE_FAIL, currentLevel + 1, { quantity: this.gameScreen.enemiesCollided })
            PlaymobHelper.trackLevelEvent(PlaymobHelper.levelEvents.LEVEL_OBJECTIVE_SUCCEED, currentLevel + 1, { quantity: this.gameScreen.enemiesAvoided })
            if (forceEnd) {
                PlaymobHelper.trackLevelEvent(PlaymobHelper.levelEvents.LEVEL_END_SCREEN_SHOWN, currentLevel + 1)
                PlaymobHelper.trackLevelEvent(PlaymobHelper.levelEvents.LEVEL_LOSES_GAME, currentLevel + 1)
                console.log(this.gameScreen.enemiesAvoided);
                console.log(this.gameScreen.enemiesCollided);


                this.showPopUp('gameover',
                    {
                        level: currentLevel
                    })
                // this.showPopUp('end');
                return
            }

            PlaymobHelper.trackLevelEvent(PlaymobHelper.levelEvents.LEVEL_COMPLETED, currentLevel + 1)



            this.currentLevel = currentLevel;
            if (this.currentLevel == 2) {
                PlaymobHelper.track(PlaymobHelper.events.FINAL_SCORE, { quantity: coins });
            }
            window.TOTAL_COINS = coins;
            this.showPopUp('clear',
                {
                    level: this.currentLevel,
                    coins: coins
                })
        })

        this.popUpContainer = new PIXI.Container();
        this.addChild(this.popUpContainer);


        this.popUpList = [];

        this.currentPopUp = null;
        this.prevPopUp = null;


        // playAgain
        // toShare
        this.preshare = new PreSharePopUp('preshare', this);
        this.preshare.toShare.add(() => {
            // this.gameScreen.resetGame();
            // this.gameScreen.startGame();
            this.showPopUp('share')
        });

        this.preshare.playAgain.add(() => {
            // this.gameScreen.resetGame();
            // this.gameScreen.startGame();
            PlaymobHelper.track(PlaymobHelper.events.PLAYER_PLAYS_AGAIN);
            this.showPopUp('init')
        });

        this.popUpList.push(this.preshare);

        this.gameOver = new GameOverPopUp('gameover', this);
        this.gameOver.onContinue.add(() => {
            // this.gameScreen.resetGame();
            // this.gameScreen.startGame();
            this.showPopUp('end')
        });

        this.gameOver.playAgain.add(() => {
            // this.gameScreen.resetGame();
            // this.gameScreen.startGame();
            this.gameScreen.startGame();
            // PlaymobHelper.track(PlaymobHelper.events.PLAYER_PLAYS_AGAIN);
            // this.showPopUp('init')
        });

        // this.gameOver.onHide.add(() => {

        //     // this.gameScreen.resetGame();
        //     // this.showPopUp('end')
        // });

        this.popUpList.push(this.gameOver);

        this.startPopUp = new StartPopUp('init', this);
        this.startPopUp.onHide.add(() => {
            // this.gameScreen.resetGame();
            // this.gameScreen.startGame();
            PlaymobHelper.track(PlaymobHelper.events.LANDING_SCREEN_CLICK);
            this.showPopUp('intro')
            PlaymobHelper.track(PlaymobHelper.events["PRE-GAME_AWARENESS_MESSAGE_SHOWN"])
        });

        this.popUpList.push(this.startPopUp);

        this.endPopUp = new EndLevelPopUp('end', this);
        this.endPopUp.onHide.add(() => {
            this.showPopUp('preshare')
            // this.showPopUp('clear')
        });

        this.popUpList.push(this.endPopUp);

        this.clearPopUp = new ClearLevelPopUp('clear', this);
        this.clearPopUp.onHide.add(() => {

            if (this.currentLevel < 2) {
                this.showPopUp('startlevel',
                    {
                        level: this.currentLevel + 1
                    })
                //this.gameScreen.startGame();
            }
            else {
                this.showPopUp('end')
            }
        });

        this.popUpList.push(this.clearPopUp);


        this.introPopUp = new IntroPopUp('intro', this);
        this.introPopUp.onHide.add(() => {
           

            this.gameScreen.resetGame();
            //PlaymobHelper.trackLevelEvent(PlaymobHelper.levelEvents.LEVEL_AWARENESS_MESSAGE_SHOWN, this.currentLevel+1)
            this.showPopUp('startlevel',
                {
                    level: 0
                })
        });

        this.popUpList.push(this.introPopUp);

        this.startLevelPopUp = new StartLevelPopUp('startlevel', this);
        this.startLevelPopUp.onHide.add(() => {


            this.gameScreen.startGame();
        });

        this.popUpList.push(this.startLevelPopUp);

        this.sharePopUp = new SharePopUp('share', this);
        this.sharePopUp.onHide.add(() => {
            this.showPopUp('init')
        });

        this.popUpList.push(this.sharePopUp);

        this.addChild(this.infoContainer)

        // this.showInfo('test')
        // this.showPopUp('share')
        this.showPopUp('init')

        // this.showPopUp('gameover',
        //     {
        //         level: 2
        //     })
        // this.showPopUp('preshare')
        // this.currentLevel = 3
        // this.showPopUp('clear')
        // this.showPopUp('end')

        this.particleSystem = new ParticleSystem();
        this.addChild(this.particleSystem);
        this.timeScale = 1;

        this.whiteShape = new PIXI.Graphics().beginFill(0xFFFFFF).drawRect(0, 0, config.width, config.height);
        this.addChild(this.whiteShape);
        this.whiteShape.alpha = 0;

    }
    flash(time = 0.25) {
        this.whiteShape.alpha = 1;
        TweenLite.to(this.whiteShape, time,
            {
                alpha: 0
            });
    }
    addParticles(pos, quant = 5, customData = {}) {
        this.particleSystem.show(pos, quant, customData)
    }

    showInfo(text, pos = {
        x: config.width / 2,
        y: config.height
    }, texture, align) {
        this.infoContainer.show(pos, texture, text, align);
    }

    showInfoBlock(text, pos = {
        x: config.width / 2,
        y: config.height
    }, texture, align) {
        // alert('add')
        this.infoContainer.show(pos, texture, text, align, true);
    }

    showPopUp(label, param = null) {

        if (this.currentPopUp) {
            this.prevPopUp = this.currentPopUp;
        }
        for (var i = 0; i < this.popUpList.length; i++) {
            if (this.popUpList[i].label == label) {
                if (this.particleSystem) {
                    this.particleSystem.killAll();
                }
                this.popUpList[i].show(param);
                this.popUpContainer.addChild(this.popUpList[i]);
                this.currentPopUp = this.popUpList[i];
                if (!this.prevPopUp) {
                    this.prevPopUp = this.popUpList[i];
                }
            }
        }
    }
    forceChange(screenLabel, param) {

        super.forceChange(screenLabel, param);
    }
    change(screenLabel, param) {
        super.change(screenLabel, param);

    }
    update(delta) {
        // console.log(delta);
        super.update(delta * this.timeScale);

        this.particleSystem.update(delta);
        if (this.currentPopUp) {
            this.currentPopUp.update(delta * this.timeScale)
        }
        if (this.currentPopUp && this.currentPopUp.toRemove && this.currentPopUp.parent) {
            this.currentPopUp.parent.removeChild(this.currentPopUp);
            this.currentPopUp = null;
        }

        if (this.prevPopUp && this.prevPopUp.toRemove && this.prevPopUp.parent) {
            this.prevPopUp.parent.removeChild(this.prevPopUp);
            this.prevPopUp = null;
        }
    }

    toGame() {
        if (this.currentScreen.label == 'GameScreen') {
            this.currentScreen.resetGame();
            this.particleSystem.killAll();
        }
    }
    toLoad() { }
    toStart() {
        this.showPopUp('init')
    }
    shake(target, force = 0.4, steps = 8, time = 0.5) {
        let timelinePosition = new TimelineLite();
        let positionForce = (force * 50);
        let spliterForce = (force * 20);
        let speed = time / steps;

        let startPosition = {
            x: target.x,
            y: target.y
        }

        for (var i = steps; i >= 0; i--) {
            timelinePosition.append(TweenLite.to(target, speed,
                {
                    x: startPosition.x + Math.random() * positionForce - positionForce / 2,
                    y: startPosition.y + Math.random() * positionForce - positionForce / 2,
                    ease: "easeNoneLinear"
                }));
        };

        timelinePosition.append(TweenLite.to(target, speed,
            {
                x: 0,
                y: 0,
                ease: "easeeaseNoneLinear"
            }));
    }
}