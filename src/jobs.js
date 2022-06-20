export class SalesmanHumanJob {
  constructor({ person }) {
    this.person = person;
  }

  update(time) {
    if (time < 7) this.currentAction = "sleeping";
    else if (time < 8) this.currentAction = "going to work";
    else if (time > 12 && this.person.hasEaten) {
      this.currentAction = "eating";
      this.person.hasEaten = true;
    } else if (time < 19) this.currentAction = "working";
    else if (time > 19) this.currentAction = "going home";
    else if (time > 21) {
      this.person.hasEaten = false;
      this.currentAction = "sleeping";
    }
  }
}

export class SoldierHumanJob {
  constructor({ person }) {
    this.person = person;
  }

  update(time) {
    if (time < 7) this.currentAction = "sleeping";
    else if (time < 8) this.currentAction = "going to base";
    else if (time > 12 && this.person.hasEaten) {
      this.currentAction = "eating";
      this.person.hasEaten = true;
    } else if (time < 19) this.currentAction = "patrulling";
    else if (time > 19) this.currentAction = "going home";
    else if (time > 21) {
      this.person.hasEaten = false;
      this.currentAction = "sleeping";
    }
  }
}

export class StudentHumanJob {
  constructor({ person }) {
    this.person = person;
  }

  update(time) {
    if (time < 7) this.currentAction = "sleeping";
    else if (time < 8) this.currentAction = "going to school";
    else if (time > 12) this.currentAction = "going home";
    else if (time > 13) {
      this.currentAction = "sleeping";
    }
  }
}

export class GangsterHumanJob {
  constructor({ person }) {
    this.person = person;
  }

  update(time) {
    if (time < 7) this.currentAction = "sleeping";
    else if (time < 8) this.currentAction = "going to school";
    else if (time > 12) this.currentAction = "going home";
    else if (time > 13) {
      this.currentAction = "sleeping";
    }
  }
}

export class FarmerHumanJob {
  constructor({ person }) {
    this.person = person;
  }

  update(time) {
    if (time < 7) this.currentAction = "sleeping";
    else if (time < 8) this.currentAction = "going to school";
    else if (time > 12) this.currentAction = "going home";
    else if (time > 13) {
      this.currentAction = "sleeping";
    }
  }
}

export class SquireHumanJob {
  constructor({ person }) {
    this.person = person;
  }

  update(time) {
    if (time < 7) this.currentAction = "sleeping";
    else if (time < 8) this.currentAction = "going to school";
    else if (time > 12) this.currentAction = "going home";
    else if (time > 13) {
      this.currentAction = "sleeping";
    }
  }
}

export class DoctorHumanJob {
  constructor({ person }) {
    this.person = person;
  }

  update(time) {
    if (time < 7) this.currentAction = "sleeping";
    else if (time < 8) this.currentAction = "going to school";
    else if (time > 12) this.currentAction = "going home";
    else if (time > 13) {
      this.currentAction = "sleeping";
    }
  }
}

class WalkingAction {
  toString() {
    return `Walkig from [${this.person.position}] to [${this.target}]`;
  }

  constructor({ person }) {
    this.person = person;
  }

  hasArrived() {
    return this.person.position.every((pos, i) => pos === this.target[i]);
  }

  get target() {
    return this._target;
  }

  set target(targetPosition) {
    this._target = targetPosition;
    this._updateDirection();
  }

  _updateDirection() {
    const xDiff = this._target[0] - this.person.position[0];
    const xDir = xDiff === 0 ? 0 : xDiff > 0 ? 1 : -1;
    const yDiff = this._target[1] - this.person.position[1];
    const yDir = yDiff === 0 ? 0 : yDiff > 0 ? 1 : -1;
    this.direction = [xDir, yDir];
  }

  update(datetime) {
    if (!this.hasArrived()) {
      this.person.move(this.direction);
      this._updateDirection();
    }
  }

  isEnabled() {
    return true;
  }

  isDone() {
    return true;
  }
}

class HiddenAction {
  toString() {
    return `Hidden [sleeping or in inacessible area]`;
  }

  constructor({ person }) {
    this.person = person;
  }

  update(datetime) {
    this._done = datetime.hour > 5 && datetime.hour < 19;
  }

  isEnabled() {
    return this.person.isInHome();
  }

  isDone() {
    return this._done;
  }
}

class SweepingAction {
  constructor({ person }) {
    this.person = person;
  }

  update() {}
}

class SeatingAction {
  toString() {
    return `Seatig in ${this.target.name}`;
  }

  constructor({ person }) {
    this.person = person;
  }

  update() {}

  isEnabled() {
    return this.person.isInHome();
  }

  isDone() {
    return this._done;
  }
}

class ChattingAction {
  toString() {
    return `Chatting with ${this.target.name}`;
  }

  constructor({ person }) {
    this.person = person;
  }

  update(datetime) {}

  set target(targetPerson) {
    this.target = targetPerson;
  }

  isEnabled() {
    return this.person.isInHome();
  }

  isDone() {
    return this._done;
  }
}

// época do ano
// eventos na cidade
// eventos familiares, aniversarios e casamentos
// personalidade
// opçòes de afazeres na cidade
// localização atual
// pessoas o seu redor
// relações com pessoas
// papel na história
// multiplos jobs atuais
// histórico de jobs
export class RetiredHumanJob {
  constructor({ person }) {
    this.person = person;
    this.actions = {
      walking: new WalkingAction({ person }),
      hidden: new HiddenAction({ person }),
      seating: new SeatingAction({ person }),
      sweeping: new SweepingAction({ person }),
      chatting: new ChattingAction({ person })
    };
    this.queueActions = [];
    this.currentAction = this.actions.hidden;
  }

  hasNextAction() {
    return this.queueActions.length > 0;
  }

  startNextAction() {
    const [nextAction] = this.queueActions.slice(0, 1);
    this.startAction(nextAction)
  }

  enqueueAction(action) {
    this.queueActions.push(action)
  }

  sortAvaibleAction() {}

  startAction(action) {
    if(this.currentAction.finish) {
      this.currentAction.finish()
    }
    if(action.start) {
      action.start()
    }
    this.currentAction = action
  }

  update(datetime) {
    this.currentAction.update(datetime);
    if (this.currentAction.isDone()) {
      if (this.hasNextAction()) this.startNextAction();
      const avaibleAction = this.sortAvaibleAction();
      this.startAction(avaibleAction);
    } else {
    }
    if (
      (datetime.hour < 5 || datetime.hour > 19) &&
      this.actions.hidden.isEnabled()
    ) {
      this.currentAction = this.actions.hidden;
    } else if (this.person.isInHome()) {
      const hasWakeup = Math.random() < 0.5;
      if (hasWakeup) {
        // const citySquare = this.city.getSquare(this.person.home);
        // const hasBalconySeat = this.home.has({ room: "balcony", seat: "free" });
        // const hasPlants = this.home.has({ plants: true });
        // const hasSidewalk = this.home.has({ sidewalk: true });
        this.actions.walking.target = [6, 6];
        this.currentAction = this.actions.walking;
      }
    } else if (
      this.currentAction === this.actions.walking &&
      this.currentAction.hasArrived()
    ) {
      this.currentAction = this.actions.seating;
    } else if (
      datetime.hour > 19 &&
      this.currentAction !== this.actions.walking
    ) {
      this.actions.walking.target = [...this.person.home.position];
      this.currentAction = this.actions.walking;
    }
  }
}

export class HomelessHumanJob {
  constructor({ person, city }) {
    this.person = person;
  }

  update(time) {
    if (time < 7) this.currentAction = "sleeping";
    else if (time < 8) this.currentAction = "going to school";
    else if (time > 12) this.currentAction = "going home";
    else if (time > 13) {
      this.currentAction = "sleeping";
    }
  }
}
