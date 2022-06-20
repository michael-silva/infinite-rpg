export class HuricaneClimate {
  constructor() {}
}

export class EarthquakeClimate {
  constructor() {}
}

export class VolcanicEruptionClimate {
  constructor() {}
}

export class RainingClimate {
  constructor({ chance } = {}) {
    this.name = "Raining";
    this.chance = chance;
    this.volume = 0;
  }

  update() {
    /**
     * Apenas 1 ativo por vez
     * Activate baseado no clima e na região
     * Update posição, area e duração
     */
    this.volume++;
    if (this.volume > 10) {
      this._isActivated = false;
      this.volume = 0;
      this.state = "finished";
    }
  }

  activate() {
    this._isActivated = Math.random() < this.chance;
    if (this._isActivated) {
      this.state = "activates";
    }
    return this._isActivated;
  }

  hasFinished() {
    return this.state === "finished";
  }
}

export class CloudyClimate {
  constructor() {}
}

export class SnowingClimate {
  constructor() {}
}

export class SandstormClimate {
  constructor() {}
}

export class TsunamiClimate {
  constructor({ chance } = {}) {
    this.name = "Tsunami";
    this.chance = chance;
    this.volume = 0;
  }

  update() {
    /**
     * Apenas 1 ativo por vez
     * Activate baseado no clima e na região
     * Update posição, area e duração
     */
    this.volume++;
    if (this.volume > 10) {
      this._isActivated = false;
      this.volume = 0;
      this.state = "finished";
    }
  }

  activate() {
    this._isActivated = Math.random() < this.chance;
    if (this._isActivated) {
      this.state = "activates";
    }
    return this._isActivated;
  }

  hasFinished() {
    return this.state === "finished";
  }
}
