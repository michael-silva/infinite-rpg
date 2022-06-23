import { RainingClimate, HuricaneClimate } from "./climates";
import { calcChance, randomFloat, randomInt, Rectangle } from "./utils";
import { MountainField, FlorestField, FlatlandTerrain } from "./world-elements";

class Weather {
  constructor(config) {
    this.config = config;
  }

  _updateWeather(datetime, world) {
    const { temperature, cloudy, wind, humidity } = this.config;
    if (world.isDay()) {
      const newTemperature = randomInt(temperature.day.min, temperature.day.max)
      if(datetime.hour < temperature.day.maxHour && newTemperature > this.temperature) {
        this.temperature = newTemperature
      }
      if(datetime.hour > temperature.day.maxHour && newTemperature < this.temperature) {
        this.temperature = newTemperature
      }
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
  constructor({ regions } = {  }) {
    this._requestSunriseSunsetData();
    this.area = Rectangle.createFrom([0, 0, 100, 100]);
    const center = this.area.getCenter();
    this.regions = regions || [];
    this.sunrise = {
      hour: 6,
      position: [this.area.x, center[1]]
    };

    this.sunset = {
      hour: 18,
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
        this.sun.position[0] += this.sun.direction[0] * this.sun.speed
        this.sun.position[1] += this.sun.direction[1] * this.sun.speed
    } else if (this.sunrise.hour <= datetime.hour) {
        this.sun.position = [...this.sunrise.position]
    }

    this.sun.visible =
        datetime.hour >= this.sunrise.hour &&
        datetime.hour <= this.sunset.hour
  }

  update(datetime) {
    this._updateSun(datetime);
    this.regions.forEach((region) => region.update(datetime, this));
  }

  _requestSunriseSunsetData(){
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
        const api = 'https://api.sunrise-sunset.org/json'
        const params = new URLSearchParams({
            lat: coords.latitude,
            lng: coords.longitude,
            formatted: 0,
        })

        
        const results =
            JSON.parse(localStorage.getItem('sun-data') ?? null) ||
            (await fetch(`${api}?${params}`).then((res) => res.json()))?.results

        if (results) {
            this.sunrise.hour = new Date(results.sunrise).getHours()
            this.sunset.hour = new Date(results.sunset).getHours()
            
            localStorage.setItem('sun-data', JSON.stringify(results))
        }
    })
  }
}

class RegionSeason {
  constructor({ name, weather, period }) {
    this.name = name;
    this._period = period;
    this._currentWeather = new Weather(weather);
  }

  get currentWeather() {
    return this._currentWeather;
  }

  hasEnd(datetime) {
    return datetime.dayOfTheYear >= this._period.end
  }

  update(datetime, world) {
    this._currentWeather.update(datetime, world);
  }
}

class MapRegion {
  constructor({ seasons, elements, towns, name, dungeons }) {
    this.name = name;
    this._currentSeasonIndex = 0;
    this.seasons = seasons || [];
    this.towns = towns || [];
    this.dungeons = dungeons || [];
    this.terrain = new FlatlandTerrain({ type: 'grass' })
    this.elements = [
      new FlorestField({ }),
      new MountainField({ }),
    ];
    this._generalChanceForClimateEvents = 2
    this._climateEvents = [
      new HuricaneClimate({ chance: 0.3 }),
      new RainingClimate({ chance: 0.5 })
    ];
  }

  get currentSeason() {
    return this.seasons[this._currentSeasonIndex];
  }

  get currentWeather() {
    return this.currentSeason.currentWeather;
  }

  get climateEvent() {
    return this._currentClimateEvent;
  }
  
  addDamage(damage) {
    this.elements.forEach(element =>element.applyDamage(damage))
  }

  addWeatherModifier() {

  }

  _updateSeason(datetime, world) {
    if (this.currentSeason.hasEnd(datetime)) {
      this._currentSeasonIndex =
        (this._currentSeasonIndex + 1) % this.seasons.length;
    }
    this.currentSeason.update(datetime, world);
  }

  _updateGeneralClimateEventChance() {
    this._generalChanceForClimateEvents += 0.01
  }

  _updateClimateEvents(datetime, world) {
    if (this.climateEvent) {
      this.climateEvent.update(datetime, this);
      if (this.climateEvent.hasFinished()) {
        this._currentClimateEvent = null;
        this._generalChanceForClimateEvents = 0
      }
    } else if (Math.random() < this._generalChanceForClimateEvents)  {
      const [[index, chance]] = this._climateEvents.map((event, i) => [i, event.classify(datetime, this)]).sort((a, b) => a[1] > b[1] ? 1 : -1);
      if (chance > this._climateEvents[index].chance) {
        this._currentClimateEvent = this._climateEvents[index];
        this.climateEvent.activate(datetime, this)
      }
    }
    else {
      this._updateGeneralClimateEventChance()
    }
  }

  update(datetime, world) {
    this._updateSeason(datetime, world)
    this._updateClimateEvents(datetime, world)
    this.terrain.update(datetime, this)
    this.elements.forEach(element =>element.update(datetime, this))
  }
}

const seasons = [
  new RegionSeason({
    name: "winter",
    period: {
      start: 0,
      end: 111
    },
    weather: {
      humidity: { chance: 0.7, volume: 0.3 },
      wind: { chance: 0.5, volume: 0 },
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
export const northRegion = new MapRegion({
  name: "North Region",
  seasons: [...seasons]
});
export const southRegion = new MapRegion({
  name: "South Region",
  seasons: [...seasons]
});
export const westRegion = new MapRegion({
  name: "West Region",
  seasons: [...seasons]
});
export const eastRegion = new MapRegion({
  name: "East Region",
  seasons: [...seasons]
});


