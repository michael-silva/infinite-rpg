import {
  DoctorHumanJob,
  FarmerHumanJob,
  GangsterHumanJob,
  RetiredHumanJob,
  SalesmanHumanJob,
  SoldierHumanJob,
  SquireHumanJob,
  StudentHumanJob
} from "./jobs";
import { randomInt, randomItem } from "./utils";

export class Person {
  constructor({ gender, name, age, height, weight, home, personality } = {}) {
    this.name = name;
    this.age = age;
    this.height = height;
    this.weight = weight;
    this.gender = gender;
    this.personality = personality;
    this.home = home;
    this.position = home?.position || [0, 0];
    this.speed = 2;
  }

  get currentAction() {
    return this.job?.currentAction.toString();
  }

  isInHome() {
    return (
      this.position[0] === this.home?.position[0] &&
      this.position[1] === this.home?.position[1]
    );
  }

  isMale() {
    return this.gender === "male";
  }

  move(direction) {
    this.position[0] += direction[0] * this.speed;
    this.position[1] += direction[1] * this.speed;
  }

  talkTo(person) {
    this.talkText = "hello " + person.name;
  }

  update(time) {
    this.job?.update(time);
  }
}

class Race {
  constructor({ lastNames, maleNames, femaleNames, ages, malePercent } = {}) {
    this.lastNames = lastNames;
    this.maleNames = maleNames;
    this.femaleNames = femaleNames;
    this.ages = ages;
    this.malePercent = malePercent;
  }

  _generateName(person) {
    const firstName = randomItem(
      person.isMale() ? this.maleNames : this.femaleNames
    );
    const lastNames = [];
    const maxNames = randomInt(1, 3);
    for (let i = 0; i < maxNames; i++) {
      lastNames.push(randomItem(this.lastNames));
    }
    return `${firstName} ${lastNames.join(" ")}`;
  }

  generatePerson({ city } = {}) {
    const person = new Person();
    const ageIndex = randomInt(0, this.ages.length);
    const currentAge = this.ages[ageIndex];
    const lastAge = this.ages[ageIndex - 1] || {
      maxAge: 2,
      maxHeight: 30,
      maxWeight: 50
    };
    person.gender = Math.random() < this.malePercent ? "male" : "female";
    person.name = this._generateName(person);
    person.age = randomInt(lastAge.maxAge, currentAge.maxAge);
    person.height = randomInt(lastAge.maxHeight, currentAge.maxHeight);
    person.weight = randomInt(lastAge.maxWeight, currentAge.maxWeight);
    const Job = RetiredHumanJob; // randomItem(currentAge.jobs);
    console.log(person, person.isInHome());
    person.job = new Job({ person });
    if (city) {
      city.addHouseTo({ person });
      person.position = [...person.home.position];
    }
    return person;
  }
}

export const humanRace = new Race({
  malePercent: 0.6,
  femaleNames: [
    "Marie",
    "Michele",
    "Kami",
    "Yuna",
    "Stephanie",
    "Sophie",
    "Feh",
    "Leslie",
    "Gaby"
  ],
  maleNames: [
    "Mike",
    "Jack",
    "Gon",
    "Ryu",
    "Cloud",
    "Zack",
    "Arnold",
    "Welly",
    "Rudie"
  ],
  lastNames: [
    "Hagar",
    "Presley",
    "Simpsom",
    "Martinz",
    "Lopes",
    "Stronghold",
    "Armstrong",
    "Oswald",
    "Silva"
  ],
  ages: [
    {
      name: "child",
      jobs: [StudentHumanJob],
      maxAge: 12,
      maxHeight: 100,
      maxWeight: 60
    },
    {
      name: "teen",
      jobs: [
        StudentHumanJob,
        GangsterHumanJob,
        SalesmanHumanJob,
        SquireHumanJob
      ],
      maxAge: 20,
      maxHeight: 250,
      maxWeight: 150
    },
    {
      name: "adult",
      jobs: [SoldierHumanJob, FarmerHumanJob, SalesmanHumanJob, DoctorHumanJob],
      maxAge: 60,
      maxHeight: 230,
      maxWeight: 150
    },
    {
      name: "eldery",
      jobs: [RetiredHumanJob, SalesmanHumanJob, DoctorHumanJob],
      maxAge: 120,
      maxHeight: 200,
      maxWeight: 150
    }
  ]
});
