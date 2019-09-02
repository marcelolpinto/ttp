export class User {
  constructor(user) {
    this.original = user;

    this.id = user._id;
    this.name = user.name;
    this.email = user.email;
    this.max_calories = user.max_calories;
    this.role = user.role;
  }
}