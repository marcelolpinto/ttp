export class User {
  constructor(user) {
    this.original = user;

    this.id = user._id;
    this.name = user.name;
    this.email = user.email;
    this.role = user.role;
    this.imageUrl = user.imageUrl;
  }
}