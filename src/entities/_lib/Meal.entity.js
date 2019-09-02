import moment from 'moment';

export class Meal {
  constructor(meal) {
    this.original = meal;

    this.id = meal._id;
    this.userId = meal.user_id;
    this.name = meal.name;
    this.calories = meal.calories;
    this.originalDate = meal.date;
    this.date = new Date(meal.date);
    this.fisrtMinuteDate = this.date.setMinutes(0);
    this.lastMinuteDate = this.date.setMinutes(59);
    this.minutesCount = this.date.getMinutes() + this.date.getHours() * 60;
    this.time = this.minutesCount;

    this.tableDate = moment(this.date).format('ddd,  MM/DD/YY - hh:mm A')

    this.tableDay = moment(this.date).format('ddd,  MM/DD/YY')
    this.tableTime = moment(this.date).format('hh:mm A')

    this.day = moment(this.date).format('MM-DD-YYYY');
  }
}