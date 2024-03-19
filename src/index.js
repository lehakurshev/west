
import Card from './Card.js';
import Game from './Game.js';
import TaskQueue from './TaskQueue.js';
import SpeedRate from './SpeedRate.js';
import getInheritanceDescription from "./Card.js";

// Отвечает является ли карта уткой.
function isDuck(card) {
    return card && card.quacks && card.swims;
}

// Отвечает является ли карта собакой.
function isDog(card) {
    return card instanceof Dog;
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
    return 'Существо';
}

class Creature extends Card {
    getDescriptions() {
        return [getCreatureDescription(), ...super.getDescriptions()];
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
    constructor(name = 'Пес-бандит', power = 3) {
        super(name, power);
    }
}

class Lad extends Dog {
    constructor() {
        super('Братки', 2);
    }

    modifyDealedDamageToCreature(value, toCard, gameContext, continuation) {
        super.modifyTakenDamage(value + Lad.getBonus(), toCard, gameContext, continuation)
    };

    modifyTakenDamage(value, fromCard, gameContext, continuation) {
        super.modifyTakenDamage(value - Lad.getBonus(), fromCard, gameContext, continuation);
    };

    takeDamage(value, fromCard, gameContext, continuation) {
        const taskQueue = new TaskQueue();

        let actualValue = value;

        taskQueue.push(onDone => {
            this.modifyTakenDamage(actualValue, fromCard, gameContext, (v) => {
                if (v !== undefined) {
                    actualValue = v;
                }
                onDone();
            });
        });

        taskQueue.push(onDone => {
            if (actualValue <= 0) {
                this.view.signalAbility(onDone());
                return;
            }

            this.currentPower = this.currentPower - actualValue;
            this.updateView();
            this.view.signalAbility(() => this.view.signalDamage(onDone));
        });

        taskQueue.continueWith(continuation);
    };

    doAfterComingIntoPlay(gameContext, continuation) {
        const {currentPlayer, oppositePlayer, position, updateView} = gameContext;
        Lad.setInGameCount(Lad.getInGameCount() + 1)
        continuation();
    };

    doBeforeRemoving(continuation) {
        Lad.setInGameCount(Lad.getInGameCount() - 1)
        continuation();
    };

    static getBonus() {
        const ladCount =  this.getInGameCount();
        return (ladCount * (ladCount + 1)) / 2;
    }

    static setInGameCount(value) { this.inGameCount = value; }
    static getInGameCount() { return this.inGameCount || 0; }
}

class Trasher extends Dog {
    constructor() {
        super('Громила', 5);
    }

    takeDamage(value, fromCard, gameContext, continuation) {
        const taskQueue = new TaskQueue();

        let actualValue = value;

        taskQueue.push(onDone => {
            this.modifyTakenDamage(actualValue, fromCard, gameContext, (v) => {
                if (v !== undefined) {
                    actualValue = v;
                }
                onDone();
            });
        });

        taskQueue.push(onDone => {
            if (actualValue <= 0) {
                this.view.signalAbility(onDone());
                return;
            }

            this.currentPower = this.currentPower - actualValue;
            this.updateView();
            this.view.signalAbility(() => this.view.signalDamage(onDone));
        });

        taskQueue.continueWith(continuation);
    };

    modifyTakenDamage(value, fromCard, gameContext, continuation) {
        super.modifyTakenDamage(value - 1, fromCard, gameContext, continuation);
    }
}

// Колода Шерифа, нижнего игрока.
const seriffStartDeck = [
    new Gatling(),
    new Duck(),
    new Duck(),
];
const banditStartDeck = [
    new Lad(),
    new Lad(),
    new Trasher(),
];
// Создание игры.
const game = new Game(seriffStartDeck, banditStartDeck);

// Глобальный объект, позволяющий управлять скоростью всех анимаций.
SpeedRate.set(1);

// Запуск игры.
game.play(false, (winner) => {
    alert('Победил ' + winner.name);
});