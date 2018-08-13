import config from '../../config';


if (config.width < config.height)
{

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
    items: ['addTriggerBlock'],
    height: [LOCALIZATION.FIRST_TUTORIAL[LANGUAGE]],
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
    [enemy, first, 4, firstSelfie, afterSelfie, 4, arc, enemy, 2, enemy, arc, 3, 2, enemy, arc, 3, 2, last],
    [enemy, arc, first, 4, firstPlanks, afterPlanks, arc, enemy, 2, enemy, arc, 3, 2, enemy, 3, 2, arc, last],
    // [first, 3, firstPlanks, afterPlanks, 3, enemy, 1, enemy, 2, 1, enemy, 2, 1, last],
];




export default
{
    levels: levels,
    waves: waves
};