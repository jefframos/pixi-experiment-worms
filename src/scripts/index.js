import config from './config';
import * as PIXI from 'pixi.js';
import manifest from './manifest.json';
import utils from './utils';
import WarmsContainer from './WormsContainer'
import TweenLite from 'gsap';


window.iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
window.isMobile = navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i)//true;
//window.isAdd = navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i)

window.TweenLite = TweenLite;

window.console.warn = function () { }
window.console.groupCollapsed = function (teste) { }



window.desktopResolution = {
    width: 1027,
    height: 768
}
// if (!window.isIronSource) {
//     if (!window.isMobile) {
        config.width = desktopResolution.width
        config.height = desktopResolution.height
//     }
//     window.addEventListener("focus", unPause, true);
//     window.addEventListener("blur", pause, true);
    window.addEventListener("resize", () => onresize());
// }

window.config = config;
window.utils = utils;

var loader = new PIXI.loaders.Loader();
let tempManifest = manifest.default.map(
    a => a.replace(/\\/g, '/')
);
tempManifest = tempManifest.map(
    a => a.replace(/dist\//g, '')
);

let audioManifest = manifest.audio.map(
    a => a.replace(/\\/g, '/')
);
audioManifest = audioManifest.map(
    a => a.replace(/dist\//g, '')
);
for (var i = 0; i < audioManifest.length; i++) {
    audioManifest[i] = audioManifest[i].replace(/\\/, "/")
    let url = audioManifest[i].substr(0, audioManifest[i].length - 4);
    url += '.mp3'
    PIXI.loader.add(audioManifest[i], url)
}
// if (window.isIronSource || isMobile) {
//     tempManifest = tempManifest.map(
//         a => a.replace(/.json/g, '_mip.json')
//     );
// }

// matt's hack
// audioManifest = audioManifest.map( a => 'assets/' + a );
// tempManifest = tempManifest.map( a => 'assets/' + a );

// ironsource absolute paths:
// if (window.manifestPath) {
//     console.log('need to add absolute path : ' + window.manifestPath);
//     audioManifest = audioManifest.map(a => window.manifestPath + a);
//     tempManifest = tempManifest.map(a => window.manifestPath + a);
//     window.ASSET_URL = window.manifestPath;
// }
// else {
//     window.ASSET_URL = '';
// }
//
console.log(tempManifest);

loader.add(tempManifest);

loadGame();

function loadGame() {
    window.loaded = false;
    loader.load(gameLoaded);
}

window.gameBuilded = false;
function gameLoaded() {
    window.loaded = true;
    createGame();
    onresize();
}



function createGame() {

    if (!window.app) {
        window.app = new PIXI.Application(config.width, config.height,
            {
                resolution: Math.min(window.devicePixelRatio, 2),
                autoResize: true,
                backgroundColor: 0xFFFFFF
            });
    }
    window.tickerAdded = true;
    app.ticker.add((evt) => {
        if (!window.gameBuilded && window.loaded) {
            const stage = new PIXI.Container();
            app.stage.addChild(stage);
            document.body.appendChild(app.renderer.view);
            document.body.style.margin = 0;
            onresize();
            window.gameBuilded = true;
            window.screenManager = new WarmsContainer();
            stage.addChild(screenManager);
        }
        if (window.screenManager) {
            window.screenManager.update(evt / 60)
        }

    });

}



window.onresize = function () {
    let scl = window.innerWidth < desktopResolution.width ? window.innerWidth / desktopResolution.width : 1// config.width
    window.app.renderer.view.style.position = 'absolute'

    let newSize = {
        width: desktopResolution.width * scl,
        height: desktopResolution.height * scl
    }
    window.app.renderer.view.style.width = newSize.width + 'px'
    window.app.renderer.view.style.height = newSize.height + 'px'

    if (newSize.height < window.innerHeight) {
        window.app.renderer.view.style.top = window.innerHeight / 2 - (newSize.height) / 2 + 'px'
    }
    if (newSize.width < window.innerWidth) {
        window.app.renderer.view.style.left = window.innerWidth / 2 - (newSize.width) / 2 + 'px'
    }


};


// let InteractionManager = PIXI.interaction.InteractionManager;

// InteractionManager.prototype.mapPositionToPoint = function (point, x, y) {
//     let rect;

//     // IE 11 fix
//     if (!this.interactionDOMElement.parentElement) {
//         rect = {
//             x: 0,
//             y: 0,
//             width: 0,
//             height: 0
//         };
//     }
//     else {
//         rect = this.interactionDOMElement.getBoundingClientRect();
//     }

//     let angle = 90 * Math.PI / 180;

//     const resolutionMultiplier = navigator.isCocoonJS ? this.resolution : (1.0 / this.resolution);

//     if (window.is90degree) {
//         point.x = ((y - rect.top) * (this.interactionDOMElement.height / rect.width)) * resolutionMultiplier
//         point.y = (this.interactionDOMElement.height - ((x - rect.left) * (this.interactionDOMElement.width / rect.height))) * resolutionMultiplier;
//     }
//     else {
//         point.x = ((x - rect.left) * (this.interactionDOMElement.width / rect.width)) * resolutionMultiplier;
//         point.y = ((y - rect.top) * (this.interactionDOMElement.height / rect.height)) * resolutionMultiplier;
//     }
// }

function unPause() {
    screenManager.timeScale = 1;
    // SOUND_MANAGER.unmute();
}

function pause() {
    screenManager.timeScale = 0;
    // SOUND_MANAGER.mute();
}