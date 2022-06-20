import { northRegion } from "./world";

class HumanCity {
    constructor() {
      this.dailyRoutine = [
        { hour: 8, type: "open-commerce" },
        { hour: 12, type: "lunch-time" },
        { hour: 18, type: "close-commerce" },
        { hour: 18, type: "open-night-commerce" },
        { hour: 0, type: "close-night-commerce" }
      ];
  
      this.buildings = {
        residential: [
          { position: [0, 0], size: [10, 10] },
          { position: [20, 0], size: [10, 10] },
          { position: [20, 20], size: [10, 10] },
          { position: [20, 40], size: [10, 10] },
          { position: [40, 0], size: [10, 10] },
          { position: [40, 20], size: [10, 10] },
          { position: [40, 40], size: [10, 10] },
          { position: [60, 60], size: [10, 10] }
        ]
      };
  
      this.schedule = [
        {
          repeat: { type: "weekly", weekDay: 0 },
          routine: [
            { hour: 12, type: "lunch-time" },
            { hour: 12, type: "lunch-time" },
            { hour: 12, type: "lunch-time" }
          ]
        },
        {
          repeat: { type: "weekly", weekDay: 4 },
          routine: [{ hour: 18, type: "close-commerce" }]
        },
        {
          repeat: { type: "weekly", weekDay: 5 },
          routine: [{ hour: 18, type: "open-night-commerce" }]
        },
        {
          duration: { startDay: 3, endDay: 4 },
          routine: [{ hour: 18, type: "open-night-commerce" }]
        }
      ];
    }
  
    get currentEvent() {}
  
    addHouseTo({ person }) {
      person.home = this.buildings.residential.find((r) => !r.occuped);
      person.home.occuped = true;
      console.log("person", person.name, person.home);
    }
  
    update(datetime) {
      if (datetime.time === 0) {
        this.routine = this._getTodayRoutine(datetime);
      }
    }
  }
  
  export const humanCity = new HumanCity({ region: northRegion });