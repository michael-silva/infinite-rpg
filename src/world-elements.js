export class MountainRangeTerrain {
    constructor() {

    }

    update() {

    }

    

}

export class HighlandTerrain {
    constructor() {

    }

    update() {
        
    }
}

export class FlatlandTerrain {
    constructor({ type }) {
        this.type = type
    }

    update() {
        
    }
}

export class DepressionTerrain {
    constructor() {

    }

    update() {
        
    }
}

class EmptyStatusPlaceholder {
    constructor() {

    }

    checkDamage() {
        return false
    }

    update() {
    }

    hasEnded() {
        return false
    }
}

class ThreeHealthyStatus {
    constructor() {

    }

    checkDamage() {
        return false
    }

    update(three) {
        if (three.health < this.maxHealth) three.health++
    }

    hasEnded() {
        return false
    }
}

class ThreePoisonStatus {
    constructor() {
        this._statusDuration = 0
    }

    checkDamage({ type }) {
        return type === "poison"
    }

    update(three) {
        three.health -= 5;
        if(this._statusDuration > 0) this._statusDuration--
    }

    hasEnded() {
        this._statusDuration === 0
    }

    start() {
        this._statusDuration = 10
    }
}

class ThreeFireStatus {
    constructor() {
        this._statusDuration = 0
    }

    checkDamage({ type }) {
        return type === "fire"
    }

    update(three) {
        three.health--
        if(this._statusDuration > 0) this._statusDuration--
    }

    start() {
        this._statusDuration = 10
    }

    hasEnded() {
        this._statusDuration === 0
    }
}

class RockIceStatus {
    constructor() {
        this._statusDuration = 0
    }

    checkDamage({ type }) {
        return type === "ice"
    }

    update(three) {
        if(this._statusDuration > 0) this._statusDuration--
    }

    start() {
        this._statusDuration = 10
    }

    hasEnded() {
        this._statusDuration === 0
    }
}

class PineThree {
    constructor() {
        this.type = "tree"
        this._size = 5;
        this._defaultStatus = new ThreeHealthyStatus()
        this._status = [
            new ThreeFireStatus(),
            new ThreePoisonStatus()
        ]
        this._state = "health"
        this._health = 100
    }

    get currentStatus() {
        return this._status[this._currentStatusIndex] || this._defaultStatus
    }

    set health(h) {
        this._health = h
    }

    get health() {
        return this._health
    }

    isDead() {
        return this._dead
    }

    update(datetime) {
        this.currentStatus.update(this)
        if (this._health < 0) this._dead = true
        if(this.currentStatus.hasEnded()) {
            this._currentStatusIndex = -1
        }
    }

    receiveDamage({ type, force }) {
        const index = this._status.findIndex(status => status.checkDamage({ type, force }))
        if (index >= 0) {
            this._currentStatusIndex = index
            this.currentStatus.start()
        }
        this._health -= force
    }
}

class Rock {
    constructor() {
        this.type = "rock"
        this._size = 5;
        this._defaultStatus = new EmptyStatusPlaceholder()
        this._status = [
            new RockIceStatus(),
        ]
        this._state = "health"
        this._health = 100
    }

    get currentStatus() {
        return this._status[this._currentStatusIndex] || this._defaultStatus
    }

    set health(h) {
        this._health = h
    }

    get health() {
        return this._health
    }

    isDead() {
        return this._dead
    }

    update(datetime) {
        this.currentStatus.update()
        if (this._health < 0) this._dead = true
        if(this.currentStatus.hasEnded()) {
            this._currentStatusIndex = -1
        }
    }

    receiveDamage({ type, force }) {
        const index = this._status.findIndex(status => status.checkDamage({ type, force }))
        if (index >= 0) {
            this._currentStatusIndex = index
            this.currentStatus.start()
        }
        this._health -= force
    }
}

class Shrub {
    constructor() {
        this.type = "grass"
    }

    isDead() {
        return this._dead
    } 

    update(datetime) {
        // update animation
    }

    receiveDamage(damage) {
        // reduce life
    }
}

export class FlorestField {
    constructor() {
        this.type = "forest"
        this.elements = [
            new PineThree({ }),
            new Rock({ }),
            new Shrub({ })
        ]

    }

    update(datetime) {
        this.elements.forEach(element => element.update(this))
    }

    applyDamage(damage) {
        this.elements.forEach(element => element.receiveDamage(damage))
    }

}

export class MountainField {
    constructor() {
        this.type = "mountain"
        this.elements = [
            new PineThree({ }),
            new Rock({ }),
            new Shrub({ })
        ]
    }

    update(datetime) {
        this.elements.forEach(element => element.update(this))
    }

    applyDamage(damage) {
        this.elements.forEach(element => element.receiveDamage(damage))
    }

}

export class VulkanField {

}

export class LakeField {

}

export class RiverField {

}

export class BeachField {

}

export class SwampField {

}

export class GrassField {

}

export class RoadField {

}

export class CaveField {

}