import { randomInt } from "./utils";

Math.average = (...args) => args.reduce((a, b) => a + b) / args.length;

export class HuricaneClimate {
  toString() {
    return `${this.name}: ${this.intensity}km / ${this.duration}` 
  }

  constructor({ chance }) {
    this.type = "hurricane"
    this.name = 'Hurricane'
    this.chance = chance;
    this.position = [];
    this.diameter = [];
    this.intensity = 0;
  }

  update(datetime, region) {
    this.duration--;
    const { wind } = region.currentWeather
    if (this.intensity < this.maxIntensity && this.duration > 5) {
      this.intensity = randomInt(this.intensity, this.maxIntensity)
      region.addDamage({
        force: this.intensity * wind,
        type: 'wind'
      })
    }
    else if (this.duration === 0) {
      this.intensity = 0;
      this._classification = 0;
      this.state = "finished";
    }
    else {
      this.intensity = randomInt(50, this.intensity)
    }
  }

  classify(datetime, region) {
    const { wind, temperature } = region.currentWeather
    if (wind < 0.2 && temperature < 0) return 0
    this._classification = Math.average(Math.random(), wind);
    console.log(`${this.name} - ${this._classification}`)
    return this._classification
  }

  activate(datetime, region) {
    this.intensity = randomInt(50, 100)
      this.maxIntensity = randomInt(this.intensity, 300)
      this.duration = randomInt(3, 24)
      this.state = "activate";
    region.addWeatherModifier({
      wind: { min: 0.3, onlyUp: true  },
    })
  }

  hasFinished() {
    return this.state === "finished";
  }
}

export class EarthquakeClimate {
  constructor() {}
}

export class VolcanicEruptionClimate {
  constructor() {}
}

export class RainingClimate {
  toString() {
    return `${this.name}: ${this.intensity.toFixed(2)} / ${this.volume.toFixed(2)}` 
  }

  constructor({ chance } = {}) {
    this.type = "raining"
    this.name = "Raining";
    this.chance = chance;
    this.volume = 0;
    this.intensity = 0;
    this._classification = 0;
  }

  update(datetime, region) {
    const { wind } = region.currentWeather
    this.intensity = Math.average(this._classification, Math.random());
    this.volume -= 10 * this.intensity;
    region.addDamage({
      force: this.intensity * wind,
      type: 'water'
    })
    if (this.volume <= 0) {
      this.volume = 0;
      this.intensity = 0;
      this._classification = 0;
      this.state = "finished";
    }
  }

  classify(datetime, region) {
    const { humidity, cloudy, wind, temperature } = region.currentWeather
    if (humidity < 0.3 && temperature < 0) return 0
    this._classification = Math.average(Math.random(), humidity, cloudy);
    console.log(`${this.name} - ${this._classification}`)
    return this._classification
  }

  activate(datetime, region) {
    this.intensity = Math.average(this._classification, Math.random());
    this.volume = randomInt(10, 100) * this.intensity
    this.state = "activate";
    region.addWeatherModifier({
      humidity: { min: 0.3, onlyUp: true  },
      cloudy: { min: 0.3, max: 0.5, onlyUp: true },
    })
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
    this.type = "tsunami"
    this.name = "Tsunami";
    this.chance = chance;
    this.volume = 0;
  }

  update() {
    this.volume++;
    if (this.volume > 10) {
      this._isActivated = false;
      this.volume = 0;
      this.state = "finished";
    }
  }

  classify() {

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
