export class Calendar {
  constructor() {
    this.day = 1;
    this.month = 1;
    this.daysPerMonth = 30;
    this.hour = 0;
    this.year = 1000;
  }

  get weekDay() {
    const weekDay = this.day % 7;
    return weekDay ?? 7;
  }

  update() {
    this.hour++;
    if (this.hour === 24) {
      this.hour = 0;
      this.day++;
      this.dayOfTheYear++;
      if (this.day > this.daysPerMonth) {
        this.daysPerMonth = this.daysPerMonth === 30 ? 31 : 30;
        this.day = 1;
        this.month++;
        if (this.month > 12) {
          this.month = 1;
          this.year++;
          this.dayOfTheYear = 0;
        }
      }
    }
  }
}
