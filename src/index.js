import Card from './Card.js';
import Game from './Game.js';
import TaskQueue from './TaskQueue.js';
import SpeedRate from './SpeedRate.js';

// Отвечает является ли карта уткой.
function isDuck(card) {
    return card && card.quacks && card.swims;
}

// Отвечает является ли карта собакой.
function isDog(card) {
    return card instanceof Dog;
}

function isGatling(card) {
    return card instanceof Gatling;
}

// Дает описание существа по схожести с утками и собаками
function getCreatureDescription(card) {
    if (isDuck(card) && isDog(card)) {
        return 'Утка-Собака';
    }
    if (isDuck(card)) {
        return 'Утка';
    }
    if (isDog(card)) {
        return 'Собака';
    }
    if (isDog(card)) {
        return 'Собака';
    }
    if (isGatling(card)){
        return 'Гатлинг'
    }
    return 'Существо';
}

class Creature extends Card {
    getDescriptions() {
        return [getCreatureDescription(), ...super.getDescriptions()];
    }
}






class Duck extends Creature {
    constructor() {
        super('Мирная утка', 2);
    }

    quacks() {
        console.log('quack');
    }

    swims() {
        console.log('float: both;');
    }
}

class Dog extends Creature {
    constructor() {
        super('Пес-бандит', 3);
    }

    quacks() {
        console.log('quack');
    }

    swims() {
        console.log('float: both;');
    }
}

class Gatling extends Creature {
    constructor() {
        super('Гатлинг', 6);
    }

    attack(gameContext, continuation) {
        const taskQueue = new TaskQueue();
        const cardsToAttack = gameContext.oppositePlayer.table;
    
        for (let index = 0; index < cardsToAttack.length; index++) {
            taskQueue.push(onDone => {
                const targetCard = cardsToAttack[index];
                this.dealDamageToCreature(2, targetCard, gameContext, onDone);
                
            });
        }
    
        taskQueue.continueWith(continuation);
    };

    quacks() {
        console.log('quack');
    }

    swims() {
        console.log('float: both;');
    }
}



// Колода Шерифа, нижнего игрока.
const seriffStartDeck = [
    
    new Gatling(),
];
const banditStartDeck = [

    new Dog(),
    new Dog(),
    new Dog(),
];

// Создание игры.
const game = new Game(seriffStartDeck, banditStartDeck);

// Глобальный объект, позволяющий управлять скоростью всех анимаций.
SpeedRate.set(1);

// Запуск игры.
game.play(false, (winner) => {
    alert('Победил ' + winner.name);
});
