import { RainingClimate, TsunamiClimate } from "./climates";
import { calcChance, randomFloat, randomInt, Rectangle } from "./utils";

class Weather {
  constructor(config) {
    this.config = config;
  }

  _updateWeather(datetime, world) {
    const { temperature, cloudy, wind, humidity } = this.config;
    if (world.isDay()) {
      this.temperature =
        datetime.hour < temperature.day.maxHour
          ? randomInt(this.temperature, temperature.day.max)
          : randomInt(temperature.day.min, this.temperature);
    } else {
      this.temperature = randomInt(
        temperature.night.min,
        temperature.night.max
      );
    }
    this.cloudy = randomFloat(0, cloudy.chance);
    this.humidity = randomFloat(0, humidity.chance);
    this.wind = randomFloat(0, wind.chance);
  }

  update(datetime, world) {
    this._updateWeather(datetime, world);
  }
}

export class WorldMap {
  constructor({ regions } = {}) {
    this.area = Rectangle.createFrom([0, 0, 100, 100]);
    const center = this.area.getCenter();
    this.regions = regions || [];
    this.sunrise = {
      hour: 6,
      position: [this.area.x, center[1]]
    };

    this.sunset = {
      hour: 20,
      position: [this.area.width, center[1]]
    };

    this.sun = {
      position: [0, 0],
      visible: false,
      direction: [1, 0],
      speed:
        (this.area.width - this.area.x) / (this.sunset.hour - this.sunrise.hour)
    };
  }

  isNight() {
    return !this.sun.visible;
  }

  isDay() {
    return this.sun.visible;
  }

  _updateDirection() {
    const xDiff = this.sunrise.position[0] - this.sunset.position[0];
    const xDir = xDiff === 0 ? 0 : xDiff > 0 ? 1 : -1;
    const yDiff = this.sunrise.position[1] - this.sunset.position[1];
    const yDir = yDiff === 0 ? 0 : yDiff > 0 ? 1 : -1;
    this.sun.direction = [xDir, yDir];
  }

  _updateSun(datetime) {
    if (this.sun.visible) {
      this.sun.position[0] += this.sun.direction[0] * this.sun.speed;
      this.sun.position[1] += this.sun.direction[1] * this.sun.speed;
      if (this.sunset.hour <= datetime.hour) {
        this.sun.visible =
          Math.random() < calcChance(this.sunset.hour, 23, datetime.hour);
      }
    } else if (this.sunrise.hour <= datetime.hour) {
      this.sun.visible =
        Math.random() < calcChance(this.sunrise.hour, 10, datetime.hour);
      this.sun.position = [...this.sunrise.position];
    }
  }

  update(datetime) {
    this._updateSun(datetime);
    this.regions.forEach((region) => region.update(datetime, this));
  }
}

class RegionSeason {
  constructor({ name, weather, period }) {
    this.name = name;
    this.period = period;
    this._currentWeather = new Weather(weather);
    this._climateEvents = [
      new TsunamiClimate({ chance: 0.3 }),
      new RainingClimate({ chance: 0.5 })
    ];
  }

  get currentWeather() {
    return this._currentWeather;
  }

  get climateEvent() {
    return this._currentClimateEvent;
  }

  update(datetime, world) {
    this._currentWeather.update(datetime, world);
    if (this.climateEvent) {
      this.climateEvent.update(datetime, world);
      if (this.climateEvent.hasFinished()) {
        this._currentClimateEvent = null;
      }
    } else {
      this._climateEvents.forEach((event) => {
        if (!this.climateEvent && event.activate()) {
          this._currentClimateEvent = event;
        }
      });
    }
  }
}

class MapRegion {
  constructor({ seasons, name }) {
    this.name = name;
    this._currentSeasonIndex = 0;
    this.seasons = seasons;
    this.fauna = [];
    this.flora = [];
  }

  get currentSeason() {
    return this.seasons[this._currentSeasonIndex];
  }

  get currentWeather() {
    return this.currentSeason.currentWeather;
  }
  get climateEvent() {
    return this.currentSeason.climateEvent;
  }

  update(datetime, world) {
    if (datetime.dayOfTheYear === this.currentSeason.period.end) {
      this._currentSeasonIndex =
        (this._currentSeasonIndex + 1) % this.seasons.length;
    }
    this.currentSeason.update(datetime, world);
  }
}

export const northRegion = new MapRegion({
  name: "Noth Region",
  seasons: [
    new RegionSeason({
      name: "winter",
      period: {
        start: 0,
        end: 111
      },
      weather: {
        humidity: { chance: 0.7, volume: 0.3 },
        wind: { chance: 0, volume: 0 },
        cloudy: { chance: 0.3, volume: 0.5 },
        temperature: {
          day: { min: 20, max: 40, maxHour: 12 },
          night: { min: 15, max: 20 }
        }
      }
    }),
    new RegionSeason({
      name: "spring",
      period: {
        start: 111,
        end: 203
      },
      weather: {
        humidity: { chance: 0.7, volume: 0.3 },
        wind: { chance: 0, volume: 0 },
        cloudy: { chance: 0.3, volume: 0.5 },
        temperature: {
          day: { min: 20, max: 40, maxHour: 12 },
          night: { min: 15, max: 20 }
        }
      }
    }),
    new RegionSeason({
      name: "summer",
      period: {
        start: 203,
        end: 294
      },
      weather: {
        humidity: { chance: 0.7, volume: 0.3 },
        wind: { chance: 0, volume: 0 },
        cloudy: { chance: 0.3, volume: 0.5 },
        temperature: {
          day: { min: 20, max: 40, maxHour: 12 },
          night: { min: 15, max: 20 }
        }
      }
    }),
    new RegionSeason({
      name: "fall",
      period: {
        start: 294,
        end: 352
      },
      weather: {
        humidity: { chance: 0.7, volume: 0.3 },
        wind: { chance: 0, volume: 0 },
        cloudy: { chance: 0.3, volume: 0.5 },
        temperature: {
          day: { min: 20, max: 40, maxHour: 12 },
          night: { min: 15, max: 20 }
        }
      }
    }),
    new RegionSeason({
      name: "winter",
      period: {
        start: 352,
        end: 366
      },
      weather: {
        humidity: { chance: 0.7, volume: 0.3 },
        wind: { chance: 0, volume: 0 },
        cloudy: { chance: 0.3, volume: 0.5 },
        temperature: {
          day: { min: 20, max: 40, maxHour: 12 },
          night: { min: 15, max: 20 }
        }
      }
    })
  ]
});
export const southRegion = new MapRegion({
  seasons: [
    {
      name: "winter",
      period: {
        start: 0,
        end: 111
      },
      sunsiseHour: 7,
      sunsetHour: 20
    },
    {
      name: "spring",
      period: {
        start: 111,
        end: 203
      },
      sunsiseHour: 7,
      sunsetHour: 20
    },
    {
      name: "summer",
      period: {
        start: 203,
        end: 294
      },
      sunsiseHour: 7,
      sunsetHour: 20
    },
    {
      name: "fall",
      period: {
        start: 294,
        end: 352
      },
      sunsiseHour: 7,
      sunsetHour: 20
    },
    {
      name: "winter",
      period: {
        start: 352,
        end: 366
      },
      sunsiseHour: 7,
      sunsetHour: 20
    }
  ],
  weathersBySeason: {
    summer: {
      rain: { chance: 0.7, volume: 0.3 },
      snowning: { chance: 0, volume: 0 },
      cloudy: { chance: 0.3, volume: 0.5 },
      temperature: { min: 20, max: 40 }
    },
    winter: {
      rain: { chance: 0.7, volume: 0.3 },
      snowning: { chance: 0, volume: 0 },
      cloudy: { chance: 0.3, volume: 0.5 },
      temperature: { min: 20, max: 40 }
    },
    fall: {
      rain: { chance: 0.7, volume: 0.3 },
      snowning: { chance: 0, volume: 0 },
      cloudy: { chance: 0.3, volume: 0.5 },
      temperature: { min: 20, max: 40 }
    },
    spring: {
      rain: { chance: 0.7, volume: 0.3 },
      snowning: { chance: 0, volume: 0 },
      cloudy: { chance: 0.3, volume: 0.5 },
      temperature: { min: 20, max: 40 }
    }
  }
});


