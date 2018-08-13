import * as PIXI from 'pixi.js';
import config from '../../config';
import utils from '../../utils';
import Screen from '../../screenManager/Screen'
import Signals from 'signals';
export default class GameScreen extends Screen {
    constructor(label) {
        super(label);
    }
}